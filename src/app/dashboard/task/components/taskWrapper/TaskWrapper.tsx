import React from 'react'
import { AddTaskModalCon } from '../addTaskModalCon'

const TaskWrapper = () => {
  return (
    <section className='mb-10 mt-4'>
      <div className='container'>
        <div className="max-w-[668px] mx-auto">
          <AddTaskModalCon />
        </div>
      </div>
    </section>
  )
}

export default TaskWrapper