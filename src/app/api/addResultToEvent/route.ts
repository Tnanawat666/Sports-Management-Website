import clientPromise from '@/app/lib/mongodb'
import { NextResponse } from 'next/server'

export const revalidate = 0

export async function POST(req) {
  try {
    const { id_event, athletes_result } = await req.json()

    const client = await clientPromise
    const db = client.db('Athlests')
    const collection = db.collection('event_with_athlests')

    // ค้นหา event ตาม id_event
    const event = await collection.findOne({ id_event })

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      )
    }

    // นำผลการแข่งขันที่มีอยู่แล้วมารวมกับผลการแข่งขันใหม่
    const existingResults = event.athletes_result || []

    // รวมผลการแข่งขันเก่าและใหม่
    const updatedResults = [
      ...existingResults.map((oldResult) => {
        // หา athlete ใหม่ที่มี id เดียวกับของเก่า
        const newResult = athletes_result.find(
          (newAthlete) => newAthlete.id === oldResult.id
        )

        // ถ้าพบ athlete ใหม่ อัปเดตค่า
        return newResult ? { ...oldResult, ...newResult } : oldResult
      }),
      // เพิ่มรายการใหม่ที่ยังไม่มีใน existingResults
      ...athletes_result.filter(
        (newAthlete) =>
          !existingResults.some((oldResult) => oldResult.id === newAthlete.id)
      ),
    ]

    // อัปเดตผลการแข่งขันในฐานข้อมูล
    await collection.updateOne(
      { id_event },
      { $set: { athletes_result: updatedResults } }
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
