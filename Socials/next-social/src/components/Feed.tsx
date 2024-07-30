"use client"
import React from 'react'
import ListPost from './ListPost'
import {User, Comment, Post} from '../config/interface'
type Props = {
  post: Post[]
  commentList: Comment[],
  avt: string,
  userId: number,
}

const Feed = ({userId, commentList,post, avt}: Props) => {
  if (!Array.isArray(post)) {
    return <div>No posts available</div>;
  }

  return (
    <div className=" flex flex-col gap-5">
      {
        post.map((postItem, index) => (
          <ListPost  commentList={commentList.filter(comment => comment.postId === postItem.id)}  postId={postItem.id} userId={userId}
          key={index} name={postItem.User.name} avt={postItem.User.avatar} image={postItem.img} desc={postItem.desc} avatarUser={avt} 
 />
        ))
      }
  </div>
  )
}

export default Feed