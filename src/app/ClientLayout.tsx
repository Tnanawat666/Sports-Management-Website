// app/ClientLayout.tsx
'use client'

import { usePathname } from 'next/navigation'
import Navbar from './compo/navBar'
import SideBar from './compo/sideBar'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  return (
    <>
      {!isLoginPage && <Navbar />}
      <div
        className={`flex flex-1 ${
          isLoginPage ? 'items-center justify-center' : ''
        }`}
      >
        {!isLoginPage && (
          <aside className='w-1/6 mt-5'>
            <SideBar />
          </aside>
        )}
        <main
          className={`w-5/6 ${
            !isLoginPage && `m-5 p-5 outline outline-gray-300`
          } h-full`}
        >
          {children}
        </main>
      </div>
    </>
  )
}
