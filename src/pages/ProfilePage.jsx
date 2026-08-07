import React from 'react'
import Profile from '../components/ProfilePage/Profile'
export default function ProfilePage({ onLogout, isAdmin }) {
  return (
    <Profile onLogout={onLogout} isAdmin={isAdmin}/>
  )
}
