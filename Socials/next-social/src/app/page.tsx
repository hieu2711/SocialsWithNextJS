// pages/homepage.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AddPost from "@/components/AddPost";
import Feed from "@/components/Feed";
import LeftMenu from "@/components/LeftMenu";
import RightMenu from "@/components/RightMenu";
import Stories from "@/components/Stories";
import axios from 'axios';
import { endpoints } from '@/config/api';

const Homepage = () => {
  const router = useRouter();
  const [story, setStory] = useState()
  const [post, setPost] = useState()
  const [comment, setComment] = useState()
  const [name, setName] = useState<string>()
  const [avatar, setAvt] = useState<string>()
  const [id, setId] = useState<number>()
  const [like, setLike] = useState(0)
  const [cmt, setCmt] = useState(0)
  const [shared, setShared] = useState(0)
  const fetchApiStory = async () =>{
    try {
      const  {data}  = await axios.get(endpoints.getAllStory);
      setStory(data || [])

      const res = await axios.get(endpoints.getAllPost)
      setPost(res.data || [])

      const resComment = await axios.get(endpoints.getAllComment)
      setComment(resComment.data || [])

      const likeRes = await axios.get(endpoints.getCountLike(2));
      const {likesCount} = likeRes.data;
      setLike(likesCount)

      const cmtRes = await axios.get(endpoints.getCountComment(2));
      const {commentsCount} = cmtRes.data;
      setCmt(commentsCount)

      const sharedRes = await axios.get(endpoints.getCountShared(3));
      const {shareCount} = sharedRes.data;
      setShared(shareCount)
     
    } catch (error) {
      console.log('Error' + error)
    }
  }
  const handleStoryUpload = () => {
    fetchApiStory();
  }

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/sign-in'); 
      }
    };

    checkAuthentication();
  }, [router]);

  useEffect(() =>{
  const getAvt = localStorage.getItem('avt');
  const getID = localStorage.getItem('id');
  const getName = localStorage.getItem('name');
  setAvt(getAvt || '');
  setId(getID);
  setName(getName || '')
    fetchApiStory()
  },[])
  return (
    <div className='flex gap-6 pt-6'>
      <div className="hidden xl:block w-[20%]"><LeftMenu type="home"/></div>
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="flex flex-col gap-6 ">
          <Stories userId={id || 1} name={name || ''} avatar={avatar || ''} story={story || []}  onStoryUpload={handleStoryUpload} />
          <AddPost />
          <Feed commentList={comment || []} post={post || []} avt={avatar || ''} userId={id || 1} onStoryUpload={handleStoryUpload}/>
        </div>
      </div>
      <div className="hidden lg:block w-[30%]"><RightMenu type="home" userId="test" /></div>
    </div>
  );
}

export default Homepage;
