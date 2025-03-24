import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // get cookies from the request
    const cookies = req.cookies;
    const tokenCookie = cookies.get("token");

    if (!tokenCookie) {
      return NextResponse.json({ success: false, auth: false });
    }

    // if token is found
    const token = await Buffer.from(tokenCookie?.value, "base64").toString(
      "ascii"
    );

    const id = new ObjectId(token);

    const client = await clientPromise;
    const db = client.db("Athlests");
    const customers = await db.collection("admin").findOne({
      _id: id,
    });

    if (!customers) {
      return NextResponse.json({ success: false, auth: false });
    }

    return NextResponse.json({ success: true, auth: true });
  } catch (e) {
    console.error("Error fetching documents:", e);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
