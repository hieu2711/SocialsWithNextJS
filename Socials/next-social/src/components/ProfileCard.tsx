import Image from 'next/image'
import React from 'react'

type Props = {}

const ProfileCard = (props: Props) => {
  return (
    <div className='p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-6 '>
        <div className='h-20 relative'>
            <Image src={"https://images.pexels.com/photos/16511639/pexels-photo-16511639/free-photo-of-bi-n-k-ngh-mua-he-du-l-ch.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"}
            alt='' fill className='rounded-md object-cover  ' />
            <Image src={"https://images.pexels.com/photos/19378027/pexels-photo-19378027/free-photo-of-dan-ba-mua-he-mo-hinh-d-i-m-t.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"} alt='' 
            width={48} height={48} className='rounded-full w-12 h-12 absolute left-0 right-0 m-auto -bottom-6 ring-1 ring-white z-10 object-cover  ' />
        </div>
        <div className='h-20 flex flex-col gap-2 items-center'>
            <span className='font-semibold'>Trần Đức Hiếu</span>
            <div className='flex items-center gap-4'>
                <div className='flex '>
                <Image src={"https://images.pexels.com/photos/19378027/pexels-photo-19378027/free-photo-of-dan-ba-mua-he-mo-hinh-d-i-m-t.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"} alt='' 
                width={12} height={12} className='rounded-full w-3 h-3  object-cover  ' />
                 <Image src={"https://images.pexels.com/photos/19378027/pexels-photo-19378027/free-photo-of-dan-ba-mua-he-mo-hinh-d-i-m-t.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"} alt='' 
                width={12} height={12} className='rounded-full w-3 h-3  object-cover  ' />
                 <Image src={"https://images.pexels.com/photos/19378027/pexels-photo-19378027/free-photo-of-dan-ba-mua-he-mo-hinh-d-i-m-t.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"} alt='' 
                width={12} height={12} className='rounded-full w-3 h-3  object-cover  ' />
                </div>
                <span className='text-xs text-gray-500'>500 Followers</span>
            </div>
            <button className='bg-blue-500 text-white text-xs p-2 rounded-md'>
                My Profile
            </button>
        </div>
    </div>
  )
}

export default ProfileCard