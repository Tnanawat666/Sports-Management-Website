'use client'

import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Swal from 'sweetalert2'

// app/login/page.tsx
export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      })
      if (response.status === 200) {
        console.log('Login successful')
        router.push('/listAthlete')
      } else {
        console.error('Login failed')
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login failed',
        text: 'Invalid email or password',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className='space-y-6'>
      <h1 className='text-2xl font-bold text-center'>Login</h1>
      <div>
        <label
          htmlFor='email'
          className='block text-sm font-medium text-gray-700'
        >
          Email address
        </label>
        <input
          type='email'
          id='email'
          className='block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </div>
      <div>
        <label
          htmlFor='password'
          className='block text-sm font-medium text-gray-700'
        >
          Password
        </label>
        <input
          type='password'
          id='password'
          className='block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>
      <button
        type='submit'
        onClick={(e) => handleSubmit(e)}
        className='w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700'
      >
        {loading ? <span className='loading loading-dots'></span> : 'Login'}
      </button>
      <Link href='/listAthlete' className='block text-center'>
        Back
      </Link>
    </form>
  )
}
