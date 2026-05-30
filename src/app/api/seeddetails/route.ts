import { NextResponse } from "next/server";

import connectdb from "@/lib/mongodb";

import detailedcollege from "@/models/detailedcollege";

import data from "../../../../DetailedColleges.json";

export async function GET() {
  try {
    await connectdb();

    await detailedcollege.deleteMany();

    await detailedcollege.insertMany(data);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error,
    });
  }
}