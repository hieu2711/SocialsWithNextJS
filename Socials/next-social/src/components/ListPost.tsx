import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import UserComment from './Comment';
import axios from 'axios';
import { Comment } from '../config/interface';
import { endpoints } from '@/config/api';

type Props = {
    name: string;
    avt: string;
    image: string;
    desc: string;
    postId: number;
    commentList: Comment[];
    avatarUser: string;
    userId: number;
};

const ListPost = ({ userId, name, avt, image, desc, postId, commentList, avatarUser }: Props) => {
    const [likesCount, setLikesCount] = useState(0);
    const [commentsCount, setCommentsCount] = useState(0);
    const [sharesCount, setSharesCount] = useState(0);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const likeRes = await axios.get(endpoints.getCountLike(postId));
                setLikesCount(likeRes.data.likesCount);

                const cmtRes = await axios.get(endpoints.getCountComment(postId));
                setCommentsCount(cmtRes.data.commentsCount);

                const sharedRes = await axios.get(endpoints.getCountShared(postId));
                setSharesCount(sharedRes.data.shareCount);
            } catch (error) {
                console.error('Error fetching counts:', error);
            }
        };

        fetchCounts();
    }, [postId]);
    return (
        <div className='flex flex-col gap-4 bg-white p-4 rounded-lg shadow-md'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <Image src={avt} width={40} height={40} alt={`${name}'s avatar`} className='w-10 h-10 rounded-full' />
                    <span className='font-medium'>{name}</span>
                </div>
                <Image src="/more.png" width={16} height={16} alt="More options" className='rounded-full' />
            </div>
            <div className='flex flex-col gap-4'>
                <div className='w-full min-h-96 relative'>
                    <Image src={image} fill alt="Post image" className='object-cover rounded-md' />
                </div>
                <p className='text-sm font-medium'>{desc}</p>
            </div>
            <div className='flex items-center justify-between text-sm my-4'>
                <div className='flex gap-8'>
                    <div className='flex items-center gap-4 bg-slate-50 p-2 rounded-xl'>
                        <Image src="/like.png" width={16} height={16} alt="Like" className='cursor-pointer' />
                        <span className='text-gray-300'>|</span>
                        <span className='text-gray-700'>{likesCount}<span className='hidden md:inline ml-1'>likes</span></span>
                    </div>
                    <div className='flex items-center gap-4 bg-slate-50 p-2 rounded-xl'>
                        <Image src="/comment.png" width={16} height={16} alt="Comment" className='rounded-full cursor-pointer' />
                        <span className='text-gray-300'>|</span>
                        <span className='text-gray-700'>{commentsCount}<span className='hidden md:inline ml-1'>comments</span></span>
                    </div>
                </div>
                <div>
                    <div className='flex items-center gap-4 bg-slate-50 p-2 rounded-xl'>
                        <Image src="/share.png" width={16} height={16} alt="Share" className='cursor-pointer' />
                        <span className='text-gray-300'>|</span>
                        <span className='text-gray-700'>{sharesCount}<span className='hidden md:inline ml-1'>shares</span></span>
                    </div>
                </div>
            </div>
            <UserComment commentList={commentList} avatarUser={avatarUser} postId={postId} userId={userId}/>
        </div>
    );
};

export default ListPost;
