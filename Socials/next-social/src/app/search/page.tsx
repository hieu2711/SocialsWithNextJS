"use client";
import LeftMenu from '@/components/LeftMenu';
import { endpoints } from '@/config/api';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../globalContext';

type Props = {}

const Page = (props: Props) => {
  const { id } = useGlobalContext();
  const searchParams = useSearchParams();
  const [name, setName] = useState<string | undefined>(undefined);
  const [dataSearch, setDataSearch] = useState<any>(null);

  useEffect(() => {
    const nameParam = searchParams.get('name');
    setName(nameParam || '');
  }, [searchParams]);

  useEffect(() => {
    if (name) {
      fetAPISearch(name);
    }
  }, [name]);

  const fetAPISearch = async (keywords: string) => {
    try {
      const res = await axios.get(endpoints.search(keywords));
      if (res.status === 200) {
        const searchData = res.data;
        setDataSearch(searchData);
        await checkFriendships(searchData);
      } else {
        console.error('Error:', res.data.message);
      }
    } catch (error) {
      console.error('API request failed:', error.response?.data || error.message);
    }
  }

  const checkFriendships = async (data: any) => {
    if (id) {
      try {
        const updatedData = await Promise.all(data.map(async (item: any) => {
          const isFriend = await checkFriendship(item.id);
          return { ...item, isFriend, isAddFriend: !isFriend && await checkPendingRequest(item.id) };
        }));
        setDataSearch(updatedData);
      } catch (error) {
        console.error('Failed to check friendships:', error.response?.data || error.message);
      }
    }
  }

  const checkFriendship = async (friendID: number) => {
    try {
      const res = await axios.post(endpoints.checkFriendship, {
        userId: id,
        friendId: friendID
      });
      return res.data.success;
    } catch (error) {
      console.error('Failed to check friendship:', error.response?.data || error.message);
      return false;
    }
  };

  const checkPendingRequest = async (friendID: number) => {
    try {
      const res = await axios.post(endpoints.checkPendingRequest, {
        userId: id,
        friendId: friendID
      });
      return res.data.exists;
    } catch (error) {
      console.error('Failed to check pending request:', error.response?.data || error.message);
      return false;
    }
  };

  const handleAddFriend = async (friendID: number, isAddFriend: boolean) => {
    try {
      const res = await axios.post(
        `http://localhost:3001/api/followRequests/toggleFollowRequest/${friendID}`,
        {
          currentUserId: id
        }
      );
      if (res.status === 200) {
        setDataSearch(prevData =>
          prevData.map((item: any) =>
            item.id === friendID
              ? {
                  ...item,
                  isAddFriend: !isAddFriend,
                  isFriend: res.data.isFriend // Giả sử phản hồi chứa trạng thái bạn bè
                }
              : item
          )
        );
      }
    } catch (error) {
      console.error('Failed to send friend request:', error.response?.data || error.message);
    }
  }

  return (
    <div className='flex gap-10 pt-6'>
      <div className="hidden xl:block w-[20%]"><LeftMenu type="home" /></div>
      <div className='w-[50%] bg-white mx-auto flex flex-col gap-3 p-3 h-full'>
        <h1 className='font-bold text-xl'>People</h1>
        {dataSearch?.map((item, index) => (
          <div key={index} className='flex justify-between items-center mb-3'>
            <Link href={`/profile/${item?.id}`} className='flex items-center gap-5'>
              <Image src={item?.avatar} alt='' width={50} height={50} className='rounded-full object-cover' />
              <div>
                <p className='font-bold'>{item?.name}</p>
                <div className='flex text-gray-500 gap-2'>
                {parseInt(item.id) !== parseInt(id) &&
                  <p>{item.isFriend ? 'Friend' : 'Not Friend'}</p>
                }
                  <p>Living at {item?.city}</p>
                </div>
                <p className='text-gray-500'>Works at {item.work}</p>
              </div>
            </Link>
            {parseInt(item.id) !== parseInt(id) && (
              <button
                className={`bg-[#ECF3FF] ${item.isAddFriend ? 'text-gray-500' : 'text-[#1877F2]'} p-2 font-semibold rounded-lg`}
                disabled={item.isFriend && !item.isAddFriend}
                onClick={() => handleAddFriend(item.id, item.isAddFriend)}
              >
                {item.isFriend ? 'Friend' : (item.isAddFriend ? 'Request Sent' : 'Add Friend')}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;
