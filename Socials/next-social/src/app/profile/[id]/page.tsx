'use client'
import Feed from '@/components/Feed'
import LeftMenu from '@/components/LeftMenu'
import RightMenu from '@/components/RightMenu'
import Image from 'next/image'
import React from 'react'

type Props = {}

const ProfilePage = (props: Props) => {
  return (
    <div className='flex gap-6 pt-6'>
    <div className="hidden xl:block w-[20%]"><LeftMenu type='profile'/></div>
    <div className="w-full lg:w-[70%] xl:w-[50%]">
      <div className="flex flex-col gap-6 ">
        <div className='flex flex-col items-center justify-center'>
          <div className='w-full h-64 relative'>
            <Image src={"https://images.pexels.com/photos/18430870/pexels-photo-18430870/free-photo-of-den-va-tr-ng-thanh-ph-d-ng-ph-cac-toa-nha.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"} alt='' 
            fill className='object-cover rounded-md' />
            <Image src={"https://images.pexels.com/photos/27255532/pexels-photo-27255532/free-photo-of-c-u-thang-dan-ba-chan-dung-nhin-t-tren-xu-ng.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"} alt='' 
            width={128} height={128} className='object-cover w-32 h-32 rounded-full absolute left-0 right-0 m-auto -bottom-16 ring-4 ring-white ' />
          </div>
          <h1 className='mt-20 mb-4 text-2xl font-medium '>Trần Đức Hiếu</h1>
          <div className='flex items-center justify-center gap-12 mb-4 '>
            <div className='flex flex-col items-center'>
              <span className='font-medium'>123</span>
              <span className='text-sm'>Posts</span>
            </div>
            <div className='flex flex-col items-center'>
              <span className='font-medium'>1.2K</span>
              <span className='text-sm'>Followers</span>
            </div>
            <div className='flex flex-col items-center'>
              <span className='font-medium'>2.1K</span>
              <span className='text-sm'>Following</span>
            </div>
          </div>
        </div>
        <Feed />
      </div>
    </div>
    <div className="hidden lg:block w-[30%]"><RightMenu type='profile' userId="test" /></div>
  </div>
  )
}

export default ProfilePage