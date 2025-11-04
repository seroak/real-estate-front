import { mockProperties } from "@/src/msw/mockData";
import { NextRequest, NextResponse } from "next/server";
import { RealEstateResponse } from "@/src/types/real-estate";

export async function GET(request: NextRequest) {
  const allData = mockProperties;

  const searchParams = request.nextUrl.searchParams;
  const cursor = parseInt(searchParams.get("cursor") || "1");
  const limit = 10; // 한 페이지에 10개씩 보여주기

  const startIndex = (cursor - 1) * limit;
  const endIndex = cursor * limit;

  const paginatedData = allData.slice(startIndex, endIndex);

  const response: RealEstateResponse = {
    real_estate_list: paginatedData,
  };

  return NextResponse.json(response);
}
