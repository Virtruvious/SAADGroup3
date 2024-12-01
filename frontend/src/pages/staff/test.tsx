import { AppSidebar } from "@/components/app-sidebar"
import ManageMemberships from "@/pages/staff/ManageMemberships"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import StaffHeader from "@/components/Staff-Header"
import { use } from "react"

export  default function Page() {
  
  return (
    <ManageMemberships />
  )
}
