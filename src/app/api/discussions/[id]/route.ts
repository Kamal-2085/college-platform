import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import connectdb from "@/lib/mongodb";
import discussionModel from "@/models/discussion";
import discussionAnswerModel from "@/models/discussionAnswer";

export async function GET(
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

    const discussion = await discussionModel.findById(id);
    if (!discussion) {
      return NextResponse.json(
        { success: false, message: "Discussion not found" },
        { status: 404 },
      );
    }

    const answers = await discussionAnswerModel
      .find({ discussionId: discussion._id })
      .sort({ createdAt: 1 });

    return NextResponse.json({
      success: true,
      discussion: {
        id: discussion._id.toString(),
        title: discussion.title,
        body: discussion.body,
        authorName: discussion.authorName,
        answerCount: discussion.answerCount || 0,
        createdAt: discussion.createdAt,
        updatedAt: discussion.updatedAt,
      },
      answers: answers.map((item: any) => ({
        id: item._id.toString(),
        body: item.body,
        authorName: item.authorName,
        createdAt: item.createdAt,
      })),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
