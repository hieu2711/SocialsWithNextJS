import { useGlobalContext } from '@/app/globalContext'
import { endpoints } from '@/config/api'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type Props = {}

const ListFriendRequest = (props: Props) => {
    const { id } = useGlobalContext()
    const [flRequest, setFlRequest] = useState<any[]>([])

    useEffect(() =>{
        fetchRequestAddFriend()
    },[id])

    const fetchRequestAddFriend = async () =>{
        try {
            const {data} = await axios.get(endpoints.getFollowRequests(id));
            setFlRequest(data.data)
            console.log(data.data)
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
         <div className=''>
            { flRequest?.map((item, index) =>{
                return (
                    <>
                    <div key={index} className='flex items-center justify-between mb-3'>
                    <div  className='flex items-center gap-4'>
                        <Image src={item?.sender?.avatar} alt="" width={40} height={40} className='w-10 h-10 rounded-full object-cover' />
                        <Link href={`/profile/${item?.sender?.id}`} className='font-semibold'>{item?.sender?.name}</Link>
                    </div>
                    <div className='flex gap-3 justify-end'>
                        <Image onClick={() => handleAcceptFriend(item)} src="/accept.png" 
                        alt="" width={20} height={20} className='cursor-pointer' />
                        <Image onClick={() => handleRejectFriend(item)} src="/reject.png" 
                        alt="" width={20} height={20} className='cursor-pointer' />
                    </div>
                    </div>
                </>
                )
            } )
            }
        </div>
  )
}

export default ListFriendRequest