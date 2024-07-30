import Image from 'next/image'
import React, { useState } from 'react'
import {Comment as CommentType} from '../config/interface'
import DropdownEmoji from './Dropdown';
import axios from 'axios';
import { endpoints } from '@/config/api';
type Props = {
    commentList: CommentType[],
    avatarUser: string,
    postId:number,
    userId:number,
}

const Comment = ({commentList, avatarUser, postId, userId}: Props) => {
  const [desc, setDesc] = useState<string>('');
  const [isComment, setIsComment] = useState(false)
  const fetchCommentPost = async () =>{
    const res = await axios.post(endpoints.createComment,{
        desc: desc,
        postId:postId,
        userId:userId,
    })

    if(res.status === 201){
        setIsComment(true)
        onCommentSuccess()
    }else{
        setIsComment(false)
        }
    }
  const handleComment = () =>{
    if(desc === ''){
        alert('Nhập chữ để bình luận!');
    }else{
        fetchCommentPost()
    }
    }
  return (
    <div>
        <div className='flex items-center gap-2 '>
            <Image src={avatarUser}
             width={32} height={32} alt='' className='w-10 h-10 rounded-full'/>
            <div className='flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full '>
                <input type='text' placeholder='Write a comment...' onChange={e => setDesc(e.target.value)}
                className='bg-transparent outline-none flex-1' />
                <DropdownEmoji />
            </div>
            <button onClick={handleComment} className='bg-blue-500 rounded-md p-[6px] px-3 text-white font-semibold'>Send</button>
        </div>
        <div>
        {commentList.map((comment, index) => (
          <div key={index} className='mt-4'>
            <div className='flex items-center gap-2 justify-between'>
              <div className='flex items-center gap-2'>
                <Image src={comment.User.avatar}
                  width={40} height={40} alt='' className='w-10 h-10 rounded-full' />
                <span className="font-medium">{comment.User.name}</span>
              </div>
              <Image src="/more.png" alt='' width={16} height={16} className='cursor-pointer w-4 h-4' />
            </div>
            <div className="flex flex-col gap-2 flex-1 mt-2">
              <p className='text-sm'>{comment.desc}</p>
              <div className="flex items-center gap-8 text-xs text-gray-500 mt-2">
                <div className="flex items-center gap-4">
                  <Image
                    src="/like.png"
                    alt=""
                    width={12}
                    height={12}
                    className="cursor-pointer w-4 h-4"
                  />
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500">0 Likes</span>
                </div>
                <div className="cursor-pointer">Reply</div>
              </div>
            </div>
            <p className='border-b-1 bg-gray-100 w-full h-[0.5px] my-3'></p>
          </div>
          
        ))}

        </div>
    </div>
  )
}

export default Comment