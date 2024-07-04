
import { NextResponse } from "next/server";
import firebase from "../../db/db";

export async function GET(request: any) {
    //count the number of documents in the collection
    //check if development or production
    if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({ roastCount: 0 }, { status: 200 });
    }
    const snapshot = await firebase.resumeRoastCollection.get();
    const roastCount = snapshot.size + 800//initial count of 500 roast,you can change it to 0 if you want to start from 0;
    return NextResponse.json({ roastCount }, { status: 200 });
}