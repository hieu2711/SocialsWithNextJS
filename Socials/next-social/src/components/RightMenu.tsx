"use client"
import React from 'react'
import FriendRequest from './FriendRequest'
import Birthday from './Birthday'
import Ad from './Ad'
import UserInfoCard from './UserInfoCard'
import UserMediaCard from './UserMediaCard'

type Props = {
  userId:string,
  type: "home" | "profile"
}

const RightMenu = ({userId, type}: Props) => {
  return(
  <div className='flex flex-col gap-6'>
    {userId && type === "profile" ? (
      <>
        <UserInfoCard userId={userId}/>
        <UserMediaCard userId={userId} />
      </>
    ): null}
        <FriendRequest />
        <Birthday />
        <Ad size='md' />
    </div>
  )
}

export default RightMenu