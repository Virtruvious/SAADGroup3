import React from 'react'
import Header from "@/components/Header" //this is for non authenticated users
// import Header from "@/components/AuthenticatedHeader" // this is for authenticated users
import Footer from "@/components/Footer"

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

export default MainLayout