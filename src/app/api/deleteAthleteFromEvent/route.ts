import clientPromise from '@/app/lib/mongodb'
import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'

export const revalidate = 0

export async function POST(req) {
  try {
    const { id_event, athlete_id } = await req.json()

    const client = await clientPromise
    const db = client.db('Athlests')
    const collection = db.collection('event_with_athlests')

    await collection.updateOne(
      { id_event },
      {
        $pull: {
          athlete_ids: athlete_id,
          athletes_result: { id: athlete_id }, // เพิ่มการลบ result
        },
      }
    )

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (e) {
    console.error('Error updating document:', e.message, e.stack)
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
