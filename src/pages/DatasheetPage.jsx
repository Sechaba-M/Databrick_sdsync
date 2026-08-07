import React from 'react'
import SDSPage from '../components/DataSheet/SDSPage'

export default function DatasheetPage({ onLogout, isAdmin }) {
  return (
    <SDSPage onLogout={onLogout} isAdmin={isAdmin}/>
  )
}
