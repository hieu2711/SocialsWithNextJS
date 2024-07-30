import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
  userId:string
}

const UserInfoCard = ({userId}: Props) => {
  return (
    <div className='p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4'>
        <div className='flex justify-between items-center font-medium'>
            <span className='text-gray-500'>User Information</span>
            <Link href="/" className='text-blue-500 text-xs'>See all</Link>
        </div>

        <div className='flex flex-col gap-4 text-gray-500 '>
          <div className='flex items-center gap-2 '>
            <span className='text-xl text-black font-semibold'>Trần Đức Hiếu</span>
          </div>
          <p className=''>Năm 2014, khi Đức đánh bại Argentina, họ đã làm động tác đi bộ như loài vượn và gọi chúng tôi là những kẻ chưa phát triển</p>
        <div className='flex items-center gap-2 '>
          <Image src={"/map.png"} alt='' width={16} height={16}/>
          <span>Living in <b>Ho Chi Minh City</b></span>
        </div>
        <div className='flex items-center gap-2 '>
          <Image src={"/school.png"} alt='' width={16} height={16}/>
          <span>Went to <b>Mo University</b></span>
        </div>
        <div className='flex items-center gap-2 '>
          <Image src={"/work.png"} alt='' width={16} height={16}/>
          <span>Work at <b>TSTtourist Company</b></span>
        </div>
        <div className='flex items-center justify-between '>
          <div className='flex gap-1 items-center '>
          <Image src={"/link.png"} alt='' width={16} height={16}/>
          <Link target='_blank' href={'https://myprofile-hieu2711s-projects.vercel.app/'} className='text-blue-500 font-medium'>hieutranduc</Link>
          </div>
          <div className='flex gap-1 items-center'>
            <Image src={"/date.png"} alt='' width={16} height={16}/>
            <span>Joined November 2024</span>
          </div>
        </div>
        <button className='bg-blue-500 text-white text-sm rounded-md p-2 '>Follow</button>
        <span className='text-red-400 self-end text-xs cursor-pointer'>Block User</span>
        </div>
    </div>
  )
}

export default UserInfoCard