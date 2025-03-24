'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Swal from 'sweetalert2'
import { MdAdd, MdDelete, MdEdit } from 'react-icons/md'
import Image from 'next/image'
import fetchAuth from '@/app/lib/getAuth'
import { ModalUpdateEvent } from '@/app/compo/modalUpdateEvent'
import { FaMedal } from 'react-icons/fa'

interface Member {
  _id: string
  id: string
  firstName: string
  lastName: string
  imgProfile?: string
  classification: string
  country: string
}

interface Event {
  id: string
  date: string
  gender: string
  classification: string
  stage: string
  status: string
  scoretype: string
  remark: string
}

export default function EventDetailPage() {
  const searchParams = useSearchParams()
  const idParam = searchParams.get('id')

  const [event, setEvent] = useState<Event | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [memberEvent, setMemberEvent] = useState<Member[]>([])
  const [loadingMember, setLoadingMember] = useState(false)
  const [loadingMemberEvent, setLoadingMemberEvent] = useState(true)
  const [auth, setAuth] = useState<any>(null)

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

  // add point and score each athlete and athlete > 1 -> can use handle for loop
  const [athleteScores, setAthleteScores] = useState<{
    [key: string]: { score: number; point: number, gold: number, silver: number, bronze: number };
  }>({})

  const [btnAddAthlete, setBtnAddAthlete] = useState(false)

  // Fetch event details and associated athletes
  const fetchEventWithAthletes = async () => {
    try {
      const res = await axios.get(
        `/api/getEventWithAthletes?id_event=${idParam}`
      )
      setEvent(res.data[0]?.event_info[0] || null)
      setMemberEvent(res.data[0]?.athletes || [])
    } catch (err) {
      console.error('Error fetching event with athletes:', err)
    } finally {
      setLoadingMemberEvent(false)
    }
  }

  // Fetch members excluding those already in the event
  const fetchMembers = async () => {
    if (!auth) return

    setBtnAddAthlete(true)
    setLoadingMember(true)
    try {
      const idIgnore = memberEvent.map((member) => member._id).join(',')
      const res = await axios.get(
        `/api/getMember?gender=${event?.gender}&idIgnore=${idIgnore}`
      )
      setMembers(res.data)
    } catch (err) {
      console.error('Error fetching members:', err)
    } finally {
      setLoadingMember(false)
    }
  }

  // Add an athlete to the event
  const handleAddAthlete = async (athleteId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to add this athlete to the event?',
      icon: 'warning',
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: 'Yes, add it',
      cancelButtonText: 'No, cancel',
      loaderHtml: '<span class="loading loading-lg"></span>',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await axios.post('/api/addAthleteToEvent', {
            id_event: event?.id,
            athlete_id: athleteId,
          })
          await fetchEventWithAthletes() // Refresh event data
        } catch (err) {
          console.error('Error adding athlete:', err)
        }
      },
    })
  }

  // Remove an athlete from the event
  const handleDeleteAthlete = async (athleteId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this athlete from the event?',
      icon: 'warning',
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'No, cancel',
      loaderHtml: '<span class="loading loading-lg"></span>',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const res = await axios.post('/api/deleteAthleteFromEvent', {
            id_event: event?.id,
            athlete_id: athleteId,
          })

          await fetchEventWithAthletes() // Refresh event data
        } catch (err) {
          console.error('Error deleting athlete:', err)
        }
      },
    })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingUpdate(true)
    try {
      console.log(date, id)
      const res = await axios.post('/api/updateEvent', {
        _id,
        date,
        id,
        gender,
        name,
        classification,
        time,
        stage,
        status,
        scoretype,
        remark,
      })
      if (res.data.success) {
        Swal.fire({
          title: 'Event updated successfully',
          icon: 'success',
        })
        fetchEventWithAthletes()
      }
    } catch (e) {
      console.error('Error updating document:', e)
      Swal.fire({
        title: 'Error updating event',
        text: 'Internal Server Error',
        icon: 'error',
      })
    } finally {
      setLoadingUpdate(false)
      document.getElementById('edit_event').close()
    }
  }

  const handleAddResult = async () => {
    await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to save the result?',
      icon: 'warning',
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: 'Yes, save it',
      cancelButtonText: 'No, cancel',
      loaderHtml: '<span class="loading loading-lg"></span>',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const res = await axios.post('/api/addResultToEvent', {
            id_event: event?.id,
            athletes_result: Object.entries(athleteScores).map(
              ([id, { score, point, gold, silver, bronze }]) => ({
                id: parseInt(id),
                score,
                point,
                gold,
                silver,
                bronze
              })
            ),
          })
          if (res.data.success) {
            Swal.fire({
              title: 'Result saved successfully',
              icon: 'success',
            })
            fetchEventWithAthletes()
          }
        } catch (e) {
          console.error('Error adding result:', e)
          Swal.fire({
            title: 'Error saving result',
            text: 'Internal Server Error',
            icon: 'error',
          })
        }
      },
    })
  }

  // Fetch authentication data
  useEffect(() => {
    fetchAuth().then((data) => setAuth(data))
  }, [])

  // Fetch event and athletes when `id` changes
  useEffect(() => {
    if (idParam) {
      fetchEventWithAthletes()
    }
  }, [idParam])

  useEffect(() => {
    if (!event) return
    set_id(event._id)

    setDate(
      (event.date && new Date(event.date).toISOString().split('T')[0]) || ''
    ) // YYYY-MM-DD format
    setTime(
      (event.date &&
        new Date(event.date).toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })) ||
      ''
    )
    setID(event.id || '')
    setName(event.name || '')
    setGender(event.gender || '')
    setClassification(event.classification || '')
    setStage(event.stage || '')
    setStatus(event.status || '')
    setScoreType(event.scoretype || '')
    setRemark(event.remark || '')
  }, [event])

  // Render loading state
  if (loadingMemberEvent) {
    return <span className='loading loading-dots loading-lg'></span>
  }

  // Render event details
  const renderEventDetails = () => {
    if (!event) return <p>No event details found.</p>

    return (
      <div className='mt-2 p-6 bg-white rounded-lg shadow-md flex flex-col gap-5 w-[18vw]'>
        <div className='flex flex-col justify-between gap-3'>
          <p className='text-gray-700'>
            <span className='font-semibold text-gray-900'>Name:</span>{' '}
            {event.name || 'N/A'}
          </p>
          <p className='text-gray-700'>
            <span className='font-semibold text-gray-900'>Date:</span>{' '}
            {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}{' '}
          </p>
          <p>
            <span className='font-semibold text-gray-900'>Time:</span>{' '}
            {event.date ? new Date(event.date).toLocaleTimeString() : 'N/A'}
          </p>

          <p className='text-gray-700'>
            <span className='font-semibold text-gray-900'>ID:</span>{' '}
            {event.id || 'N/A'}
          </p>
          <p className='text-gray-700'>
            <span className='font-semibold text-gray-900'>Gender:</span>{' '}
            {event.gender || 'N/A'}
          </p>
          <p className='text-gray-700'>
            <span className='font-semibold text-gray-900'>Classification:</span>{' '}
            {event.classification || 'N/A'}
          </p>
          <p className='text-gray-700'>
            <span className='font-semibold text-gray-900'>Stage:</span>{' '}
            {event.stage || 'N/A'}
          </p>
          <p className='text-gray-700'>
            <span className='font-semibold text-gray-900'>Status:</span>{' '}
            {event.status || 'N/A'}
          </p>
          <p className='text-gray-700'>
            <span className='font-semibold text-gray-900'>Type of score:</span>{' '}
            {event.scoretype === "ONE" ? "Best of 1" :
              event.scoretype === "THREE" ? "Best of 3" : 'N/A'}
          </p>
          <p className='text-gray-700'>
            <span className='font-semibold text-gray-900'>Remark:</span>{' '}
            {event.remark || 'N/A'}
          </p>
        </div>

        {auth && (
          <div className='flex gap-2 justify-center'>
            <button
              className='btn btn-primary btn-sm btn-outline'
              onClick={() => {
                document.getElementById('edit_event').showModal()
              }}
            >
              <MdEdit />
              Edit Event Details
            </button>
          </div>
        )}
      </div>
    )
  }

  // Render athletes in the event
  const renderAthletesInEvent = () => {
    if (loadingMemberEvent) {
      return <span className='loading loading-dots loading-lg'></span>
    }

    if (memberEvent.length === 0) {
      return <p>No athletes found in this event.</p>
    }

    // Sort by point
    memberEvent.sort((a, b) => b.point - a.point)

    return (
      <table className='table'>
        {event?.scoretype === 'THREE' ? (
          <thead className='sticky top-0 bg-white z-10'>
            <tr>
              <th className='text-center'>Rank</th>
              <th className='text-center'>Score 1</th>
              <th className='text-center'>Score 2</th>
              <th className='text-center'>Score 3</th>
              <th className='text-center'>Best Score</th>
              <th className='text-center'>Point</th>
              <th>Athlete Name</th>
              <th className='text-center'>ID</th>
              <th className='text-center'>Classification</th>
              <th className='text-center'>Country</th>
              <th className="text-center">
                <span className="flex justify-center items-center gap-1">
                  <FaMedal color="#FFD700" /> Gold
                </span>
              </th>
              <th className="text-center">
                <span className="flex justify-center items-center gap-1">
                  <FaMedal color="#C0C0C0" /> Silver
                </span>
              </th>
              <th className="text-center">
                <span className="flex justify-center items-center gap-1">
                  <FaMedal color="#CD7F32" /> Bronze
                </span>
              </th>
              {auth && <th className='text-center'>Action</th>}
            </tr>
          </thead>
        ) : (
          <thead className='sticky top-0 bg-white z-10'>
            <tr>
              <th className='text-center'>Rank</th>
              <th className='text-center'>Score</th>
              <th className='text-center'>Point</th>
              <th>Athlete Name</th>
              <th className='text-center'>ID</th>
              <th className='text-center'>Classification</th>
              <th className='text-center'>Country</th>
              <th className="text-center">
                <span className="flex justify-center items-center gap-1">
                  <FaMedal color="#FFD700" /> Gold
                </span>
              </th>
              <th className="text-center">
                <span className="flex justify-center items-center gap-1">
                  <FaMedal color="#C0C0C0" /> Silver
                </span>
              </th>
              <th className="text-center">
                <span className="flex justify-center items-center gap-1">
                  <FaMedal color="#CD7F32" /> Bronze
                </span>
              </th>
              {auth && <th className='text-center'>Action</th>}
            </tr>
          </thead>
        )}
        <tbody>
          {memberEvent.map((member) => {
            // ถ้าไม่มี point ให้เป็น '-'
            const rank = member.point ? memberEvent.indexOf(member) + 1 : '-'

            return (
              <tr key={member.id} className='hover:bg-gray-100'>
                <td className='text-center'>{rank}</td>

                {/* Conditionally render score inputs based on scoretype */}
                {event?.scoretype === 'THREE' ? (
                  <>
                    {[0, 1, 2].map((i) => (
                      <td key={i} className="text-center">
                        {auth ? (
                          <input
                            type="text"
                            className="input input-bordered input-sm w-20"
                            value={
                              athleteScores[member.id]?.scores?.[i] || member.scores?.[i] || 0
                            }
                            onChange={(e) => {
                              const newScores = [...(athleteScores[member.id]?.scores || [0, 0, 0])]
                              newScores[i] = parseFloat(e.target.value) || 0
                              setAthleteScores((prev) => ({
                                ...prev,
                                [member.id]: {
                                  ...prev[member.id],
                                  scores: newScores,
                                  score: Math.max(...newScores), // Calculate best score dynamically
                                },
                              }))
                            }}
                          />
                        ) : (
                          member.scores?.[i] || 0
                        )}
                      </td>
                    ))}
                    <td className="text-center">
                      {/* Best score calculation */}
                      {member.score}
                    </td>
                  </>
                ) : (
                  <td className='text-center'>
                    {auth ? (
                      <input
                        type='text'
                        className='input input-bordered input-sm w-20'
                        value={athleteScores[member.id]?.score || member.score || 0}
                        onChange={(e) =>
                          setAthleteScores((prev) => ({
                            ...prev,
                            [member.id]: {
                              ...prev[member.id],
                              score: parseFloat(e.target.value),
                            },
                          }))
                        }
                      />
                    ) : (
                      member.score || 0
                    )}
                  </td>
                )}

                <td className='text-center'>
                  {auth ? (
                    <input
                      type='text'
                      className='input input-bordered input-sm w-20'
                      value={athleteScores[member.id]?.point || member.point || 0}
                      onChange={(e) =>
                        setAthleteScores((prev) => ({
                          ...prev,
                          [member.id]: {
                            ...prev[member.id],
                            point: parseFloat(e.target.value),
                          },
                        }))
                      }
                    />
                  ) : (
                    member.point || 0
                  )}
                </td>

                <td className='flex items-center gap-3'>
                  {member.imgProfile ? (
                    <Image
                      src={member.imgProfile}
                      alt={`${member.firstName} ${member.lastName}`}
                      className='w-8 h-8 rounded-full'
                      width={32}
                      height={32}
                      style={{ width: 'auto', height: 'auto' }}
                    />
                  ) : (
                    <div className='avatar placeholder'>
                      <div className='bg-neutral text-neutral-content w-8 rounded-full'>
                        <span className='text-xl'>{member.firstName.charAt(0)}</span>
                      </div>
                    </div>
                  )}
                  {`${member.firstName} ${member.lastName}`}
                </td>

                <td className='text-center'>{member.id}</td>
                <td className='text-center'>{member.classification}</td>
                <td className='text-center'>{member.country}</td>
                <td className='text-center'>
                  {auth ? (
                    <input
                      type='text'
                      className='input input-bordered input-sm w-20'
                      value={athleteScores[member.id]?.gold || member.gold || 0}
                      onChange={(e) =>
                        setAthleteScores((prev) => ({
                          ...prev,
                          [member.id]: {
                            ...prev[member.id],
                            gold: parseFloat(e.target.value),
                          },
                        }))
                      }
                    />
                  ) : (
                    member.gold || 0
                  )}
                </td>
                <td className='text-center'>
                  {auth ? (
                    <input
                      type='text'
                      className='input input-bordered input-sm w-20'
                      value={athleteScores[member.id]?.silver || member.silver || 0}
                      onChange={(e) =>
                        setAthleteScores((prev) => ({
                          ...prev,
                          [member.id]: {
                            ...prev[member.id],
                            silver: parseFloat(e.target.value),
                          },
                        }))
                      }
                    />
                  ) : (
                    member.silver || 0
                  )}
                </td>
                <td className='text-center'>
                  {auth ? (
                    <input
                      type='text'
                      className='input input-bordered input-sm w-20'
                      value={athleteScores[member.id]?.bronze || member.bronze || 0}
                      onChange={(e) =>
                        setAthleteScores((prev) => ({
                          ...prev,
                          [member.id]: {
                            ...prev[member.id],
                            bronze: parseFloat(e.target.value),
                          },
                        }))
                      }
                    />
                  ) : (
                    member.bronze || 0
                  )}
                </td>
                {
                  auth && (
                    <td className='text-center'>
                      <button className='btn btn-sm btn-outline btn-error' onClick={() => handleDeleteAthlete(member.id)}>
                        <MdDelete />
                      </button>
                    </td>
                  )
                }
              </tr>
            )
          })}
        </tbody>
      </table >
    )
  }

  // Render available athletes
  const renderAvailableAthletes = () => {
    if (!auth) return null

    if (members.length === 0) {
      return <p>No athletes available to add.</p>
    }

    return (
      <table className='table'>
        <thead className='sticky top-0 bg-white z-10'>
          <tr>
            <th>Athlete Name</th>
            <th className='text-center'>ID</th>
            <th className='text-center'>Classification</th>
            <th className='text-center'>Country</th>
            <th className='text-center'>Action</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member._id} className='hover:bg-gray-100'>
              <td className='flex items-center gap-3'>
                {member.imgProfile ? (
                  <Image
                    src={member.imgProfile}
                    alt={`${member.firstName} ${member.lastName}`}
                    className='w-8 h-8 rounded-full'
                    width={32} // Set only width
                    height={32} // Set only height
                    style={{ width: 'auto', height: 'auto' }} // Preserve aspect ratio
                  />
                ) : (
                  <div className='avatar placeholder'>
                    <div className='bg-neutral text-neutral-content w-8 rounded-full'>
                      <span className='text-xl'>
                        {member.firstName.charAt(0)}
                      </span>
                    </div>
                  </div>
                )}
                {`${member.firstName} ${member.lastName}`}
              </td>
              <td className='text-center'>{member.id}</td>
              <td className='text-center'>{member.classification}</td>
              <td className='text-center'>{member.country}</td>
              <td className='text-center'>
                <button
                  className='btn btn-sm btn-primary btn-outline'
                  onClick={() => handleAddAthlete(member.id)}
                >
                  <MdAdd />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <div>
      <h1 className='text-3xl font-bold'>Detail Event</h1>
      {/* {renderEventDetails()} */}

      <div className='flex gap-10'>
        <div>{renderEventDetails()}</div>
        <div className='flex flex-col gap-5'>
          <h2 className='text-2xl font-bold'>
            {auth ? 'Athletes in Event' : 'Result'}
          </h2>
          <div className='overflow-auto max-h-[65vh]'>
            {renderAthletesInEvent()}
          </div>
          {auth && (
            <>
              <button
                className='btn btn-primary btn-sm btn-outline mt-5'
                onClick={handleAddResult}
              >
                {loadingUpdate ? (
                  <span className='loading loading-dots loading-sm'></span>
                ) : (
                  'Save Result'
                )}
              </button>
              <button
                className='btn btn-primary btn-sm btn-outline'
                onClick={fetchMembers}
              >
                Add Athlete
              </button>
            </>
          )}
          {auth && btnAddAthlete && (
            <div className='overflow-x-auto mt-5'>
              <h2 className='text-2xl font-bold'>List of Athletes</h2>
              <div className='overflow-auto max-h-[50vh]'>
                {renderAvailableAthletes()}
              </div>
            </div>
          )}
          {loadingMember && (
            <span className='loading loading-dots loading-lg'></span>
          )}
        </div>
      </div>

      {auth && (
        <>
          <ModalUpdateEvent
            date={date}
            time={time}
            id={id}
            name={name}
            gender={gender}
            classification={classification}
            stage={stage}
            status={status}
            remark={remark}
            setDate={setDate}
            setTime={setTime}
            setID={setID}
            setName={setName}
            setGender={setGender}
            setClassification={setClassification}
            setStage={setStage}
            setStatus={setStatus}
            setScoreType={setScoreType}
            setRemark={setRemark}
            handleUpdate={handleUpdate}
            loadingUpdate={loadingUpdate}
          />
        </>
      )}
    </div>
  )
}
