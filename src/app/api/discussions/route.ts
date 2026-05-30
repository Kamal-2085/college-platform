import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import connectdb from "@/lib/mongodb";
import discussionModel from "@/models/discussion";
import userModel from "@/models/user";
import { verifyAccessToken } from "@/lib/auth";

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

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export async function GET(request: NextRequest) {
  try {
    await connectdb();

    const base = `${request.headers.get("x-forwarded-proto") || "http"}://${
      request.headers.get("host") || "localhost"
    }`;
    const { searchParams } = new URL(request.url, base);
    const limitParam = Number(searchParams.get("limit") || "20");
    const limit = clamp(Number.isNaN(limitParam) ? 20 : limitParam, 1, 50);

    const discussions = await discussionModel
      .find()
      .sort({ updatedAt: -1 })
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: discussions.map((item: any) => ({
        id: item._id.toString(),
        title: item.title,
        body: item.body,
        authorName: item.authorName,
        answerCount: item.answerCount || 0,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectdb();

    const body = await request.json();
    const title = (body?.title || "").trim();
    const content = (body?.body || "").trim();
    let authorName = (body?.authorName || "").trim();

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: "Title and question are required" },
        { status: 400 },
      );
    }

    const userId = await getUserId(request);
    if (userId) {
      const user = await userModel.findById(userId).select("name");
      if (user?.name) {
        authorName = user.name;
      }
    }

    if (!authorName) {
      authorName = "Anonymous";
    }

    const discussion = await discussionModel.create({
      title,
      body: content,
      authorName,
      authorId: userId || undefined,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: discussion._id.toString(),
        title: discussion.title,
        body: discussion.body,
        authorName: discussion.authorName,
        answerCount: discussion.answerCount || 0,
        createdAt: discussion.createdAt,
        updatedAt: discussion.updatedAt,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
