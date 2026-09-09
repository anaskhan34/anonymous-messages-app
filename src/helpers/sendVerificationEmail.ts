import VerificationEmail from "../../emails/verificationEmail";
import { resend } from "@/lib/email.resend";
import { ApiResponse } from "@/types/ApiResponse";
import { success } from "zod";

export async function sendVerificationEmail(
  username: string,
  email: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: "testthisbug6@getMaxListeners.com",
      subject: "Annonymous Messages | Verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return {
      success: true,
      message: "Verification email send successfully",
    };
  } catch (error) {
    console.error("Error sending verification emial", error);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
