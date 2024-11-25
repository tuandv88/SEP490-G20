
import { useParams } from '@tanstack/react-router'
import React from "react"
const Test = () => {
  const { testId } = useParams()
  return <div>Test {testId}</div>
}

export default Test
