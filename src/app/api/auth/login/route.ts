import clientPromise from '@/app/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 0

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise

    const { email, password } = await req.json()

    const db = client.db('Athlests')
    const customers = await db.collection('admin').findOne({ email: email })

    if (!customers) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 400 }
      )
    }

    if (customers.password !== password) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 400 }
      )
    }

    // encrypt _id easy to use
    const token = await Buffer.from(customers._id.toString()).toString('base64')

    // set token to cookie
    const response = NextResponse.json({ success: true, token })

    response.cookies.set('token', token, {
      maxAge: 60 * 60 * 24, // 1 day
      httpOnly: true,
    })

    return response
  } catch (e) {
    console.error('Error fetching documents:', e)
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
