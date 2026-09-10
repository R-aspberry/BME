import React, { useEffect, useState } from 'react'
import { getBOS, getBO } from '../../services/boService'
import { me } from '../../services/authService'

export default function Profile(){
  const [meInfo, setMeInfo] = useState(null)
  const [bo, setBo] = useState(null)

  useEffect(()=>{
    me().then(setMeInfo).catch(()=>{})
    getBOS().then(list=>{
      const userName = localStorage.getItem('userName')
      // try to find BO by matching user id later via /api/auth/me
      setBo(list[0])
    })
  },[])

  if (!meInfo) return <div>Loading...</div>

  return (
    <div>
      <h1>Profile</h1>
      <div className="card">
        <div><strong>Username:</strong> {meInfo.userName}</div>
        <div><strong>Role:</strong> {meInfo.role}</div>
      </div>

      <section>
        <h2>Business Owner</h2>
        {bo ? (
          <div className="card">
            <div><strong>Name:</strong> {bo.name}</div>
            <div><strong>Email:</strong> {bo.email}</div>
            <div><strong>Business Area:</strong> {bo.business_Area}</div>
          </div>
        ) : <div>No BO record found.</div>}
      </section>
    </div>
  )
}
