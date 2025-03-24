import React from 'react'
import ListCountry from '@/app/master/lisyCountry.json'
import Image from 'next/image'

interface IModalUpdateAthletes {
  firstName: string
  lastName: string
  id: string
  gender: string
  country: string
  classification: string
  dateOfBirth: string
  email: string
  file: File | null
  setFirstName: (value: string) => void
  setLastName: (value: string) => void
  setID: (value: string) => void
  setGender: (value: string) => void
  setCountry: (value: string) => void
  setClassification: (value: string) => void
  setDateOfBirth: (value: string) => void
  setEmail: (value: string) => void
  setFile: (value: File | null) => void
  loadingUpdate: boolean
  handleUpdate: () => void | Promise<void>
  setIsUpdateProfile: (value: boolean) => void
}

export const ModalUpdateAthletes = ({
  firstName,
  lastName,
  id,
  gender,
  country,
  classification,
  dateOfBirth,
  email,
  file,
  setFirstName,
  setLastName,
  setID,
  setGender,
  setCountry,
  setClassification,
  setDateOfBirth,
  setEmail,
  setFile,
  handleUpdate,
  loadingUpdate,
  setIsUpdateProfile,
}: IModalUpdateAthletes) => {
  const [sizeFile, setSizeFile] = React.useState('')
  const [preview, setPreview] = React.useState('')
  return (
    <dialog id='edit_athletes' className='modal modal-bottom sm:modal-middle'>
      <div className='modal-box'>
        <h3 className='font-bold text-lg'>Edit Player</h3>
        <form className='mt-5 flex flex-col gap-4' method='dialog'>
          <div>
            <div className='flex justify-around'>
              <label className='form-control w-full max-w-xs'>
                <div className='label'>
                  <span className='label-text'>Date</span>
                </div>
                <input
                  type='date'
                  className='input input-bordered w-full max-w-xs'
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  value={dateOfBirth}
                />
              </label>
              <label className='form-control w-full max-w-xs'>
                <div className='label'>
                  <span className='label-text'>ID</span>
                </div>
                <input
                  type='text'
                  className='input input-bordered w-full max-w-xs'
                  onChange={(e) => setID(e.target.value)}
                  value={id}
                />
              </label>
            </div>

            <div className='flex justify-around'>
              <label className='form-control w-full max-w-xs'>
                <div className='label'>
                  <span className='label-text'>First Name</span>
                </div>
                <input
                  type='text'
                  className='input input-bordered w-full max-w-xs'
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                />
              </label>
              <label className='form-control w-full max-w-xs'>
                <div className='label'>
                  <span className='label-text'>Last Name</span>
                </div>
                <input
                  type='text'
                  className='input input-bordered w-full max-w-xs'
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                />
              </label>
            </div>

            <div className='flex justify-around'>
              <label className='form-control w-full max-w-xs'>
                <div className='label'>
                  <span className='label-text'>Gender</span>
                </div>
                <select
                  className='select select-bordered w-full max-w-xs'
                  onChange={(e) => setGender(e.target.value)}
                  value={gender}
                >
                  <option value='Male'>Male</option>
                  <option value='Female'>Female</option>
                  <option value='Not Prefer'>Not Prefer</option>
                </select>
              </label>
              <label className='form-control w-full max-w-xs'>
                <div className='label'>
                  <span className='label-text'>Classification</span>
                </div>
                <input
                  type='text'
                  className='input input-bordered w-full max-w-xs'
                  onChange={(e) => setClassification(e.target.value)}
                  value={classification}
                />
              </label>
            </div>
          </div>

          <div className='flex justify-around'>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Country*</span>
              </div>
              {ListCountry && (
                <select
                  className='select select-bordered w-full max-w-xs'
                  onChange={(e) => setCountry(e.target.value)}
                  value={country}
                >
                  {ListCountry.map((countryOption) => (
                    <option key={countryOption.code} value={countryOption.code}>
                      {countryOption.name} {/* Show country name */}
                    </option>
                  ))}
                </select>
              )}
            </label>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Email</span>
              </div>
              <input
                type='email'
                className='input input-bordered w-full max-w-xs'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </label>
          </div>

          {/* File upload */}
          <div className='flex justify-around'>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>File</span>
              </div>
              <input
                type='file'
                className='input input-bordered w-full max-w-xs'
                onChange={(e) => {
                  if (e.target.files && e.target.files[0].size > 1000000) {
                    setSizeFile('File size must be less than 1MB')
                    return
                  }
                  setFile(e.target.files[0])
                  setPreview(URL.createObjectURL(e.target.files[0]))
                  setIsUpdateProfile(true)
                }}
              />
              {sizeFile && <p className='text-red-500'>{sizeFile}</p>}
            </label>
            {preview && (
              <div className='w-full max-w-xs'>
                <Image
                  src={preview}
                  alt='Uploaded Preview'
                  width={100}
                  height={100}
                />
              </div>
            )}
            {!preview && file && (
              <div className='w-full max-w-xs'>
                <Image
                  src={file}
                  alt='Uploaded Preview'
                  width={100}
                  height={100}
                />
              </div>
            )}
          </div>

          <div className='modal-action'>
            <button className='btn'>Close</button>

            <button
              className='btn btn-primary btn-outline'
              onClick={handleUpdate}
              disabled={loadingUpdate}
              type='submit'
            >
              {loadingUpdate ? (
                <span className='loading loading-dots loading-lg'></span>
              ) : (
                'Update Player'
              )}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}
