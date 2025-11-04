import { mockProperties } from "@/src/msw/mockData";
import { NextRequest, NextResponse } from "next/server";
import { RealEstateResponse } from "@/src/types/real-estate";
import { PAGE_SIZE } from "@/src/constants";

export async function GET(request: NextRequest) {
  const allData = mockProperties;

  const searchParams = request.nextUrl.searchParams;
  const cursor = parseInt(searchParams.get("cursor") || "1");
  const limit = PAGE_SIZE; // 한 페이지에 10개씩 보여주기

  const startIndex = (cursor - 1) * limit;
  const endIndex = cursor * limit;

  const paginatedData = allData.slice(startIndex, endIndex);

  const response: RealEstateResponse = {
    total_count: allData.length,
    real_estate_list: paginatedData,
    // 다음 페이지가 있으면 다음 페이지 번호를, 없으면 null을 반환
    nextPage: endIndex < allData.length ? (cursor + 1).toString() : null,
    prevPage: cursor > 1 ? (cursor - 1).toString() : null,
  };

  return NextResponse.json(response);
}