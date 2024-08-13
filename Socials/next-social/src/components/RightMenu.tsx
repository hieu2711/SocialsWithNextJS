"use client"
import React from 'react'
import FriendRequest from './FriendRequest'
import Birthday from './Birthday'
import Ad from './Ad'
import UserInfoCard from './UserInfoCard'
import UserMediaCard from './UserMediaCard'

type Props = {
  userId:string,
  type: "home" | "profile",
  infoUser: object
  listImage: object
}

const RightMenu = ({userId, type, infoUser, listImage}: Props) => {
  return(
  <div className='flex flex-col gap-6'>
    {userId && type === "profile" ? (
      <>
        <UserInfoCard infoUser={infoUser} userId={userId}/>
        <UserMediaCard listImage={listImage} userId={userId} />
      </>
    ): null}
        <FriendRequest />
        <Birthday />
        <Ad size='md' />
    </div>
  )
}

export default RightMenu