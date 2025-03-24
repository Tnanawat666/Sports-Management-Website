import React, { useEffect } from 'react'

import StageJSON from '../master/stage.json'
import StatusJSON from '../master/status.json'
import ScoreTypeJson from '../master/scoretype.json'


interface IModalUpdateEvent {
  date: string
  time: string
  id: string
  name: string
  gender: string
  classification: string
  stage: string
  status: string
  scoreType: string
  remark: string
  setDate: (value: string) => void
  setTime: (value: string) => void
  setID: (value: string) => void
  setName: (value: string) => void
  setGender: (value: string) => void
  setClassification: (value: string) => void
  setStage: (value: string) => void
  setStatus: (value: string) => void
  setRemark: (value: string) => void
  setScoreType: (value: string) => void
  handleUpdate: () => void | Promise<void>
  loadingUpdate: boolean
}

export const ModalUpdateEvent = ({
  date,
  time,
  id,
  name,
  gender,
  classification,
  stage,
  status,
  scoreType,
  remark,
  setDate,
  setTime,
  setID,
  setName,
  setGender,
  setClassification,
  setStage,
  setStatus,
  setRemark,
  setScoreType,
  handleUpdate,
  loadingUpdate,
}: IModalUpdateEvent) => {
  return (
    <dialog id='edit_event' className='modal modal-bottom sm:modal-middle'>
      <div className='modal-box'>
        <h3 className='font-bold text-lg'>Edit Event</h3>
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
                  onChange={(e) => setDate(e.target.value)}
                  value={date}
                />
              </label>
              <label className='form-control w-full max-w-xs'>
                <div className='label'>
                  <span className='label-text'>Time</span>
                </div>
                <input
                  type='time'
                  className='input input-bordered w-full max-w-xs'
                  onChange={(e) => setTime(e.target.value)}
                  value={time}
                />
              </label>
            </div>
            <div className='flex justify-around'>
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
              <label className='form-control w-full max-w-xs'>
                <div className='label'>
                  <span className='label-text'>Name</span>
                </div>
                <input
                  type='text'
                  className='input input-bordered w-full max-w-xs'
                  onChange={(e) => setName(e.target.value)}
                  value={name}
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
                <span className='label-text'>Stage</span>
              </div>
              <select
                className='select select-bordered w-full max-w-xs'
                onChange={(e) => setStage(e.target.value)}
                value={stage}
              >
                {StageJSON.map((stage) => (
                  <option key={stage.name} value={stage.name}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </label>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Status</span>
              </div>
              <select
                className='select select-bordered w-full max-w-xs'
                onChange={(e) => setStatus(e.target.value)}
                value={status}
              >
                {StatusJSON.map((status) => (
                  <option key={status.name} value={status.name}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className='flex'>
            <label className='form-control w-full'>
              <div className='label'>
                <span className='label-text'>Type of score</span>
              </div>
              <select
                className='select select-bordered w-full'
                onChange={(e) => setScoreType(e.target.value)}
                value={scoreType}
              >
                {ScoreTypeJson.map((scoretype) => (
                  <option key={scoretype.name} value={scoretype.name}>
                    {scoretype.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className='flex justify-left'>
            <label className='form-control w-full'>
              <div className='label'>
                <span className='label-text'>Remark</span>
              </div>
              <textarea
                className='textarea textarea-bordered textarea-sm w-full'
                onChange={(e) => setRemark(e.target.value)}
                value={remark}
              ></textarea>
            </label>
          </div>

          <div className='modal-action'>
            <div className='modal-action'>
              {/* <form method='dialog'> */}
              <button className='btn'>Close</button>
              {/* </form> */}

              <button
                className='btn btn-primary btn-outline'
                onClick={handleUpdate}
                disabled={loadingUpdate}
                type='submit'
              >
                {loadingUpdate ? (
                  <>
                    <span className='loading loading-dots loading-lg'></span>
                  </>
                ) : (
                  'Update Event'
                )}
              </button>
            </div>
          </div>
        </form>
      </div >
    </dialog >
  )
}