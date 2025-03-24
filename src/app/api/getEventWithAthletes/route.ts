import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id_event");

    const client = await clientPromise;
    const db = client.db("Athlests");
    const collection = db.collection("event_with_athlests");

    // ทำการ aggregate เพื่อตรวจสอบว่า event นี้มีอยู่แล้วหรือไม่
    let event_with_athlests = await collection
      .aggregate([
        {
          $match: { id_event: id },
        },
        {
          $lookup: {
            from: "member", // Lookup members using athlete_ids
            localField: "athlete_ids",
            foreignField: "id",
            as: "athletes",
          },
        },
        {
          $lookup: {
            from: "events", // Lookup event based on id_event
            localField: "id_event",
            foreignField: "id",
            as: "event_info",
          },
        },
      ])
      .toArray();

    if (event_with_athlests.length === 0) {
      // ถ้าไม่มี event นี้ในฐานข้อมูล ให้ทำการ insert ข้อมูลใหม่
      await collection.insertOne({
        id_event: id,
        athlete_ids: [],
      });

      // ส่งค่ากลับพร้อมกับข้อมูล event ที่ไม่มี athlete
      return NextResponse.json([{ id_event: id, athletes: [], event: [] }]);
    }

    // check if event has athletes athletes_result
    if (event_with_athlests[0].athletes_result) {
      // and sort by point
      event_with_athlests = event_with_athlests.map((event) => {
        const athletes_result = event.athletes.map((athlete) => {
          const result = event.athletes_result.find(
            (result) => result.id === athlete.id
          );
          return {
            ...athlete,
            score: result?.score || 0,
            point: result?.point || 0,
            gold: result?.gold || 0,
            silver: result?.silver || 0,
            bronze: result?.bronze || 0,
          };
        });

        return {
          ...event,
          athletes: athletes_result,
        };
      });
    }

    return NextResponse.json(event_with_athlests);
  } catch (e) {
    console.error("Error fetching events:", e);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
