import { TableHead } from '@/components/ui/table'
import React from 'react'

const ServiceTableHeader = () => {
  return (
    <>
      <TableHead className="font-semibold cursor-pointer" >name</TableHead>
      <TableHead className="font-semibold cursor-pointer" >password</TableHead>
    </>
  )
}

export default ServiceTableHeader
