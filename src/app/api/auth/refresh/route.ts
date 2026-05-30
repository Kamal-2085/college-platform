import { NextResponse } from "next/server";
import connectdb from "@/lib/mongodb";
import refreshTokenModel from "@/models/refreshToken";
import { signAccessToken, verifyRefreshToken } from "@/lib/auth";

const accessTokenMaxAge = 15 * 60;

export async function POST(req: Request) {
  try {
    await connectdb();

    const refreshToken =
      req.headers.get("cookie")
        ?.split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith("refreshToken="))
        ?.split("=")[1] || "";

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "Refresh token missing" },
        { status: 401 }
      );
    }

    const tokenRecord = await refreshTokenModel.findOne({
      token: refreshToken,
    });

    if (!tokenRecord) {
      return NextResponse.json(
        { success: false, message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    if (tokenRecord.expiresAt.getTime() < Date.now()) {
      await refreshTokenModel.deleteOne({ _id: tokenRecord._id });
      return NextResponse.json(
        { success: false, message: "Refresh token expired" },
        { status: 401 }
      );
    }

    const { payload } = await verifyRefreshToken(refreshToken);

    const accessToken = await signAccessToken({
      userId: payload.userId,
      email: payload.email,
    });

    const response = NextResponse.json({
      success: true,
      accessToken,
    });

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: accessTokenMaxAge,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error },
      { status: 500 }
    );
  }
}
