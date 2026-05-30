import { NextResponse } from "next/server";
import connectdb from "@/lib/mongodb";
import refreshTokenModel from "@/models/refreshToken";

export async function POST(req: Request) {
  try {
    await connectdb();

    const refreshToken =
      req.headers.get("cookie")
        ?.split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith("refreshToken="))
        ?.split("=")[1] || "";

    if (refreshToken) {
      await refreshTokenModel.deleteOne({ token: refreshToken });
    }

    const response = NextResponse.json({
      success: true,
      message: "Logged out",
    });

    response.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error },
      { status: 500 }
    );
  }
}
