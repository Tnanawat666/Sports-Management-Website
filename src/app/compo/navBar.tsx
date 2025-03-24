import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import fetchAuth from '../lib/getAuth'

export default function Navbar() {
  const router = useRouter()
  const [auth, setAuth] = useState(false)

  useEffect(() => {
    fetchAuth().then((data) => {
      setAuth(data)
    })
  }, [])

  const logout = async () => {
    await Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'No, cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post('/api/auth/logout')
        } catch (error) {
          console.error(error)
        } finally {
          location.reload()
        }
      }
    })
  }

  return (
    <div className='navbar bg-gray-800 '>
      <div className='flex-1'>
        <a className='btn btn-ghost text-xl text-white'>Paralympics_DB</a>
      </div>
      <div className='flex-none p-5'>
        <div tabIndex={0} role='button' className='btn btn-xs'>
          {auth ? (
            <button onClick={logout}>Log Out</button>
          ) : (
            <Link href='/login'>Login</Link>
          )}
        </div>
      </div>
    </div>
  )
}
