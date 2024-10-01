import React from 'react'
import { TaskWrapper } from './components'
import { Metadata } from 'next'
export const metadata:Metadata ={
  title:'Task',
} 

const page = () => {
  return (
   <TaskWrapper />
  )
}

export default page