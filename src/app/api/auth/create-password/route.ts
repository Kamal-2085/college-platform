import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectdb from "@/lib/mongodb";
import userModel from "@/models/user";
import refreshTokenModel from "@/models/refreshToken";
import { signAccessToken, signRefreshToken, verifyOtpToken } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/mailer";

const accessTokenMaxAge = 15 * 60;
const refreshTokenMaxAge = 7 * 24 * 60 * 60;

export async function POST(req: Request) {
  try {
    await connectdb();

    const body = await req.json();
    const name = (body?.name || "").trim();
    const email = (body?.email || "").toLowerCase().trim();
    const dob = body?.dob ? new Date(body.dob) : null;
    const password = body?.password || "";
    const confirmPassword = body?.confirmPassword || "";
    const otpToken = body?.otpToken || "";

    if (!name || !email || !dob || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );
    }

    if (Number.isNaN(dob.getTime())) {
      return NextResponse.json(
        { success: false, message: "Invalid date of birth" },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Passwords do not match" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    const otpVerification = await verifyOtpToken(otpToken);
    if (otpVerification.payload.email !== email) {
      return NextResponse.json(
        { success: false, message: "OTP verification failed" },
        { status: 401 },
      );
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      dob,
      password: passwordHash,
      isVerified: true,
    });

    await sendWelcomeEmail(email, name);

    const accessToken = await signAccessToken({
      userId: user._id.toString(),
      email: user.email,
    });

    const refreshToken = await signRefreshToken({
      userId: user._id.toString(),
      email: user.email,
    });

    await refreshTokenModel.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + refreshTokenMaxAge * 1000),
    });

    const response = NextResponse.json({
      success: true,
      message: "Account created",
      accessToken,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    };

    response.cookies.set("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: accessTokenMaxAge,
    });

    response.cookies.set("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: refreshTokenMaxAge,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
