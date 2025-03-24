import clientPromise from '@/app/lib/mongodb'
import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'

export const revalidate = 0

export async function POST(req) {
  try {
    const {
      _id,
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

    if (!ObjectId.isValid(_id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ObjectId' },
        { status: 400 }
      )
    }

    const oid = new ObjectId(_id)

    const client = await clientPromise
    const db = client.db('Athlests')
    const collection = db.collection('member')

    const getAthletes = await collection.findOne({ _id: oid })

    if (!getAthletes) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      )
    }

    const update = {}

    // Check for fields that need updating
    if (id && id !== getAthletes.id) update.id = id
    if (firstName && firstName !== getAthletes.firstName)
      update.firstName = firstName
    if (lastName && lastName !== getAthletes.lastName)
      update.lastName = lastName
    if (gender && gender !== getAthletes.gender) update.gender = gender
    if (country && country !== getAthletes.country) update.country = country
    if (classification && classification !== getAthletes.classification)
      update.classification = classification
    if (dateOfBirth && dateOfBirth !== getAthletes.dateOfBirth)
      update.dateOfBirth = dateOfBirth
    if (email && email !== getAthletes.email) update.email = email
    if (file && file !== getAthletes.imgProfile) update.imgProfile = file

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { success: false, message: 'No fields to update' },
        { status: 400 }
      )
    }

    const updateResult = await collection.updateOne(
      { _id: oid },
      { $set: update }
    )

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Failed to update event' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (e) {
    console.error('Error updating document:', e.message, e.stack)
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
