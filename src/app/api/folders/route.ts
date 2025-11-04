import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { folderName, user } = body;

  // 실제 애플리케이션에서는 이 데이터를 데이터베이스에 저장합니다.
  // 현재는 요청을 받았다는 것을 시뮬레이션하고 로그를 남깁니다.
  console.log(`Received request to create folder: '${folderName}' for user: '${user}'`);

  // 클라이언트에게 성공적으로 생성되었음을 알립니다.
  return NextResponse.json({ message: "Folder created successfully" }, { status: 201 });
}
