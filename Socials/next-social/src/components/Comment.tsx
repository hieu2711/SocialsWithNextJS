"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Comment as CommentType } from '../config/interface';
import DropdownEmoji from './Dropdown';
import axios from 'axios';
import { endpoints } from '@/config/api';
import { useGlobalContext } from '../app/globalContext';
import Link from 'next/link';
import Extension from './Extension';


type Props = {
    commentList: CommentType[];
    avatarUser: string;
    postId: number;
    userId: number;
    idUserPost: number;
};

const Comment = ({ commentList, avatarUser, postId, userId, idUserPost }: Props) => {
    const [desc, setDesc] = useState<string>('');
    const [isComment, setIsComment] = useState(false);
    const { reloadPage, fetchCounts } = useGlobalContext();
    const [likedComments, setLikedComments] = useState<{ [key: number]: boolean }>({});
    const [commentsLikesCount, setCommentsLikesCount] = useState<{ [key: number]: number }>({});
    const [hiddenComments, setHiddenComments] = useState<{ [key: number]: boolean }>({});

    const fetchCommentPost = async () => {
        try {
            const res = await axios.post(endpoints.createComment, {
                desc,
                postId,
                userId,
            });
            if (res.status === 201) {
                setIsComment(true);
                setDesc('');
            } else {
                setIsComment(false);
            }
        } catch (error) {
            console.error('Error creating comment:', error);
            setIsComment(false);
        }
    };

    const fetchLikeComment = async (commentId: number) => {
        try {
            const res = await axios.post(endpoints.toggleLikeComment, {
                userId: userId,
                postId: postId,
                commentId: commentId
            });

            if (res.status === 200) {
                // Check if comment is currently liked or not
                const isLiked = !likedComments[commentId];
                
                // Update the likes count based on the like status
                setCommentsLikesCount(prevCommentsLikesCount => ({
                    ...prevCommentsLikesCount,
                    [commentId]: isLiked 
                        ? (prevCommentsLikesCount[commentId] || 0) + 1
                        : (prevCommentsLikesCount[commentId] || 0) - 1
                }));

                // Update the likedComments state
                setLikedComments(prevLikedComments => ({
                    ...prevLikedComments,
                    [commentId]: isLiked
                }));
            }
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    const fetchLikesCount = async (postId: number, commentId: number) => {
        try {
            const res = await axios.get(endpoints.getCountLikeComment(postId, commentId));
            return res.data.likesCount;
        } catch (error) {
            console.error('Error fetching likes count:', error);
            return 0;
        }
    };

    useEffect(() => {
        const fetchIsLikedComment = async () => {
            const commentIdArray = commentList.map(cmt => cmt.id);
            try {
                const res = await axios.get(endpoints.checkUserLikeComment(userId, postId, commentIdArray.join(',')));
                if (res.data.likedCommentIds) {
                    const likedComments = {};
                    res.data.likedCommentIds.forEach(id => {
                        likedComments[id] = true;
                    });
                    setLikedComments(likedComments);
                }

                // Fetch and set likes count for each comment
                const likesCountPromises = commentList.map(async (comment) => {
                    const count = await fetchLikesCount(postId, comment.id);
                    return { commentId: comment.id, count };
                });

                const likesCounts = await Promise.all(likesCountPromises);
                const likesCountMap = likesCounts.reduce((acc, { commentId, count }) => {
                    acc[commentId] = count;
                    return acc;
                }, {});
                setCommentsLikesCount(likesCountMap);

            } catch (error) {
                console.log('ERR', error);
            }
        };
        fetchIsLikedComment();
    }, [commentList, userId, postId]);

    const handleComment = () => {
        if (desc === '') {
            alert('Nhập chữ để bình luận!');
        } else {
            fetchCommentPost();
        }
    };

    const handleEmojiSelect = (emoji: string) => {
        setDesc(prevDesc => prevDesc + emoji);
    };

    const handleHideComment = (commentId: number) => {
        setHiddenComments(prev => ({
            ...prev,
            [commentId]: true
        }));
    };
    return (
        <div>
            <div className='flex items-center gap-2'>
                <Image src={avatarUser} width={32} height={32} alt='' className='w-10 h-10 rounded-full' />
                <div className='flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full'>
                    <input
                        type='text'
                        placeholder='Write a comment...'
                        onChange={e => setDesc(e.target.value)}
                        value={desc}
                        className='bg-transparent outline-none flex-1'
                    />
                    <DropdownEmoji onEmojiSelect={handleEmojiSelect} />
                </div>
                <button onClick={handleComment} className='bg-blue-500 rounded-md p-[6px] px-3 text-white font-semibold'>
                    Send
                </button>
            </div>
            <div>
            {commentList.map((comment, index) => (
    !hiddenComments[comment.id] && (
        <div key={index} className='mt-4'>
            <div className='flex items-center gap-2 justify-between'>
                <Link href={`/profile/${comment.userId}`} className='flex items-center gap-2'>
                    <Image src={comment.User.avatar} width={40} height={40} alt='' className='w-10 h-10 rounded-full' />
                    <span className="font-medium">{comment.User.name}</span>
                </Link>
                <Extension commentId={comment.id} content={comment.desc} onHideComment={handleHideComment}
                 userId={userId} commentUserId={comment.User.id}  isShowFormShared={'comment'} />
            </div>
            <div className="flex flex-col gap-2 flex-1 mt-2">
                <p className='text-sm'>{comment.desc}</p>
                <div className="flex items-center gap-8 text-xs text-gray-500 mt-2">
                    <div className="flex items-center gap-4">
                        <Image onClick={() => fetchLikeComment(comment.id)}
                         src={likedComments[comment.id] ? "/liked.png" : "/like.png"} alt="" width={12} height={12} className="cursor-pointer w-4 h-4" />
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-500">{commentsLikesCount[comment.id] || 0} Likes</span>
                    </div>
                </div>
            </div>
            <p className='border-b-1 bg-gray-100 w-full h-[0.5px] my-3'></p>
        </div>
    )
))}

            </div>
        </div>
    );
};

export default Comment;
