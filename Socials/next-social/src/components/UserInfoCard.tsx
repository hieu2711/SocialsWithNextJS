import { useGlobalContext } from '@/app/globalContext';
import { endpoints } from '@/config/api';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import EditContent from './EditContent';

type Props = {
  userId: string;
  infoUser: object;
};

const UserInfoCard = ({ infoUser }: Props) => {
  const { id } = useGlobalContext();
  const { id: pathId } = useParams();
  const [isFollowing, setIsFollowing] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isBlock, setIsBlock]  = useState<string | undefined>(undefined);
  const [isShow, setIsShow] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isFriend, setIsFriend] = useState()
  const [isAddFriend, setIsAddFriend] = useState(false)
  const [isUnfriend, setIsUnFriend] = useState(false)
   useEffect(() => {
    if (id && pathId) {
      const storedIsFollowing = localStorage.getItem(`following-${pathId}`);
      if (storedIsFollowing) {
        setIsFollowing(storedIsFollowing);
      } else {
        fetchFollower();
      }

      const storedIsBlock = localStorage.getItem(`block-${pathId}`);
      if (storedIsBlock) {
        setIsBlock(storedIsBlock);
      } else {
        fetchBlock();
      }

      checkFriendship()
    }
  }, [id, pathId]);

  const fetchFollower = async () => {
    if (!id || !pathId) return;

    try {
      setIsLoading(true);
      const res = await axios.post(endpoints.switchFollow(pathId), {
        currentUserId: id,
      });
      const status = res.data?.message;
      setIsFollowing(status);
      localStorage.setItem(`following-${pathId}`, status);
    } catch (error) {
      console.error('Error fetching follower:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBlock = async () => {
    if (!id || !pathId) return;

    try {
      setIsLoading(true);
      const res = await axios.post(endpoints.toggleBlock(pathId), {
        currentUserId: id,
      });
      const status = res.data?.message;
      setIsBlock(status);
      localStorage.setItem(`block-${pathId}`, status);
    } catch (error) {
      console.error('Error fetching block:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollower = () => {
    if (!isLoading) {
      fetchFollower();
    }
  };

  const handleBlock = () => {
    if (!isLoading) {
      fetchBlock();
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
};

const handleClose = () => {
    setAnchorEl(null);
};

const handleEditClick = () => {
    setIsShow(true);
    handleClose();
};

const handleModalClose = () => {
    setIsShow(false);
};

const checkFriendship = async () =>{
  const res = await axios.post(endpoints.checkFriendship,{
    userId: id,
    friendId: pathId
  })
  setIsFriend(res.data.success)
}

const handleAddFriend = async () => {
  const res = await axios.post(endpoints.toggleFollowRequest(pathId),{
    currentUserId: id
  })
  if(res.status === 200){
    setIsAddFriend(!isAddFriend)
  }
}

const handleUnFriend = async () => {
  const res = await axios.post(endpoints.removeFriend,{
    userId: id,
    friendId: pathId
  })
  if(res.status === 200){
    setIsFriend(false);
    setIsAddFriend(false);
  }
}

  const isUserFollowing = isFollowing === 'Followed user';
  const isUserBlock = isBlock === 'Blocked user';

  return (
    <div className='p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4'>
      <div className='flex justify-between items-center font-medium'>
        <span className='text-gray-500'>User Information</span>
        {id === pathId &&
        <p onClick={handleEditClick} className='text-blue-500 text-xs cursor-pointer'>Update</p>
        }
      </div>

      <div className='flex flex-col gap-4 text-gray-500 '>
        <div className='flex items-center gap-2 '>
          <span className='text-xl text-black font-semibold'>{infoUser?.name}</span>
        </div>
        <p className=''>{infoUser?.description}</p>
        <div className='flex items-center gap-2 '>
          <Image src={"/map.png"} alt='' width={16} height={16}/>
          <span>Living in <b>{infoUser?.city}</b></span>
        </div>
        <div className='flex items-center gap-2 '>
          <Image src={"/school.png"} alt='' width={16} height={16}/>
          <span>Went to <b>{infoUser?.school}</b></span>
        </div>
        <div className='flex items-center gap-2 '>
          <Image src={"/work.png"} alt='' width={16} height={16}/>
          <span>Work at <b>{infoUser?.work}</b></span>
        </div>
        <div className='flex items-center justify-between '>
          <div className='flex gap-1 items-center '>
            <Image src={"/link.png"} alt='' width={16} height={16}/>
            <Link target='_blank' href={infoUser?.website || "/"} className='text-blue-500 font-medium'>{infoUser?.name}</Link>
          </div>
        </div>
        {id !== pathId &&
          <>
            {isUserFollowing ? (
              <button onClick={handleFollower} className='bg-red-500 text-white text-sm rounded-md p-2 '>Unfollow</button>
            ) : (
              <button onClick={handleFollower} className='bg-blue-500 text-white text-sm rounded-md p-2 '>Follow</button>
            )}
            <div className='flex justify-between'>
              {isFriend ? (
                <span onClick={handleUnFriend} className='text-red-400 self-end text-xs cursor-pointer'>UnFriend</span>
              ) : (
                <span onClick={handleAddFriend} className='text-blue-400 self-end text-xs cursor-pointer'>
                 {isAddFriend ? "Cancel" : "AddFriend"} 
                  </span>
              )}

              {!isUserBlock ? (
                <span onClick={handleBlock} className='text-red-400 self-end text-xs cursor-pointer'>Block User</span>
              ) : (
                <span onClick={handleBlock} className='text-blue-400 self-end text-xs cursor-pointer'>Unlock User</span>
              )}
            </div>
          </>
        }
      </div>

      <EditContent
                    open={isShow}
                    handleClose={handleModalClose}
                    isShowFormShared={'info'}
                    data={{name: infoUser?.name, job: infoUser?.description, living: infoUser?.city,
                      went: infoUser?.school, works: infoUser?.work, profile: infoUser?.website,
                     }}
                />
    </div>
  );
};

export default UserInfoCard;
