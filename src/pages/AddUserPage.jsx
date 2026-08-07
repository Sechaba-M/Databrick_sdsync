import React from 'react'
import AdminUserManagement from '../components/AddUser/AdminUserManagement'

export default function AddUserPage({ onLogout, isAdmin }) {
  return (
    <AdminUserManagement onLogout={onLogout} isAdmin={isAdmin}/>
  )
}
