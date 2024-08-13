"use client"
import { useGlobalContext } from '@/app/globalContext'
import LeftMenu from '@/components/LeftMenu'
import RightMenu from '@/components/RightMenu'
import { endpoints } from '@/config/api'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Props = {}

const page = (props: Props) => {
  const { id } = useGlobalContext();
  const { id: pathId } = useParams();
  const [listFriend, setListFriend] = useState()
  const [flRequest, setFlRequest] = useState<any[]>([])

  useEffect(() =>{
      fetchRequestAddFriend()
      fetchListFriend()
  },[id])

  const fetchRequestAddFriend = async () =>{
      try {
          const {data} = await axios.get(endpoints.getFollowRequests(id));
          setFlRequest(data.data)
      } catch (error) {
          console.log(error)
      }
  }

  const fetchListFriend = async () =>{
    try {
        const {data} = await axios.get(endpoints.getListFriends(id));
        setListFriend(data)
    } catch (error) {
        console.log(error)
    }
}

  const handleAcceptFriend = async (item) =>{
      const res = await axios.post(endpoints.acceptFriendRequest,{
          senderId: item?.sender?.id,
          receiverId: id
      })
      fetchRequestAddFriend()
  }

  const handleRejectFriend = async (item) =>{
      const res = await axios.post(endpoints.rejectFriendRequest,{
          senderId: item?.sender?.id,
          receiverId: id
      })
      fetchRequestAddFriend()
  }
  return (
    <div className='flex gap-6 pt-6'>
      <div className="hidden xl:block w-[20%]"><LeftMenu type="home" /></div>
      <div className="w-full lg:w-[100%] xl:w-[100%]">
      <span className='text-gray-500 font-semibold'>Friend Requests</span>
        <div className="flex  gap-6 w-full border-b-[1px] border-gray-300 justify-start items-center mt-4 mb-4">
            {flRequest?.map((item, index) =>{
              return (
                <div key={index} className='flex items-center justify-start flex-wrap gap-5 w-[30%]'>
                <div className='flex flex-col items-center justify-start bg-white p-3 px-5 rounded-xl gap-2  mb-3 w-full'>
                    <Link className='flex gap-2 items-center justify-start' href={`/profile/${item?.sender?.id}`}>
                      <Image src={item?.sender?.avatar}
                      width={50} height={50} alt='' className='rounded-full object-cover'/>
                      <h1 className='font-semibold'>{item?.sender?.name}</h1>
                     </Link>
                    <button onClick={() => handleAcceptFriend(item)} className='bg-blue-500 p-2 rounded-lg w-full text-white'>Accept</button>
                     <button onClick={() => handleRejectFriend(item)} className='bg-gray-200 p-2 rounded-lg w-full text-black'>Delete</button>
                </div>
            </div>
              )
            })}
        </div>
        
        <span className='text-gray-500 font-semibold'>List Friends</span>
        <div className="flex gap-6 mt-4  w-full border-b-[1px] border-gray-300" >
          {listFriend?.friends?.map((item, index) =>{
            return (
              <div key={index} className=' flex items-center justify-start flex-wrap gap-5 w-[25%]'>
                <div className='flex items-center justify-center bg-white p-3 px-5 rounded-xl gap-3 mb-3   w-full'>
                      <Link href={`/profile/${item?.id}`} className='flex items-center gap-3'>
                        <div className='relative'>
                              <Image src={item?.avatar}
                              width={50} height={50} alt='' className='rounded-full'/>
                              <p className='bg-green-500 w-3 h-3 rounded-full absolute  bottom-0 right-0'></p>
                        </div>
                              <h1 className='font-semibold'>{item?.name}</h1>
                     </Link>
                </div>
                </div>
            )
          })}     
        </div>
      </div>
    </div>
  )
}

export default page