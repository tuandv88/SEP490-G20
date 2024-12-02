import React from 'react'
import { Outlet } from '@tanstack/react-router'
import { Suspense } from 'react'

function PublicLayout() {
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default PublicLayout
