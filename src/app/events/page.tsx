'use client'

import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { MdEdit } from 'react-icons/md'
import { MdDelete } from 'react-icons/md'
import Swal from 'sweetalert2'

import StageJSON from '../master/stage.json'
import StatusJSON from '../master/status.json'
import ScoreTypeJson from '../master/scoretype.json'
import { ModalUpdateEvent } from '../compo/modalUpdateEvent'
import fetchAuth from '../lib/getAuth'
import { useParams, usePathname, useSearchParams } from 'next/navigation'

const stageMap = Object.fromEntries(
  StageJSON.map((stage) => [stage.name, stage.label])
)

const statusMap = Object.fromEntries(
  StatusJSON.map((status) => [status.name, status.label])
)

const scoreTypeMap = Object.fromEntries(
  ScoreTypeJson.map((scoreType) => [scoreType.name, scoreType.label])
)

export default function Page() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [auth, setAuth] = useState(false)

  const [_id, set_id] = useState('')
  const [date, setDate] = useState('')
  const [id, setID] = useState('')
  const [name, setName] = useState('')
  const [gender, setGender] = useState('')
  const [classification, setClassification] = useState('')
  const [time, setTime] = useState('')
  const [stage, setStage] = useState('')
  const [status, setStatus] = useState('')
  const [scoretype, setScoreType] = useState('')
  const [remark, setRemark] = useState('')
  const [loadingUpdate, setLoadingUpdate] = useState(false)

  // get param from url http://localhost:3000/events?date=123 (123 is param)
  const param = useSearchParams()

  const fetchEvent = async () => {
    try {
      const date = param.get('date')
      let res = await axios.get('/api/getEvent?date=' + date)
      if (date === 'all') {
        res = await axios.get('/api/getEvent')
      } else
        setEvents(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // const handleUpdate = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setLoadingUpdate(true)
  //   try {
  //     console.log(date, id)
  //     const res = await axios.post('/api/updateEvent', {
  //       _id,
  //       date,
  //       id,
  //       gender,
  //       name,
  //       classification,
  //       time,
  //       stage,
  //       status,
  //       remark,
  //     })
  //     if (res.data.success) {
  //       Swal.fire({
  //         title: 'Event updated successfully',
  //         icon: 'success',
  //       })
  //       fetchEvent()
  //     }
  //   } catch (e) {
  //     console.error('Error updating document:', e)
  //     Swal.fire({
  //       title: 'Error updating event',
  //       text: 'Internal Server Error',
  //       icon: 'error',
  //     })
  //   } finally {
  //     setLoadingUpdate(false)
  //     document.getElementById('edit_event').close()
  //   }
  // }

  const handleDelete = async (id) => {
    await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this event!',
      icon: 'warning',
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      loaderHtml: '<span class="loading loading-lg"></span>',
      showLoaderOnConfirm: true,
      // Immmmm
      preConfirm: async () => {
        try {
          await axios.post('/api/deleteEvent', { _id: id })
        } catch (e) {
          console.error('Error deleting document:', e)
          Swal.fire({
            title: 'Error deleting event',
            text: 'Internal Server Error',
            icon: 'error',
          })
        } finally {
          await fetchEvent()
        }
      },
      //
    })
  }

  useEffect(() => {
    fetchAuth().then((data) => {
      setAuth(data)
    })
    fetchEvent()
  }, [])

  useEffect(() => {
    fetchEvent()
  }, [param])

  const [sortedEvents, setSortedEvents] = useState(events);

  useEffect(() => {
    // Sort the events by date when the events change
    const sorted = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));
    setSortedEvents(sorted);
  }, [events]);


  return (
    <div>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Event</h1>
        {auth && (
          <Link
            className='btn btn-primary btn-outline'
            href='/events/createEvent'
          >
            Add Event
          </Link>
        )}
      </div>

      {/* Choose Date */}
      <div className='flex items-center gap-3 mt-5'>
        <button
          className={`btn btn-primary btn-outline btn-xs ${param.get('date') === '' ? 'btn-active' : ''
            }`}
          onClick={() => {
            const newParams = new URLSearchParams(param.toString())
            newParams.set('date', '')
            window.history.replaceState(null, '', `?${newParams.toString()}`)
          }}
        >
          All
        </button>
        <button
          className={`btn btn-primary btn-outline btn-xs ${param.get('date') === '2024-01-18' ? 'btn-active' : ''
            }`}
          onClick={() => {
            const newParams = new URLSearchParams(param.toString())
            newParams.set('date', '2024-01-18')
            window.history.replaceState(null, '', `?${newParams.toString()}`)
          }}
        >
          1/18/2024
        </button>
        <button
          className={`btn btn-primary btn-outline btn-xs ${param.get('date') === '2024-01-19' ? 'btn-active' : ''
            }`}
          onClick={() => {
            const newParams = new URLSearchParams(param.toString())
            newParams.set('date', '2024-01-19')
            window.history.replaceState(null, '', `?${newParams.toString()}`)
          }}
        >
          1/19/2024
        </button>
        <button
          className={`btn btn-primary btn-outline btn-xs ${param.get('date') === '2024-01-20' ? 'btn-active' : ''
            }`}
          onClick={() => {
            const newParams = new URLSearchParams(param.toString())
            newParams.set('date', '2024-01-20')
            window.history.replaceState(null, '', `?${newParams.toString()}`)
          }}
        >
          1/20/2024
        </button>
      </div>

      <div className='overflow-x-auto mt-5'>
        {loading ? (
          <span className='loading loading-dots loading-lg'></span>
        ) : sortedEvents.length === 0 ? (
          <p>No members found.</p>
        ) : (
          <table className='table'>
            <thead>
              <tr>
                <th>Date</th>
                <th className='text-center'>ID</th>
                <th className='text-center'>Gender</th>
                <th className='text-center'>Name</th>
                <th className='text-center'>Classification</th>
                <th className='text-center'>Stage</th>
                <th className='text-center'>Status</th>
                <th className='text-center'>Type of score</th>
                <th className='text-center'>Remark</th>
                <th className='text-center'>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedEvents.map((event, index) => {
                const dateMap = new Date(event.date).toLocaleDateString()
                const timeMap = new Date(event.date).toLocaleTimeString(
                  'th-TH',
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                )
                return (
                  <tr key={index} className='hover:bg-gray-100'>
                    <td>
                      <div className='flex items-center gap-3'>
                        <div>
                          <div className='font-bold'>{dateMap}</div>
                          <div className='text-sm opacity-50'>{timeMap}</div>
                        </div>
                      </div>
                    </td>
                    <td className='text-center'>{event.id}</td>
                    <td className='text-center'>{event.gender}</td>
                    <td className='text-center'>{event.name}</td>
                    <td className='text-center'>{event.classification}</td>
                    <td className='text-center'>
                      {stageMap[event.stage] || event.stage}
                    </td>
                    <td className='text-center'>
                      {statusMap[event.status] || event.status}
                    </td>
                    <td className='text-center'>
                      {scoreTypeMap[event.scoretype] || event.scoretype}
                    </td>
                    <td className='text-center'>{event.remark || '-'}</td>
                    <td className='text-center flex justify-center content-center gap-2'>
                      {auth && (
                        <button
                          className='btn btn-error btn-outline btn-sm'
                          onClick={() => handleDelete(event._id)}
                        >
                          <MdDelete />
                        </button>
                      )}
                      <button>
                        <Link
                          href={`/events/detailEvent?id=${event.id}`}
                          className='btn btn-primary btn-sm'
                        >
                          Detail
                        </Link>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
