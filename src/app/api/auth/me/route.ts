import { NextResponse } from "next/server";
import connectdb from "@/lib/mongodb";
import { verifyAccessToken } from "@/lib/auth";
import userModel from "@/models/user";

export async function GET(req: Request) {
  try {
    await connectdb();

    const accessToken =
      req.headers
        .get("cookie")
        ?.split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith("accessToken="))
        ?.split("=")[1] || "";

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    const { payload } = await verifyAccessToken(accessToken);
    const user = await userModel.findById(payload.userId).select("name email");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 },
    );
  }
}
