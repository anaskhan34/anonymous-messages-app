import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "react-email";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />

      <Preview>Your verification code is {otp}</Preview>

      <Tailwind>
        <Body className="m-0 bg-zinc-100 px-5 py-10 font-sans">
          <Container className="mx-auto max-w-lg rounded-xl bg-white px-8 py-10">
            <Text className="mb-8 text-center text-2xl font-bold text-zinc-900">
              Your App
            </Text>

            <Heading className="m-0 mb-4 text-center text-2xl font-bold leading-8 text-zinc-900">
              Verify your email address
            </Heading>

            <Text className="m-0 mb-4 text-base leading-6 text-zinc-600">
              Hi {username},
            </Text>

            <Text className="m-0 mb-5 text-base leading-6 text-zinc-600">
              Use the verification code below to verify your email address.
            </Text>

            <Section className="my-7 rounded-lg bg-zinc-100 px-5 py-5 text-center">
              <Text className="m-0 text-3xl font-bold leading-10 tracking-widest text-zinc-900">
                {otp}
              </Text>
            </Section>

            <Text className="m-0 mb-6 text-center text-sm leading-5 text-zinc-500">
              This code will expire in 10 minutes.
            </Text>

            <Text className="m-0 text-base leading-6 text-zinc-600">
              If you didn't request this code, you can safely ignore this email.
            </Text>

            <Section className="mt-8 border-t border-solid border-zinc-200 pt-6">
              <Text className="m-0 text-center text-xs leading-5 text-zinc-400">
                © {new Date().getFullYear()} Annoymous Messages. All rights
                reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
