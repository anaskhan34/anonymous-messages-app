import { connectDB } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { Message } from "@/model/user.model";

export async function POST(request: Request) {
  await connectDB();

  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "No user found",
        },
        {
          status: 404,
        },
      );
    }

    // is user acceppting messages?
    if (!user.isAccesptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not acceppting the messages",
        },
        {
          status: 404,
        },
      );
    }

    // sending the messages
    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Error while sending the message", error);
    return Response.json(
      {
        success: false,
        message: "Error while sending the message",
      },
      {
        status: 500,
      },
    );
  }
}
