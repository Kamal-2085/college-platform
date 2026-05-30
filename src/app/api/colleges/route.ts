import { NextResponse } from "next/server";
import connectdb from "@/lib/mongodb";
import college from "@/models/college";
import detailedcollege from "@/models/detailedcollege";
export async function POST(req: Request) {
  try {
    await connectdb();

    const body = await req.json();

    if (!body?.name || typeof body.name !== "string") {
      return NextResponse.json(
        { success: false, message: "College name is required" },
        { status: 400 },
      );
    }

    if (body.fees !== undefined && typeof body.fees !== "number") {
      return NextResponse.json(
        { success: false, message: "Fees must be a number" },
        { status: 400 },
      );
    }

    if (body.rating !== undefined && typeof body.rating !== "number") {
      return NextResponse.json(
        { success: false, message: "Rating must be a number" },
        { status: 400 },
      );
    }

    const newcollege = await college.create(body);

    return NextResponse.json({
      success: true,
      data: newcollege,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectdb();

    const base = `${req.headers.get("x-forwarded-proto") || "http"}://${
      req.headers.get("host") || "localhost"
    }`;
    const { searchParams } = new URL(req.url, base);

    const search = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";
    const minRating = Number(searchParams.get("minRating") || "");
    const maxFees = Number(searchParams.get("maxFees") || "");
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("limit") || 12)),
    );

    const filters: any[] = [];

    if (search) {
      filters.push({
        $or: [
          {
            name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            location: {
              $regex: search,
              $options: "i",
            },
          },
          {
            description: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      });
    }

    if (location) {
      filters.push({
        location: {
          $regex: location,
          $options: "i",
        },
      });
    }

    if (!Number.isNaN(minRating) && minRating > 0) {
      filters.push({
        rating: {
          $gte: minRating,
        },
      });
    }

    if (!Number.isNaN(maxFees) && maxFees > 0) {
      filters.push({
        fees: {
          $lte: maxFees,
        },
      });
    }

    const query = filters.length ? { $and: filters } : {};

    const total = await college.countDocuments(query);

    const colleges = await college
      .find(query)
      .sort({ rating: -1, name: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const names = colleges.map((item: any) => item.name);
    const detailedcolleges = await detailedcollege.find({
      name: { $in: names },
    });

    const detailByName = new Map(
      detailedcolleges.map((detail: any) => [detail.name, detail]),
    );

    const mergedcolleges = colleges.map((basic: any) => {
      const detail = detailByName.get(basic.name);

      // Prefer fields from the basic record if present, otherwise fall back to detailed record
      return {
        ...basic.toObject(),
        overview: basic.overview || detail?.overview || null,
        courses:
          basic.courses && basic.courses.length
            ? basic.courses
            : detail?.courses || [],
        reviews:
          basic.reviews && basic.reviews.length
            ? basic.reviews
            : detail?.reviews || [],
        // Prefer the detailed college placements (percentage) when available
        placements: detail?.placements || basic.placements || null,
        // keep a legacy/detailed field for clarity
        detailedplacements: detail?.placements || null,
      };
    });

    return NextResponse.json({
      success: true,
      count: mergedcolleges.length,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      data: mergedcolleges,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error,
    });
  }
}
