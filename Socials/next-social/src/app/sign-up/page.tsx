'use client'
import { endpoints } from '@/config/api'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type Props = {}

const page = (props: Props) => {
  const [name, setName] = useState<string>('')
  const [phoneNum, setPhoneNum] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const router = useRouter();

  const handleSignup = async () =>{
    try {
      let { data } = await axios.post(endpoints.register,{
        name:name,
        phone: phoneNum,
        password: password
      })
      console.log('Đăng kí thành công' + JSON.stringify(data))
      localStorage.setItem('token', data.token)
      router.push('/sign-in')
    } catch (error) {
      console.log('Đăng kí thất bại' + error)
    }
  }
  return (
    <div className='bg-gray-100 h-screen flex items-center justify-center'>
      <div className='flex justify-center items-center'>
        <div className='w-1/2'> 
          <h1 className='text-2xl font-bold mb-4 text-blue-600'>Social App</h1>
          <p>Connect with friends and the world around you on Social.</p>
        </div>
        <div className='w-1/2 bg-white rounded-md p-8 shadow-md'>
        <h1 className='text-center font-bold text-3xl my-3 mb-6 text-blue-600'>Social App</h1>
          <div>
          <input 
              type='text' 
              className='w-full mb-4 p-2 border border-gray-300 rounded-md' 
              placeholder='Full name...'
              onChange={(e) =>setName(e.target.value)}
            />
            <input 
              type='text' 
              className='w-full mb-4 p-2 border border-gray-300 rounded-md' 
              placeholder='Phone number...' 
              onChange={(e) =>setPhoneNum(e.target.value)}
            />
            <input 
              type='password' 
              className='w-full p-2 border border-gray-300 rounded-md' 
              placeholder='Password...' 
              onChange={(e) =>setPassword(e.target.value)}
            />
            <button onClick={handleSignup} type='submit' className='w-full mt-4 bg-blue-500 text-white p-2 rounded-md'>Sign Up</button>
            <div className='w-full h-[1px] bg-gray-400 bottom-2 mt-3'></div>
            <button type='submit' className='w-full mt-4 bg-green-400 text-white p-2 rounded-md'><Link href="/sign-in">Do you already have an account?</Link></button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default page
