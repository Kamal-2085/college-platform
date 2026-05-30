import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectdb from "@/lib/mongodb";
import userModel from "@/models/user";
import refreshTokenModel from "@/models/refreshToken";
import { signAccessToken, signRefreshToken } from "@/lib/auth";

const accessTokenMaxAge = 15 * 60;
const refreshTokenMaxAge = 7 * 24 * 60 * 60;

export async function POST(req: Request) {
  try {
    await connectdb();

    const body = await req.json();
    const email = (body?.email || "").toLowerCase().trim();
    const password = body?.password || "";

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await userModel
      .findOne({ email })
      .select("+password");

    if (!user || !user.isVerified) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

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
      accessToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
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
    return NextResponse.json(
      { success: false, error },
      { status: 500 }
    );
  }
}
