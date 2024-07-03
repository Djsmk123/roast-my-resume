import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

// To handle a GET request to /api
export async function GET(request: any) {
    // Do whatever you want
    return NextResponse.json({ message: "Server is running.", health: "Good" }, { status: 200 });
}