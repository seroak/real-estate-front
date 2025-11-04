import { mockProperties } from "@/src/msw/mockData";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  // In a real application, you might want to handle pagination, filtering, etc.
  // For this portfolio version, we'll just return the whole mock data set.
  const data = mockProperties;

  const newData = data.map((object) => ({
    ...object, // 기존 속성 복사
    _id: crypto.randomBytes(16).toString("hex"), // 새로운 key 추가
  }));
  return NextResponse.json({ real_estate_list: newData });
}
