"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import UserComment from './Comment';
import axios from 'axios';
import { Comment as CommentType } from '../config/interface';
import { endpoints } from '@/config/api';
import Link from 'next/link';
import Swal from 'sweetalert2';
import EditContent from './EditContent';
import Extension from './Extension';


type Props = {
    name: string;
    avt: string;
    image: string;
    desc: string;
    postId: number;
    commentList: CommentType[];
    avatarUser: string;
    userId: number;
    idUserPost: number;
    onHidePost: (postId: number) => void;
    mediaType: string;
};

const ListPost = ({ userId, name, avt, image, desc, postId, commentList, avatarUser, idUserPost, onHidePost, mediaType, }: Props) => {
    const [likesCount, setLikesCount] = useState(0);
    const [commentsCount, setCommentsCount] = useState(0);
    const [sharesCount, setSharesCount] = useState(0);
    const [showAllComments, setShowAllComments] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isShowFormShared, setIsShowFormShared] = useState(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isShow, setIsShow] = useState(false);
    const open = Boolean(anchorEl);
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const likeRes = await axios.get(endpoints.getCountLike(postId));
                setLikesCount(likeRes.data.likesCount);

                const cmtRes = await axios.get(endpoints.getCountComment(postId));
                setCommentsCount(cmtRes.data.commentsCount);

                const sharedRes = await axios.get(endpoints.getCountShared(postId));
                setSharesCount(sharedRes.data.shareCount);

                const checkIsLiked = await axios.get(endpoints.checkUserLike(userId, postId));
                setIsLiked(checkIsLiked.data.isLiked);
            } catch (error) {
                console.error('Error fetching counts:', error);
            }
        };

        fetchCounts();
    }, [postId, isLiked]);

    const fetchLike = async () =>{
        const isLike = await axios.post(endpoints.toggleLike,{
            userId: userId,
            postId: postId,
            image: image,

        })
        setIsLiked(!isLiked)
    }  

    
    const handleShowAllComments = () => {
        setShowAllComments(!showAllComments);
    };

    const handleShowLikeEmoji = () =>{
        fetchLike();
    }

    const handleSharePost = async () => {
       setIsShowFormShared(!isShowFormShared)
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleModalClose = () => {
        setIsShowFormShared(false);
    };

    const handleHideComment = () =>{
        handleClose();
    }

    const handleHidePost = () => {
        onHidePost(postId); 
    };


    return (
        <div className='flex flex-col gap-4 bg-white p-4 rounded-lg shadow-md'>
            <div className='flex items-center justify-between cursor-pointer'>
                    <Link href={`/profile/${idUserPost}`} className='flex items-center gap-4'>
                        <Image src={avt} width={40} height={40} alt={`${name}'s avatar`} className='w-10 h-10 rounded-full' />
                        <span className='font-medium'>{name}</span>
                    </Link>
                    <Extension commentId={postId} content={desc} onHideComment={handleHideComment} isPost={true}
                 userId={userId} commentUserId={postId}  image={image} desc={desc} isShowFormShared={'post'}  onHidePost={handleHidePost}
                 indexInPost={0}/>
            </div>
           
             <div className='flex flex-col gap-4'>
             {
                mediaType && (
                    <>
                        <div className='w-full min-h-96 relative'>
                   {mediaType === 'image' ? (
                        <Image src={image} fill alt="Post image" className='object-cover rounded-md' />
                    ) : (
                        <video controls className='object-cover rounded-md w-full h-full'>
                            <source src={image} type="video/mp4" />
                        </video>
                    )}
                </div>
                    </>
                )
            }
                <p className='text-sm font-medium'>{desc}</p>
            </div>
            <div className='flex items-center justify-between text-sm my-4'>
                <div className='flex gap-8'>
                    <div className='flex items-center gap-4 bg-slate-50 p-2 rounded-xl cursor-pointer'>
                        <Image onClick={handleShowLikeEmoji} src={isLiked ? "/liked.png" : "/like.png"} width={16} height={16} alt="Like" className='cursor-pointer' />
                        <span className='text-gray-300'>|</span>
                        <span className='text-gray-700'>{likesCount}<span className='hidden md:inline ml-1'>likes</span></span>
                    </div>  
                    <div className='flex items-center gap-4 bg-slate-50 p-2 rounded-xl cursor-pointer' onClick={handleShowAllComments}>
                        <Image src="/comment.png" width={16} height={16} alt="Comment" className='rounded-full cursor-pointer' />
                        <span className='text-gray-300'>|</span>
                        <span className='text-gray-700'>{commentsCount}<span className='hidden md:inline ml-1'>comments</span></span>
                    </div>
                </div>
                <div>
                    <div className='flex items-center gap-4 bg-slate-50 p-2 rounded-xl cursor-pointer'>
                        <Image src="/share.png" width={16} height={16} alt="Share" className='cursor-pointer' onClick={handleSharePost} />
                        <span className='text-gray-300'>|</span>
                        <span className='text-gray-700'>{sharesCount}<span className='hidden md:inline ml-1'>shares</span></span>
                    </div>
                </div>
                { isShowFormShared && (
                        <EditContent
                        open={isShowFormShared}
                        handleClose={handleModalClose}
                        content={desc}
                        commentId={postId}
                        isShowFormShared={'shared'}
                        imagePost={image}
                        dataShared={{ userId, postId, image, desc }}
                        />
                    )}
            </div>
                <UserComment 
                commentList={showAllComments ? commentList : commentList.slice(0, 1)}
                 avatarUser={avatarUser} postId={postId} userId={userId} idUserPost={idUserPost}/>
        </div>
    );
};

export default ListPost;
