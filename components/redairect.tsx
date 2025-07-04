"use client"
import React, { useEffect } from 'react'

const Redirect = () => {

    useEffect(()=>{
        // Redirect to dashboard after 3 seconds
        const timer = setTimeout(() => {
            window.location.href = '/dashboard';
        }, 3000);

        // Cleanup the timer on component unmount
        return () => clearTimeout(timer);
    })

  return (
    <div>
         <h1 className='text-center flex items-center justify-center w-full h-screen'>Go to dashboard</h1>
    </div>
  )
}

export default Redirect