import React, { useEffect, useState } from 'react'

const seededEvents = [
  { id: 'checkpoint', date: '12', month: 'SEP', title: 'Project checkpoint', detail: 'Online Banking Revamp', tone: 'gold' },
  { id: 'review', date: '18', month: 'SEP', title: 'Design review', detail: 'Customer Portal', tone: 'green' },
  { id: 'delivery', date: '26', month: 'SEP', title: 'Delivery milestone', detail: 'Marketing Campaign Tool', tone: 'blue' }
]

export default function EmployeeCalendar() {
  const [events, setEvents] = useState(() => JSON.parse(localStorage.getItem('employeeReminders') || 'null') || seededEvents)
  const [monthOffset, setMonthOffset] = useState(0)
  const month = new Date(2026, 8 + monthOffset, 1)
  const label = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const monthCode = month.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()

  useEffect(() => { localStorage.setItem('employeeReminders', JSON.stringify(events)) }, [events])
  function addReminder() {
    const title = window.prompt('Reminder title')
    if (!title?.trim()) return
    const date = window.prompt('Day of the month (1-31)', '15')
    if (!date || Number(date) < 1 || Number(date) > days) return
    setEvents(current => [...current, { id: `${Date.now()}`, date: String(Number(date)), month: monthCode, title: title.trim(), detail: 'Personal reminder', tone: 'gold' }])
  }

  return <div className="employee-content aaib-animate-fade"><div className="employee-page-heading"><div><p className="employee-eyebrow">YOUR SCHEDULE</p><h1>Calendar</h1><p>Keep project milestones and personal reminders in view.</p></div><button className="aaib-btn aaib-btn-primary" onClick={addReminder}>+ Add reminder</button></div><div className="employee-calendar-layout"><section className="aaib-panel employee-calendar"><div className="employee-calendar-top"><h2>{label}</h2><div><button className="calendar-arrow" onClick={() => setMonthOffset(value => value - 1)}>‹</button><button className="calendar-arrow" onClick={() => setMonthOffset(value => value + 1)}>›</button></div></div><div className="calendar-weekdays">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => <span key={day}>{day}</span>)}</div><div className="calendar-days">{Array.from({ length: days }, (_, index) => <span className={events.some(event => Number(event.date) === index + 1 && event.month === monthCode) ? 'has-event' : ''} key={index}>{index + 1}</span>)}</div></section><section className="employee-upcoming"><p className="employee-eyebrow">UP NEXT</p><h2>Upcoming events</h2>{events.map(event => <div className="employee-event" key={event.id}><div className={`employee-event-date ${event.tone}`}><strong>{event.date}</strong><span>{event.month}</span></div><div><strong>{event.title}</strong><p>{event.detail}</p></div></div>)}</section></div></div>
}
