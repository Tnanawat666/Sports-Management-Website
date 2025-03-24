import clientPromise from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const {
      date,
      id,
      gender,
      name,
      classification,
      time,
      stage,
      status,
      scoretype,
      remark,
    } = await req.json();

    if (
      !date ||
      !id ||
      !gender ||
      !name ||
      !classification ||
      !time ||
      !stage ||
      !status ||
      !scoretype
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("Athlests");
    const collection = db.collection("events");

    // conver date and time to ISO string
    const dateTimeString = `${date}T${time}:00`;
    const dateTimeISO = new Date(dateTimeString).toISOString();

    await collection.insertOne({
      date: dateTimeISO,
      id,
      gender,
      name,
      classification,
      stage,
      status,
      scoretype,
      remark,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error("Error adding document:", e);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
