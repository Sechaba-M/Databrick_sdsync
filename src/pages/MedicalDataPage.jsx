import React from 'react'
import MedicalSurveillancePage from '../components/MedicalData/MedicalSurveillancePage'
export default function MedicalDataPage({ onLogout, isAdmin }) {
  return (
    <MedicalSurveillancePage onLogout={onLogout} isAdmin={isAdmin}/>
  )
}
