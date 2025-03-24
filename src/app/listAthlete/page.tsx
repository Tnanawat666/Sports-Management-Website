'use client'

import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { MdDelete, MdEdit } from 'react-icons/md'
import Swal from 'sweetalert2'
import fetchAuth from '../lib/getAuth'
import { ModalUpdateAthletes } from '../compo/modalUpdateAthletes'
import { uploadImage } from '../lib/cloundinsry'

export default function Page() {
  const [members, setMembers] = useState<any[]>([]) // To store members data
  const [loading, setLoading] = useState(true) // To show loading state
  const [auth, setAuth] = useState(false)

  const [_id, set_id] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [id, setID] = useState('')
  const [gender, setGender] = useState('')
  const [country, setCountry] = useState('')
  const [classification, setClassification] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [email, setEmail] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isUpdateProfile, setIsUpdateProfile] = useState(false)
  const [loadingUpdate, setLoadingUpdate] = useState(false)

  const fetchMembers = async () => {
    try {
      const res = await axios.get('/api/getMember')
      setMembers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this athlete!',
      icon: 'warning',
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      loaderHtml: '<span class="loading loading-lg"></span>',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await axios.post('/api/deleteMember', { _id: id })
        } catch (e) {
          console.error('Error deleting document:', e)
          Swal.fire({
            title: 'Error deleting event',
            text: 'Internal Server Error',
            icon: 'error',
          })
        } finally {
          await fetchMembers()
        }
      },
      //
    })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingUpdate(true)
    try {
      let uploadImg = ''
      if (file && isUpdateProfile) {
        uploadImg = await uploadImage(file, id)
      }
      const res = await axios.post('/api/updateAthlete', {
        _id,
        firstName,
        lastName,
        id,
        gender,
        country,
        classification,
        dateOfBirth,
        email,
        file: uploadImg,
      })
      if (res.data.success) {
        Swal.fire({
          title: 'Event updated successfully',
          icon: 'success',
        })
        fetchMembers()
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
      setFile(null)
      document.getElementById('edit_athletes').close()
    }
  }

  useEffect(() => {
    fetchAuth().then((data) => {
      setAuth(data)
    })
    fetchMembers()
  }, [])

  return (
    <div>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Table of Athletes</h1>
        {auth && (
          <Link
            className='btn btn-primary btn-outline'
            onClick={fetchMembers}
            href='/listAthlete/createAthlete'
          >
            Add Athlete
          </Link>
        )}
      </div>

      <div className='overflow-x-auto mt-5'>
        {loading ? (
          <span className='loading loading-dots loading-lg'></span>
        ) : members.length === 0 ? (
          <p>No members found.</p>
        ) : (
          <table className='table'>
            <thead>
              <tr>
                <th>Athlete Name</th>
                <th className='text-center'>ID</th>
                <th className='text-center'>Gender</th>
                <th className='text-center'>Country</th>
                <th className='text-center'>Classification</th>
                <th className='text-center'>Date of Birth</th>
                <th className='text-center'>E-mail</th>
                {auth && <th className='text-center'>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={index} className='hover:bg-gray-100'>
                  <td className='flex items-center gap-3'>
                    {member.imgProfile ? (
                      <Image
                        src={member.imgProfile}
                        alt={member.firstName}
                        className='w-8 h-8 rounded-full'
                        width={32}
                        height={32}
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
                    {member.firstName + ' ' + member.lastName}
                  </td>
                  <td className='text-center'>{member.id}</td>
                  <td className='text-center'>{member.gender}</td>
                  <td className='text-center'>{member.country}</td>
                  <td className='text-center'>{member.classification}</td>
                  {/* format dd/MM/YYYY */}
                  <td className='text-center'>
                    {new Date(member.dateOfBirth).toLocaleDateString()}
                  </td>
                  <td className='text-center'>{member.email}</td>
                  {auth && (
                    <td className='flex gap-2 justify-center'>
                      <button
                        className='btn btn-primary btn-sm'
                        onClick={() => {
                          document.getElementById('edit_athletes').showModal()
                          set_id(member._id)
                          setFirstName(member.firstName)
                          setLastName(member.lastName)
                          setID(member.id)
                          setGender(member.gender)
                          setCountry(member.country)
                          setClassification(member.classification)
                          setDateOfBirth(member.dateOfBirth)
                          setEmail(member.email)
                          setFile(member.imgProfile)
                        }}
                      >
                        <MdEdit />
                      </button>
                      <button
                        className='btn btn-error btn-outline btn-sm'
                        onClick={() => handleDelete(member._id)}
                      >
                        <MdDelete />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ModalUpdateAthletes
        firstName={firstName}
        lastName={lastName}
        id={id}
        gender={gender}
        country={country}
        classification={classification}
        dateOfBirth={dateOfBirth}
        email={email}
        file={file}
        setFirstName={setFirstName}
        setLastName={setLastName}
        setID={setID}
        setGender={setGender}
        setCountry={setCountry}
        setClassification={setClassification}
        setDateOfBirth={setDateOfBirth}
        setEmail={setEmail}
        setFile={setFile}
        loadingUpdate={loadingUpdate}
        handleUpdate={handleUpdate}
        setIsUpdateProfile={setIsUpdateProfile}
      />
    </div>
  )
}
