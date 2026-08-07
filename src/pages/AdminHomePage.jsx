import React from 'react'
import ChemicalDashboardPage from '../components/AdminHome/AdminChemicalDashboardPage'
export default function AdminHomePage({ onLogout, isAdmin }) {
  return (
    <ChemicalDashboardPage onLogout={onLogout} isAdmin={isAdmin} />
  )
}
