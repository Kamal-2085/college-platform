import { NextResponse } from "next/server";
import connectdb from "@/lib/mongodb";
import otpModel from "@/models/otp";
import { signOtpToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectdb();

    const body = await req.json();
    const email = (body?.email || "").toLowerCase().trim();
    const otp = (body?.otp || "").trim();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const record = await otpModel.findOne({ email, otp });
    if (!record) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    if (record.expiresAt.getTime() < Date.now()) {
      await otpModel.deleteOne({ _id: record._id });
      return NextResponse.json(
        { success: false, message: "OTP expired" },
        { status: 400 }
      );
    }

    await otpModel.deleteOne({ _id: record._id });

    const otpToken = await signOtpToken(email);

    return NextResponse.json({
      success: true,
      message: "OTP verified",
      otpToken,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error },
      { status: 500 }
    );
  }
}
