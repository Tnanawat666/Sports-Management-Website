import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 0

export async function POST(req: NextRequest) {
  try {
    // logout
    const response = NextResponse.json({ success: true, token: '' })

    response.cookies.set('token', '', {
      maxAge: 0,
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
