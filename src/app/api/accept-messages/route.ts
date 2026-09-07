import { connectDB } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      },
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAccesptingMessages: acceptMessages },
      { new: true },
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "failed to update user status to accept messages",
        },
        {
          status: 401,
        },
      );
    }
    return Response.json(
      {
        success: true,
        message: "Messages acceptance status updated successfuly",
        updatedUser,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("failed to update user status to accept messages", error);
    return Response.json(
      {
        success: false,
        message: "failed to update user status to accept messages",
      },
      {
        status: 401,
      },
    );
  }
}

// get req
export async function GET(request: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      },
    );
  }

  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "failed to found the user",
        },
        {
          status: 404,
        },
      );
    }
    return Response.json(
      {
        success: true,
        message: "User found successfuly",
        isAccesptingMessages: foundUser.isAccesptingMessages,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("Error while finding Messages Status", error);
    return Response.json(
      {
        success: false,
        message: "Error while finding Messages Status",
      },
      {
        status: 500,
      },
    );
  }
}
