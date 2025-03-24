import clientPromise from '@/app/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 0

export async function POST(req: NextRequest) {
  try {
    const {
      firstName,
      lastName,
      id,
      gender,
      country,
      classification,
      dateOfBirth,
      email,
      file,
    } = await req.json()

    if (
      !firstName ||
      !lastName ||
      !id ||
      !gender ||
      !country ||
      !classification ||
      !dateOfBirth ||
      !email
    ) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('Athlests')
    const collection = db.collection('member')

    await collection.insertOne({
      firstName,
      lastName,
      id,
      gender,
      country,
      classification,
      dateOfBirth,
      email,
      imgProfile: file ?? null,
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (e) {
    console.error('Error adding document:', e)
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
