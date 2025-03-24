'use client'

import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState, useMemo } from 'react'
import { MdDelete, MdEdit } from 'react-icons/md'
import { FaMedal } from 'react-icons/fa'
import Swal from 'sweetalert2'
import fetchAuth from '../lib/getAuth'
import { ModalUpdateAthletes } from '../compo/modalUpdateAthletes'
import { uploadImage } from '../lib/cloundinsry'
import { useParams, usePathname, useSearchParams } from 'next/navigation'
import countryList from '../master/lisyCountry.json';

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
  const param = useSearchParams()

  const medalWeights = { Gold: 10000, Silver: 100, Bronze: 1 };
  const countryNames = countryList.reduce((acc, { code, name }) => {
    acc[code] = name;
    return acc;
  }, {});

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

  const [eventResults, setEventResults] = useState<any[]>([]);

  const fetchEventResults = async () => {
    try {
      const res = await axios.get('/api/getEventResults');
      setEventResults(res.data);
    } catch (err) {
      console.error("Error fetching event results:", err);
    }
  };

  useEffect(() => {
    fetchAuth().then(setAuth);
    fetchMembers();
    fetchEventResults();
  }, []);

  useEffect(() => {
    fetchMembers()
  }, [param])

  const enrichedMembers = useMemo(() => {
    const memberMap = new Map(members.map(m => [m._id, { ...m, gold: 0, silver: 0, bronze: 0 }]));

    eventResults.forEach(event => {
      event.athletes.forEach(athlete => {
        if (memberMap.has(athlete._id)) {
          const existing = memberMap.get(athlete._id);
          existing.gold += athlete.gold;
          existing.silver += athlete.silver;
          existing.bronze += athlete.bronze;
        }
      });
    });

    return Array.from(memberMap.values());
  }, [members, eventResults]);

  const countryRanking = useMemo(() => {
    const countryMedals: Record<string, { Gold: number; Silver: number; Bronze: number; score: number }> = {};

    enrichedMembers.forEach(({ country, gold, silver, bronze }) => {
      if (!countryMedals[country]) {
        countryMedals[country] = { Gold: 0, Silver: 0, Bronze: 0, score: 0 };
      }
      countryMedals[country].Gold += gold;
      countryMedals[country].Silver += silver;
      countryMedals[country].Bronze += bronze;
      // คํานวณคะแนน
      countryMedals[country].score += gold * 10000 + silver * 100 + bronze;
    });
    // ส่งผลลัพธ์กลับไปแบบที่ เรียงลำดับแล้ว
    return Object.entries(countryMedals)
      .map(([country, data]) => ({ country, ...data }))
      .sort((a, b) => b.score - a.score);
  }, [enrichedMembers]);

  return (
    <div>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Ranking Table</h1>
      </div>

      {/* Choose Category */}
      <div className='flex items-center gap-3 mt-5'>
        <button
          className={`btn btn-primary btn-outline btn-xs ${param.get('category') === 'countries' ? 'btn-active' : ''
            }`}
          onClick={() => {
            const newParams = new URLSearchParams()
            newParams.set('category', 'countries')
            window.history.replaceState(null, '', `?${newParams.toString()}`)
          }}
        >
          Countries
        </button>
        <button
          className={`btn btn-primary btn-outline btn-xs ${param.get('category') === 'players' ? 'btn-active' : ''
            }`}
          onClick={() => {
            const newParams = new URLSearchParams()
            newParams.set('category', 'players')
            window.history.replaceState(null, '', `?${newParams.toString()}`)
          }}
        >
          Players
        </button>
      </div>

      <div className='overflow-x-auto mt-5'>
        {loading ? (
          <span className='loading loading-dots loading-lg'></span>
        ) : members.length === 0 ? (
          <p>No members found.</p>
        ) : param.get('category') === 'countries' ? (
          // จัดลำดับด้วยเหรียญ by country
          <table className="table">
            <thead>
              <tr className='text-xl'>
                <th className="text-right px-2 w-10"># Rank</th>
                <th className="text-left px-2">Country</th>
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

              </tr>
            </thead>
            <tbody>
              {countryRanking.map((item, index) => (
                <tr key={index}>
                  <td className="text-center px-2 w-10">{index + 1}</td>
                  <td className="text-left px-2 flex items-center">
                    <Image
                      src={`https://flagsapi.com/${item.country}/shiny/64.png`}
                      alt={`${item.country} flag`}
                      width={64}
                      height={32}
                    />
                    <span className="ml-2">{countryNames[item.country] || item.country}</span>
                  </td>
                  <td className="text-center">{item.Gold}</td>
                  <td className="text-center">{item.Silver}</td>
                  <td className="text-center">{item.Bronze}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // Athlete ranking table
          <table className='table'>
            <thead>
              <tr className='text-xl'>
                <th># Rank</th>
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

                <th className='text-left'>Athlete Name</th>
                <th className='text-center'>ID</th>
                <th className='text-center'>Gender</th>
                <th className='text-start'>Country</th>
                <th className='text-center'>Date of Birth</th>
                {auth && <th className='text-center'>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {enrichedMembers
                .sort((a, b) => b.gold * 10000 + b.silver * 100 + b.bronze - (a.gold * 10000 + a.silver * 100 + a.bronze))
                .map((member, index) => (
                  <tr key={index} className='hover:bg-gray-100'>
                    <td>{index + 1}</td>
                    <td className='text-center'>{member.gold}</td>
                    <td className='text-center'>{member.silver}</td>
                    <td className='text-center'>{member.bronze}</td>
                    <td className='flex items-center gap-3'>
                      {member.imgProfile ? (
                        <Image src={member.imgProfile} alt={member.firstName} className='w-8 h-8 rounded-full' width={32} height={32} />
                      ) : (
                        <div className='avatar placeholder'>
                          <div className='bg-neutral text-neutral-content w-8 rounded-full'>
                            <span className='text-xl'>{member.firstName.charAt(0)}</span>
                          </div>
                        </div>
                      )}
                      {member.firstName + ' ' + member.lastName}
                    </td>
                    <td className='text-center'>{member.id}</td>
                    <td className='text-center'>{member.gender}</td>
                    <td className="text-center px-2 flex justify-start items-center">
                      <Image src={`https://flagsapi.com/${member.country}/shiny/64.png`} alt={`${member.country} flag`} width={24} height={12} />
                      <span className="ml-2">{countryNames[member.country] || member.country}</span>
                    </td>
                    <td className='text-center'>{new Date(member.dateOfBirth).toLocaleDateString()}</td>
                    {auth && (
                      <td className='flex gap-2 justify-center'>
                        <button className='btn btn-primary btn-sm' onClick={() => {
                          document.getElementById('edit_athletes').showModal();
                          set_id(member._id);
                          setFirstName(member.firstName);
                          setLastName(member.lastName);
                          setID(member.id);
                          setGender(member.gender);
                          setCountry(member.country);
                          setClassification(member.classification);
                          setDateOfBirth(member.dateOfBirth);
                          setEmail(member.email);
                          setFile(member.imgProfile);
                        }}>
                          <MdEdit />
                        </button>
                        <button className='btn btn-error btn-outline btn-sm' onClick={() => handleDelete(member._id)}>
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
