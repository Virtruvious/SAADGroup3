import React from 'react'
import Header from "@/components/Header"
import AuthenticatedHeader from "@/components/AuthenticatedHeader"
import Footer from "@/components/Footer"
import { useSession } from "next-auth/react"

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { status } = useSession()
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {status === "authenticated" ? <AuthenticatedHeader /> : <Header />}
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

export default MainLayout