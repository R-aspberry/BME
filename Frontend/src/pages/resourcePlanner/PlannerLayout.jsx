import React from 'react'
import { Outlet } from 'react-router-dom'
import PlannerSidebar from './PlannerSidebar'
import PlannerHeader from './PlannerHeader'
import './planner.css'

export default function PlannerLayout() {
  return (
    <div className="planner-shell">

      <PlannerHeader />

      <div className="planner-frame">

        <PlannerSidebar />

        <main className="planner-main">
          <Outlet />
        </main>

      </div>

    </div>
  )
}