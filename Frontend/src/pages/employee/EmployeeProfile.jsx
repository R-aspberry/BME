import React, { useEffect, useState } from 'react'
import { me } from '../../services/auth'

export default function EmployeeProfile() {
  const [profile, setProfile] = useState(null)
  const [displayName, setDisplayName] = useState(() => localStorage.getItem('displayName') || localStorage.getItem('userName') || 'Employee')
  const [mood, setMood] = useState(() => localStorage.getItem('mood') || 'Focused')
  const [energy, setEnergy] = useState(() => localStorage.getItem('socialEnergy') || '60')
  const [saved, setSaved] = useState(false)
  useEffect(() => { me().then(setProfile).catch(() => {}) }, [])

  function saveChanges() {
    localStorage.setItem('displayName', displayName)
    localStorage.setItem('mood', mood)
    localStorage.setItem('socialEnergy', energy)
    localStorage.setItem('userName', displayName)
    window.dispatchEvent(new Event('social-energy-updated'))
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2200)
  }

  const username = profile?.userName || localStorage.getItem('userName') || 'Employee'
  return <div className="employee-content aaib-animate-fade"><div className="employee-page-heading"><div><p className="employee-eyebrow">YOUR IDENTITY</p><h1>My profile</h1><p>Keep your presence and availability up to date.</p></div><div className="employee-save-wrap">{saved && <span className="employee-save-confirm">Changes saved</span>}<button className="aaib-btn aaib-btn-primary" onClick={saveChanges}>Save changes</button></div></div><div className="employee-profile-grid"><section className="aaib-panel employee-profile-card"><div className="employee-profile-hero"><div className="employee-profile-avatar">{displayName.slice(0, 1).toUpperCase()}</div><div><h2>{displayName}</h2><p>{profile?.role || 'Employee'} · BME workspace</p></div></div><label className="aaib-label-required">Display name</label><input className="aaib-input" value={displayName} onChange={event => setDisplayName(event.target.value)} /><label className="aaib-label-required">Username</label><input className="aaib-input" value={username} disabled /></section><section className="aaib-panel employee-profile-card"><p className="employee-eyebrow">PERSONAL SIGNALS</p><h2>How are you today?</h2><div className="aaib-mood-grid">{['Focused', 'Energized', 'Available', 'Heads down'].map(option => <button type="button" className={`aaib-mood-option${mood === option ? ' active' : ''}`} onClick={() => setMood(option)} key={option}>{option}</button>)}</div><div className="employee-energy-heading"><h3>Social energy</h3><strong>{energy}%</strong></div><input className="aaib-range" type="range" min="0" max="100" value={energy} onChange={event => setEnergy(event.target.value)} style={{ '--range-value': `${energy}%` }} /><div className="aaib-range-labels"><span>Quiet focus</span><span>Open to connect</span></div><p className="employee-signal-note">{Number(energy) >= 70 ? 'Your team can see you are open to connect.' : Number(energy) >= 40 ? 'Your status shows focused availability.' : 'Your status signals protected focus time.'}</p></section></div></div>
}
