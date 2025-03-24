'use client'

import axios from 'axios'
import Image from 'next/image'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import { uploadImage } from '@/app/lib/cloundinsry'
import Swal from 'sweetalert2'

import ListCountry from '@/app/master/lisyCountry.json'

export default function page() {
  const router = useRouter()
  const [athletes, setAthletes] = useState([
    {
      file: null,
      preview: null,
      firstName: '',
      lastName: '',
      id: '',
      gender: 'Male',
      country: ListCountry[0].name,
      classification: '',
      dateOfBirth: '',
      email: '',
    },
  ])
  const [loading, setLoading] = useState(false)

  const handleAddAthlete = () => {
    setAthletes([
      ...athletes,
      {
        file: null,
        preview: null,
        firstName: '',
        lastName: '',
        id: '',
        gender: 'Male',
        country: ListCountry[0].name,
        classification: '',
        dateOfBirth: '',
        email: '',
      },
    ])
  }

  const handleRemoveAthlete = (index) => {
    if (athletes.length > 1) {
      setAthletes(athletes.filter((_, i) => i !== index))
    }
  }

  const handleChange = (index, field, value) => {
    const updatedAthletes = [...athletes]
    updatedAthletes[index][field] = value
    setAthletes(updatedAthletes)
  }

  const handleFileChange = (index, e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile.size || selectedFile.size > 1000000) {
      Swal.fire({
        title: 'File size is too large',
        text: 'Please upload a file less than 1MB',
        icon: 'error',
      })
      return
    }

    const updatedAthletes = [...athletes]
    updatedAthletes[index].file = selectedFile
    updatedAthletes[index].preview = URL.createObjectURL(selectedFile)
    setAthletes(updatedAthletes)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    for (const athlete of athletes) {
      const {
        file,
        firstName,
        lastName,
        id,
        gender,
        country,
        classification,
        dateOfBirth,
        email,
      } = athlete

      if (
        !firstName ||
        !lastName ||
        !email ||
        !id ||
        !gender ||
        !country ||
        !classification ||
        !dateOfBirth
      ) {
        Swal.fire({
          title: 'Missing required fields',
          icon: 'error',
        })
        setLoading(false)
        return
      }

      try {
        const athleteCreated = []
        let uploadImg = ''
        if (file) {
          uploadImg = await uploadImage(file, id)
        }
        const res = await axios.post('/api/createMember', {
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

        if (!res.data.success) {
          throw new Error('Failed to create athlete')
        }
      } catch (e) {
        console.error('Error adding document:', e)
        Swal.fire({
          title: 'Internal Server Error',
          text: `Error creating athlete: ${athlete.firstName} ${athlete.lastName}`,
          icon: 'error',
        })
        setLoading(false)
        return
      }
    }

    Swal.fire({
      title: 'Athletes created successfully',
      icon: 'success',
    })
    router.push('/listAthlete')
    setLoading(false)
  }

  return (
    <div className='m-10'>
      <h1 className='text-xl font-bold text-center'>Create New Athletes</h1>
      <form className='mt-5 flex flex-col gap-4' onSubmit={handleSubmit}>
        {athletes.map((athlete, index) => (
          <div key={index} className='border p-4 rounded-lg'>
            <div className='flex justify-between items-center'>
              <h2 className='font-bold'>Athlete {index + 1}</h2>
              {athletes.length > 1 && (
                <button
                  type='button'
                  className='btn btn-error btn-xs'
                  onClick={() => handleRemoveAthlete(index)}
                >
                  Remove
                </button>
              )}
            </div>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col justify-center items-center gap-4'>
                <div className='avatar flex justify-center items-center'>
                  <div className='w-24 text-center'>
                    {athlete.preview ? (
                      <Image
                        src={athlete.preview}
                        alt='Uploaded Preview'
                        width={100}
                        height={100}
                      />
                    ) : (
                      <p>Upload a photo (Optional, Max 1MB)</p>
                    )}
                  </div>
                </div>
                <input
                  type='file'
                  className='file-input file-input-xs w-full max-w-xs'
                  onChange={(e) => handleFileChange(index, e)}
                />
              </div>

              <div className='flex justify-around'>
                <label className='form-control w-full max-w-xs'>
                  <div className='label'>
                    <span className='label-text'>First Name*</span>
                  </div>
                  <input
                    type='text'
                    className='input input-bordered w-full max-w-xs'
                    onChange={(e) =>
                      handleChange(index, 'firstName', e.target.value)
                    }
                    value={athlete.firstName}
                    required
                  />
                </label>
                <label className='form-control w-full max-w-xs'>
                  <div className='label'>
                    <span className='label-text'>Last Name*</span>
                  </div>
                  <input
                    type='text'
                    className='input input-bordered w-full max-w-xs'
                    onChange={(e) =>
                      handleChange(index, 'lastName', e.target.value)
                    }
                    value={athlete.lastName}
                    required
                  />
                </label>
              </div>

              <div className='flex justify-around'>
                <label className='form-control w-full max-w-xs'>
                  <div className='label'>
                    <span className='label-text'>ID*</span>
                  </div>
                  <input
                    type='text'
                    className='input input-bordered w-full max-w-xs'
                    onChange={(e) => handleChange(index, 'id', e.target.value)}
                    value={athlete.id}
                  />
                </label>
                <label className='form-control w-full max-w-xs'>
                  <div className='label'>
                    <span className='label-text'>Gender*</span>
                  </div>
                  <select
                    className='select select-bordered w-full max-w-xs'
                    onChange={(e) =>
                      handleChange(index, 'gender', e.target.value)
                    }
                  >
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                    <option value='Not Prefer'>Not Prefer</option>
                  </select>
                </label>
              </div>

              <div className='flex justify-around'>
                <label className='form-control w-full max-w-xs'>
                  <div className='label'>
                    <span className='label-text'>Country*</span>
                  </div>
                  {ListCountry && (
                    <select
                      className='select select-bordered w-full max-w-xs'
                      onChange={(e) =>
                        handleChange(index, 'country', e.target.value)
                      }
                    >
                      {ListCountry.map((country) => (
                        <option key={country.code} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  )}
                </label>
                <label className='form-control w-full max-w-xs'>
                  <div className='label'>
                    <span className='label-text'>Classification*</span>
                  </div>
                  <input
                    type='text'
                    className='input input-bordered w-full max-w-xs'
                    onChange={(e) =>
                      handleChange(index, 'classification', e.target.value)
                    }
                    value={athlete.classification}
                  />
                </label>
              </div>

              <div className='flex justify-around'>
                <label className='form-control w-full max-w-xs'>
                  <div className='label'>
                    <span className='label-text'>Date of Birth*</span>
                  </div>
                  <input
                    type='date'
                    className='input input-bordered w-full max-w-xs'
                    onChange={(e) =>
                      handleChange(index, 'dateOfBirth', e.target.value)
                    }
                    value={athlete.dateOfBirth}
                  />
                </label>
                <label className='form-control w-full max-w-xs'>
                  <div className='label'>
                    <span className='label-text'>E-mail*</span>
                  </div>
                  <input
                    type='email'
                    className='input input-bordered w-full max-w-xs'
                    onChange={(e) =>
                      handleChange(index, 'email', e.target.value)
                    }
                    value={athlete.email}
                    required
                  />
                </label>
              </div>
            </div>
          </div>
        ))}
        <div className='flex justify-end gap-5'>
          <button
            type='button'
            className='btn btn-secondary'
            onClick={handleAddAthlete}
          >
            Add Another Athlete
          </button>
          <button type='submit' className='btn btn-primary' disabled={loading}>
            {loading ? (
              <span className='loading loading-dots loading-lg'></span>
            ) : (
              'Add Athletes'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
