import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Khunsuekthai Buashaiyo",
    studentId: "660610743",
  });
};
