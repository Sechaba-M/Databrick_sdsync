import React from 'react'
import DashboardPage from '../components/Dashboard/DashboardPage'
export default function DashboardInfoPage({ onLogout, isAdmin }) {
  return (
    <DashboardPage onLogout={onLogout} isAdmin={isAdmin}/>
  )
}
