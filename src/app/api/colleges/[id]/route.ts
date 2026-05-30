import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectdb from "@/lib/mongodb";

import college from "@/models/college";

import detailedcollege from "@/models/detailedcollege";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await connectdb();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid college ID" },
        { status: 400 }
      );
    }

    const basiccollege =
      await college.findById(id);

    if (!basiccollege) {
      return NextResponse.json(
        { success: false, message: "College not found" },
        { status: 404 }
      );
    }

    const detailcollege =
      await detailedcollege.findOne({
        name: basiccollege.name,
      });

    const mergeddata = {
      ...basiccollege.toObject(),
      ...detailcollege?.toObject(),
    };

    return NextResponse.json({
      success: true,
      data: mergeddata,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error,
    }, { status: 500 });
  }
}