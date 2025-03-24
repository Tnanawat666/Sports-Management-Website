import clientPromise from '@/app/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'

export const revalidate = 0

export async function POST(req: NextRequest) {
  try {
    const { _id } = await req.json()

    const client = await clientPromise
    const db = client.db('Athlests')
    const collection = db.collection('events')

    const oid = new ObjectId(_id)

    await collection.deleteOne({ _id: oid })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (e) {
    console.error('Error updating document:', e)
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
