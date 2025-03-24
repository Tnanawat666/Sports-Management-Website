import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export const revalidate = 0;

export async function POST(req) {
  try {
    const {
      _id,
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

    if (!ObjectId.isValid(_id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ObjectId" },
        { status: 400 }
      );
    }

    const oid = new ObjectId(_id);

    const client = await clientPromise;
    const db = client.db("Athlests");
    const collection = db.collection("events");

    const getEvent = await collection.findOne({ _id: oid });

    if (!getEvent) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    const update = {};

    // Check for fields that need updating
    if (id && id !== getEvent.id) update.id = id;
    if (date && time && `${date}T${time}:00` !== getEvent.date) {
      const dateTimeString = `${date}T${time}:00`;
      const dateTime = new Date(dateTimeString); // Parse the date string

      update.date = dateTime.toISOString(); // Convert to ISO string for MongoDB
    }
    if (gender && gender !== getEvent.gender) update.gender = gender;
    if (name && name !== getEvent.name) update.name = name;
    if (classification && classification !== getEvent.classification)
      update.classification = classification;
    if (stage && stage !== getEvent.stage) update.stage = stage;
    if (status && status !== getEvent.status) update.status = status;
    if (scoretype && scoretype !== getEvent.scoretype)
      update.scoretype = scoretype;
    if (remark && remark !== getEvent.remark) update.remark = remark;

    console.log(update.scoretype);

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { success: false, message: "No fields to update" },
        { status: 400 }
      );
    }

    const updateResult = await collection.updateOne(
      { _id: oid },
      { $set: update }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Failed to update event" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error("Error updating document:", e.message, e.stack);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
