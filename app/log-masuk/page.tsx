import type { Metadata } from "next";
import { TeacherLogin } from "@/components/cikgu/TeacherLogin";

export const metadata: Metadata = { title: "Log Masuk Cikgu | Pandaikids" };

function safeNext(value: string | undefined) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/aktiviti/bina/";
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams;
  return <TeacherLogin nextPath={safeNext(params.next)} googleClientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""} />;
}
