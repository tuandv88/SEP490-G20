import React from 'react'
import { testRoute } from '@/routers/router'
import { useMatch } from '@tanstack/react-router'

export default function Test() {
    const { params } = useMatch(testRoute.id);

    return (
    <div>
      <h1>Test ID: {params.testId || 'No ID'}</h1>
    </div>
  )
}
