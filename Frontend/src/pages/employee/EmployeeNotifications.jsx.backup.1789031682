import React, { useState } from 'react'

const notifications = [
  { title: 'Project assignment', text: 'You have been added to Online Banking Revamp.', time: 'Today, 09:40', unread: true },
  { title: 'Milestone approaching', text: 'Customer Portal has a delivery milestone this week.', time: 'Yesterday', unread: true },
  { title: 'Profile reminder', text: 'Complete your profile so colleagues can find you.', time: '2 days ago', unread: false }
]

export default function EmployeeNotifications() {
  const [read, setRead] = useState(() => localStorage.getItem('notificationsRead') === 'true')
  function markAllRead() { localStorage.setItem('notificationsRead', 'true'); setRead(true) }
  return <div className="employee-content aaib-animate-fade"><div className="employee-page-heading"><div><p className="employee-eyebrow">INBOX</p><h1>Notifications</h1><p>Updates about your assignments, projects, and profile.</p></div><button className="aaib-btn aaib-btn-secondary" onClick={markAllRead} disabled={read}>{read ? 'All caught up' : 'Mark all as read'}</button></div><div className="employee-notification-list">{notifications.map(notification => <article className={`aaib-panel employee-notification${notification.unread && !read ? ' unread' : ''}`} key={notification.title}><span className="employee-notification-dot" /><div><div className="employee-row-between"><h2>{notification.title}</h2><time>{notification.time}</time></div><p>{notification.text}</p></div></article>)}</div></div>
}
