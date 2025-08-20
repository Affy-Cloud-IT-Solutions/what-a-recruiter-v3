import { Loader2 } from 'lucide-react'
import React from 'react'

const Loader = () => {
  return (
    <div className='min-h-screen flex items-center justify-center w-full'>
        <Loader2 className='animate-spin scale-105'/>
    </div>
  )
}

export default Loader