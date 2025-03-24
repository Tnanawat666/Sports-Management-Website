import { ObjectId } from 'mongodb'
import clientPromise from '@/app/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 0

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    let gender = url.searchParams.get('gender')
    const idIgnore = url.searchParams.get('idIgnore')

    if (gender === 'Male') gender = 'Men'
    if (gender === 'Female') gender = 'Women'

    const param: any = {}
    if (gender) param.gender = gender

    const client = await clientPromise
    const db = client.db('Athlests')

    if (idIgnore) {
      const ids = idIgnore.split(',').map((id) => new ObjectId(id))
      param._id = { $nin: ids }
    }

    const members = await db
      .collection('member')
      .find(param)
      .sort({ id: 1 })
      .toArray()

    return NextResponse.json(members)
  } catch (e) {
    console.error('Error fetching documents:', e)
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
