import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export const revalidate = 0;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Athlests");
    const collection = db.collection("event_with_athlests");

    let eventResults = await collection
      .aggregate([
        {
          $lookup: {
            from: "member",
            localField: "athlete_ids",
            foreignField: "id",
            as: "athletes",
          },
        },
        {
          $lookup: {
            from: "events",
            localField: "id_event",
            foreignField: "id",
            as: "event_info",
          },
        },
        {
          $unwind: "$event_info",
        },
        {
          $addFields: {
            athletes: {
              $map: {
                input: "$athletes",
                as: "athlete",
                in: {
                  $mergeObjects: [
                    "$$athlete",
                    {
                      $let: {
                        vars: {
                          result: {
                            $arrayElemAt: [
                              {
                                $filter: {
                                  input: "$athletes_result",
                                  as: "result",
                                  cond: {
                                    $eq: ["$$result.id", "$$athlete.id"],
                                  },
                                },
                              },
                              0,
                            ],
                          },
                        },
                        in: {
                          score: { $ifNull: ["$$result.score", 0] },
                          point: { $ifNull: ["$$result.point", 0] },
                          gold: { $ifNull: ["$$result.gold", 0] },
                          silver: { $ifNull: ["$$result.silver", 0] },
                          bronze: { $ifNull: ["$$result.bronze", 0] },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            id_event: 1,
            event_info: 1,
            athletes: 1,
          },
        },
        { $sort: { "event_info.id": 1 } }, // Sort by event ID
      ])
      .toArray();

    return NextResponse.json(eventResults);
  } catch (e) {
    console.error("Error fetching all event results:", e);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
