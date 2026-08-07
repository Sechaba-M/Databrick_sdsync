import React from 'react'
import ChemicalPage from '../components/UserHome/UserChemicalDashboard'
export default function UserHome({ onLogout, isAdmin }) {
  return (
   <ChemicalPage onLogout={onLogout} isAdmin={isAdmin}/>
  )
}
