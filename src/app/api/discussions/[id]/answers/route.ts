import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import connectdb from "@/lib/mongodb";
import discussionModel from "@/models/discussion";
import discussionAnswerModel from "@/models/discussionAnswer";
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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectdb();

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid discussion ID" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const content = (body?.body || "").trim();
    let authorName = (body?.authorName || "").trim();

    if (!content) {
      return NextResponse.json(
        { success: false, message: "Answer is required" },
        { status: 400 },
      );
    }

    const discussion = await discussionModel.findById(id);
    if (!discussion) {
      return NextResponse.json(
        { success: false, message: "Discussion not found" },
        { status: 404 },
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

    const answer = await discussionAnswerModel.create({
      discussionId: discussion._id,
      body: content,
      authorName,
      authorId: userId || undefined,
    });

    await discussionModel.updateOne(
      { _id: discussion._id },
      { $inc: { answerCount: 1 }, $set: { updatedAt: new Date() } },
    );

    return NextResponse.json({
      success: true,
      data: {
        id: answer._id.toString(),
        body: answer.body,
        authorName: answer.authorName,
        createdAt: answer.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
