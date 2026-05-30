import { NextResponse } from "next/server";
import connectdb from "@/lib/mongodb";
import college from "@/models/college";
import colleges from "../../../../CollegeList.json";

export async function GET() {
  try {
    await connectdb();

    await college.deleteMany();

    await college.insertMany(colleges);

    return NextResponse.json({
      success: true,
      message: "colleges seeded successfully",
      total: colleges.length,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error,
    });
  }
}