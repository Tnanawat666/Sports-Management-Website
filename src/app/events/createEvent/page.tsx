'use client'

import axios from 'axios'
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import Swal from 'sweetalert2'

import StageJSON from '../../master/stage.json'
import StatusJSON from '../../master/status.json'
import ScoreTypeJson from '../../master/scoretype.json'

export default function page() {
  const router = useRouter()
  const [events, setEvents] = useState([
    {
      date: '',
      id: '',
      name: '',
      gender: 'Male',
      classification: '',
      time: '',
      stage: StageJSON[0].name,
      status: StatusJSON[0].name,
      scoretype: '',
      remark: '',
    },
  ])
  const [loading, setLoading] = useState(false)

  const handleEventChange = (index, field, value) => {
    const updatedEvents = [...events]
    updatedEvents[index][field] = value
    setEvents(updatedEvents)
  }

  const handleAddEvent = () => {
    setEvents([
      ...events,
      {
        date: '',
        id: '',
        name: '',
        gender: 'Male',
        classification: '',
        time: '',
        stage: StageJSON[0].name,
        status: StatusJSON[0].name,
        scoretype: '',
        remark: '',
      },
    ])
  }

  const handleRemoveEvent = (index) => {
    setEvents(events.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      events.some(
        (event) =>
          !event.date ||
          !event.id ||
          !event.gender ||
          !event.name ||
          !event.classification ||
          !event.time
      )
    ) {
      Swal.fire({
        title: 'Missing required fields',
        icon: 'error',
      })
      return
    }

    // setups for the events can sussessfully created in the database {index,completed}

    setLoading(true)
    try {
      for (const event of events) {
        const {
          date,
          time,
          id,
          name,
          gender,
          classification,
          stage,
          status,
          scoretype,
          remark,
        } = event
        const res = await axios.post('/api/createEvents', {
          date,
          time,
          id,
          gender,
          name,
          classification,
          stage,
          status,
          scoretype,
          remark,
        })
        if (!res.data.success) {
          await Swal.fire({
            title: 'Error creating events',
            icon: 'error',
          })
          return
        }
      }
    } catch (e) {
      console.error('Error adding events:', e)
      alert('Internal Server Error')
    } finally {
      setLoading(false)
    }

    Swal.fire({
      title: 'Events created successfully',
      icon: 'success',
    })
    router.push('/events')
    setLoading(false)
  }

  return (
    <div className='m-10'>
      <h1 className='text-xl font-bold text-center'>Create New Events</h1>
      <form className='mt-5 flex flex-col gap-4'>
        {events.map((event, index) => (
          <div key={index} className='border p-4 mb-4 rounded-md'>
            <div className='flex justify-end'>
              {events.length > 1 && (
                <button
                  type='button'
                  className='btn btn-error btn-xs'
                  onClick={() => handleRemoveEvent(index)}
                >
                  Remove
                </button>
              )}
            </div>
            <div className='flex justify-evenly'>
              <label className='form-control w-full max-w-xs'>
                <span className='label-text'>Date*</span>
                <input
                  type='date'
                  className='input input-bordered w-full max-w-xs'
                  onChange={(e) =>
                    handleEventChange(index, 'date', e.target.value)
                  }
                  value={event.date}
                />
              </label>
              <label className='form-control w-full max-w-xs'>
                <span className='label-text'>Time*</span>
                <input
                  type='time'
                  className='input input-bordered w-full max-w-xs'
                  onChange={(e) =>
                    handleEventChange(index, 'time', e.target.value)
                  }
                  value={event.time}
                />
              </label>
              <label className='form-control w-full max-w-xs'>
                <span className='label-text'>ID*</span>
                <input
                  type='text'
                  className='input input-bordered w-full max-w-xs'
                  onChange={(e) =>
                    handleEventChange(index, 'id', e.target.value)
                  }
                  value={event.id}
                />
              </label>
            </div>
            <div className='flex justify-evenly'>
              <label className='form-control w-full max-w-xs'>
                <span className='label-text'>Name*</span>
                <input
                  type='text'
                  className='input input-bordered w-full max-w-xs'
                  onChange={(e) =>
                    handleEventChange(index, 'name', e.target.value)
                  }
                  value={event.name}
                />
              </label>
              <label className='form-control w-full max-w-xs'>
                <span className='label-text'>Gender*</span>
                <select
                  className='select select-bordered w-full max-w-xs'
                  onChange={(e) =>
                    handleEventChange(index, 'gender', e.target.value)
                  }
                  value={event.gender}
                >
                  <option value='Male'>Male</option>
                  <option value='Female'>Female</option>
                  <option value='Not Prefer'>Not Prefer</option>
                </select>
              </label>
              <label className='form-control w-full max-w-xs'>
                <span className='label-text'>Classification*</span>
                <input
                  type='text'
                  className='input input-bordered w-full max-w-xs'
                  onChange={(e) =>
                    handleEventChange(index, 'classification', e.target.value)
                  }
                  value={event.classification}
                />
              </label>
            </div>
            <div className='flex justify-evenly'>
              <label className='form-control w-full max-w-xs'>
                <span className='label-text'>Stage</span>
                <select
                  className='select select-bordered w-full max-w-xs'
                  onChange={(e) =>
                    handleEventChange(index, 'stage', e.target.value)
                  }
                  value={event.stage}
                >
                  {StageJSON.map((stage) => (
                    <option key={stage.name} value={stage.name}>
                      {stage.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className='form-control w-full max-w-xs'>
                <span className='label-text'>Status</span>
                <select
                  className='select select-bordered w-full max-w-xs'
                  onChange={(e) =>
                    handleEventChange(index, 'status', e.target.value)
                  }
                  value={event.status}
                >
                  {StatusJSON.map((status) => (
                    <option key={status.name} value={status.name}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className='form-control w-full max-w-xs'>
                <span className='label-text'>Type of score</span>
                <select
                  className='select select-bordered w-full max-w-xs'
                  onChange={(e) =>
                    handleEventChange(index, 'scoretype', e.target.value)
                  }
                  value={event.scoretype}
                >
                  {ScoreTypeJson.map((scoretype) => (
                    <option key={scoretype.name} value={scoretype.name}>
                      {scoretype.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className='flex justify-evenly'>

            </div>
            <label className='form-control w-full'>
              <span className='label-text'>Remark</span>
              <textarea
                className='textarea textarea-bordered w-full'
                onChange={(e) =>
                  handleEventChange(index, 'remark', e.target.value)
                }
                value={event.remark}
              />
            </label>
          </div>
        ))}

        <div className='flex justify-end gap-5'>
          <button
            type='button'
            className='btn btn-secondary'
            onClick={handleAddEvent}
          >
            Add Another Event
          </button>
          <button
            type='submit'
            className='btn btn-primary'
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Events'}
          </button>
        </div>
      </form>
    </div>
  )
}
