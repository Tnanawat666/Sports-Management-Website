import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function POST(req) {
  try {
    const { id_event, athletes_result } = await req.json();

    const client = await clientPromise;
    const db = client.db("Athlests");
    const collection = db.collection("event_with_athlests");

    // Find the event
    const event = await collection.findOne({ id_event });

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    const existingResults = event.athletes_result || [];

    // Merge new results with existing results
    const updatedResults = [
      ...existingResults.map((oldResult) => {
        const newResult = athletes_result.find(
          (newAthlete) => newAthlete.id === oldResult.id
        );

        return newResult
          ? {
              ...oldResult,
              ...newResult,
              score1: newResult.score1 ?? oldResult.score1,
              score2: newResult.score2 ?? oldResult.score2,
              score3: newResult.score3 ?? oldResult.score3,
            }
          : oldResult;
      }),
      // Add new entries that were not previously in existingResults
      ...athletes_result.filter(
        (newAthlete) =>
          !existingResults.some((oldResult) => oldResult.id === newAthlete.id)
      ),
    ];

    // Update the database
    await collection.updateOne(
      { id_event },
      { $set: { athletes_result: updatedResults } }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error("Error updating document:", e.message, e.stack);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
