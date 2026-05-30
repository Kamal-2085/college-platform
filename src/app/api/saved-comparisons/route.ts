import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import connectdb from "@/lib/mongodb";
import { verifyAccessToken } from "@/lib/auth";
import savedComparisonModel from "@/models/savedComparison";
import collegeModel from "@/models/college";

async function getUserId(request: NextRequest) {
  const token =
    request.cookies.get("accessToken")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return null;
  }

  try {
    const { payload } = await verifyAccessToken(token);
    return payload.userId;
  } catch (error) {
    return null;
  }
}

function normalizeIds(collegeIds: string[]) {
  return [...collegeIds].sort();
}

export async function GET(request: NextRequest) {
  try {
    await connectdb();

    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const saved = await savedComparisonModel
      .find({ userId })
      .populate("collegeIds");

    return NextResponse.json({
      success: true,
      data: saved.map((item: any) => ({
        id: item._id.toString(),
        comparisonKey: item.comparisonKey,
        collegeIds: item.collegeIds?.map((c: any) => c?._id?.toString()),
        colleges: item.collegeIds || [],
      })),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectdb();

    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const collegeIds: string[] = Array.isArray(body?.collegeIds)
      ? body.collegeIds.filter(
          (id: unknown): id is string => typeof id === "string",
        )
      : [];

    if (collegeIds.length < 2 || collegeIds.length > 3) {
      return NextResponse.json(
        { success: false, message: "Two or three college IDs are required" },
        { status: 400 },
      );
    }

    const invalidIds = collegeIds.filter(
      (id: string) => !mongoose.Types.ObjectId.isValid(id),
    );

    if (invalidIds.length) {
      return NextResponse.json(
        { success: false, message: "Invalid college ID in request" },
        { status: 400 },
      );
    }

    const uniqueIds = [...new Set<string>(collegeIds)];
    if (uniqueIds.length !== collegeIds.length) {
      return NextResponse.json(
        { success: false, message: "Duplicate college IDs are not allowed" },
        { status: 400 },
      );
    }

    const existingCount = await collegeModel.countDocuments({
      _id: { $in: uniqueIds },
    });

    if (existingCount !== uniqueIds.length) {
      return NextResponse.json(
        { success: false, message: "One or more colleges not found" },
        { status: 404 },
      );
    }

    const normalized = normalizeIds(collegeIds);
    const comparisonKey = normalized.join(":");

    const existing = await savedComparisonModel.findOne({
      userId,
      comparisonKey,
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Already saved",
      });
    }

    await savedComparisonModel.create({
      userId,
      comparisonKey,
      collegeIds: normalized,
    });

    return NextResponse.json({
      success: true,
      message: "Saved",
    });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectdb();

    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const collegeIds: string[] = Array.isArray(body?.collegeIds)
      ? body.collegeIds.filter(
          (id: unknown): id is string => typeof id === "string",
        )
      : [];

    if (collegeIds.length < 2 || collegeIds.length > 3) {
      return NextResponse.json(
        { success: false, message: "Two or three college IDs are required" },
        { status: 400 },
      );
    }

    const invalidIds = collegeIds.filter(
      (id: string) => !mongoose.Types.ObjectId.isValid(id),
    );

    if (invalidIds.length) {
      return NextResponse.json(
        { success: false, message: "Invalid college ID in request" },
        { status: 400 },
      );
    }

    const uniqueIds = [...new Set<string>(collegeIds)];
    if (uniqueIds.length !== collegeIds.length) {
      return NextResponse.json(
        { success: false, message: "Duplicate college IDs are not allowed" },
        { status: 400 },
      );
    }

    const normalized = normalizeIds(uniqueIds);
    const comparisonKey = normalized.join(":");

    await savedComparisonModel.deleteOne({
      userId,
      comparisonKey,
    });

    return NextResponse.json({
      success: true,
      message: "Removed",
    });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
