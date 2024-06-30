import { NextResponse } from "next/server";

// To handle a GET request to /api
export async function GET(request: any) {
    // Do whatever you want
    return NextResponse.json({ message: "Server is running.", health: "Good" }, { status: 200 });
}