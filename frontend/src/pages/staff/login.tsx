import StaffLoginForm from '@/components/StaffLoginForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Staff Login | Library Management System',
  description: 'Login page for library staff members',
}

export default function StaffLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">Library Staff Login</h1>
          <StaffLoginForm />
        </div>
      </div>
    </div>
  )
}

