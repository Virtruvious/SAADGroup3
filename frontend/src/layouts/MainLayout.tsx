import React from 'react'
import { usePathname } from 'next/navigation'
import Header from "@/components/Header"
import AuthenticatedHeader from "@/components/AuthenticatedHeader"
import Footer from "@/components/Footer"
import { useSession } from "next-auth/react"

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { status } = useSession()
  const pathname = usePathname()
  
  const isStaffLoginPage = pathname ? pathname.startsWith('/staff/') : false

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!isStaffLoginPage && (
        status === "authenticated" ? <AuthenticatedHeader /> : <Header />
      )}
      <main className="flex-grow">{children}</main>
      {!isStaffLoginPage && <Footer />}
    </div>
  )
}

export default MainLayout

