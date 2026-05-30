import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import connectdb from "@/lib/mongodb";
import { verifyAccessToken } from "@/lib/auth";
import savedCollegeModel from "@/models/savedCollege";
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

export async function GET(request: NextRequest) {
  try {
    await connectdb();

    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const saved = await savedCollegeModel
      .find({ userId })
      .populate("collegeId");

    return NextResponse.json({
      success: true,
      data: saved.map((item: any) => ({
        id: item._id.toString(),
        collegeId: item.collegeId?._id?.toString(),
        college: item.collegeId || null,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectdb();

    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const collegeId = body?.collegeId || "";

    if (!collegeId) {
      return NextResponse.json(
        { success: false, message: "College ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(collegeId)) {
      return NextResponse.json(
        { success: false, message: "Invalid college ID" },
        { status: 400 }
      );
    }

    const collegeExists = await collegeModel.exists({ _id: collegeId });
    if (!collegeExists) {
      return NextResponse.json(
        { success: false, message: "College not found" },
        { status: 404 }
      );
    }

    const existing = await savedCollegeModel.findOne({
      userId,
      collegeId,
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Already saved",
      });
    }

    await savedCollegeModel.create({ userId, collegeId });

    return NextResponse.json({
      success: true,
      message: "Saved",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectdb();

    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const collegeId = body?.collegeId || "";

    if (!collegeId) {
      return NextResponse.json(
        { success: false, message: "College ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(collegeId)) {
      return NextResponse.json(
        { success: false, message: "Invalid college ID" },
        { status: 400 }
      );
    }

    await savedCollegeModel.deleteOne({ userId, collegeId });

    return NextResponse.json({
      success: true,
      message: "Removed",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error },
      { status: 500 }
    );
  }
}
