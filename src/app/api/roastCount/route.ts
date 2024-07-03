
import { NextResponse } from "next/server";
import resumeRoastCollection from "../../db/db";
// To handle a GET request to /api
export const revalidate = 0; //revalidate api every 1 second
export const dynamic = 'force-dynamic';
export async function GET(request: any) {
    //count the number of documents in the collection
    const snapshot = await resumeRoastCollection.get();
    const roastCount = snapshot.size + 500//initial count of 500 roast,you can change it to 0 if you want to start from 0;
    return NextResponse.json({ roastCount }, { status: 200 });
}