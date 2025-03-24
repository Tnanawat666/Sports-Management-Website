'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation' // Hook to get the current path
import React from 'react'
import { CiBoxList } from 'react-icons/ci'
import { LiaMedalSolid } from 'react-icons/lia'
import { MdEvent } from 'react-icons/md'

const menu = [
  {
    name: 'Athletes',
    icon: <CiBoxList />,
    link: '/listAthlete',
  },
  {
    name: 'Events',
    icon: <MdEvent />,
    link: '/events?date',
  },
  {
    name: 'Medals',
    icon: <LiaMedalSolid />,
    link: '/medals?category=countries',
  }
]

export default function SideBar() {
  const pathname = usePathname()
  return (
    <ul className='menu bg-base-200  w-56'>
      {menu.map((item) => {
        const active = item.link === pathname
        return (
          <li
            key={item.name}
            className={`menu-item ${active ? 'active text-primary outline-primary' : ''
              }`}
          >
            <Link href={item.link}>
              <div className='text-xl'>{item.icon}</div>
              {item.name}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
