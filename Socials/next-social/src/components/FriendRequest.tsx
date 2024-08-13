import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import ListFriendRequest from './ListFriendRequest'
import { useGlobalContext } from '@/app/globalContext'

type Props = {}

const FriendRequest = (props: Props) => {
  const {id} = useGlobalContext()
  return (
    <div className='p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4'>
        <div className='flex justify-between items-center font-medium'>
            <span className='text-gray-500'>Friend Requests</span>
            <Link href={`friend/${id}`} className='text-blue-500 text-xs'>See all</Link>
        </div>
        <ListFriendRequest />
    </div>
  )
}

export default FriendRequest