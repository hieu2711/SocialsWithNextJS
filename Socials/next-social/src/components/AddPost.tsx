"use client"
import Image from 'next/image'
import React, { useRef, useState } from 'react'
import DropdownEmoji from './Dropdown'
import { useGlobalContext } from '@/app/globalContext'
import { CldUploadWidget } from 'next-cloudinary';
import { endpoints } from '@/config/api'
import axios from 'axios'
type Props = {}

const AddPost = (props: Props) => {
  const { avatar, id, fetchApiStory} = useGlobalContext()
  const [desc, setDesc] = useState<string>('');
  const [uploadedMedia, setUploadedMedia] = useState<string | null>(null);
  const uploadWidgetRef = useRef(null);

  const handleEmojiSelect = (emoji: string) => {
    setDesc(prevDesc => prevDesc + emoji);
  };

  const handleUploadImage = async (result) => {
    const uploadedUrl = result.info.secure_url;
    setUploadedMedia(uploadedUrl);
  };

  const handleCreatePost = async () =>{
    try {
      const res =  await axios.post(endpoints.createPost, {
        img: uploadedMedia,
        userId: id,
        desc: desc
      });
      setDesc('');
      setUploadedMedia(null);
      fetchApiStory();
      console.log(res);
    } catch (error) {
      console.error('Error create post:', error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
      {/* AVATAR */}
      <Image
        src={avatar}
        alt=""
        width={48}
        height={48}
        className="w-12 h-12 object-cover rounded-full"
      />
      {/* POST */}
      <div className="flex-1">
        {/* TEXT INPUT */}
        <form className="flex gap-4">
          <textarea
            placeholder="What's on your mind?"
            className="flex-1 bg-slate-100 rounded-lg p-2"
            name="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
          <div className="">
            <DropdownEmoji onEmojiSelect={handleEmojiSelect} />
          </div>
        </form>
        {/* POST OPTIONS */}
        <div className='flex justify-between mt-3'>
          <div className="flex items-center gap-4 text-gray-400 flex-wrap">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => uploadWidgetRef.current?.open()}>
              <Image src="/addimage.png" alt="" width={20} height={20} />
              Photo
            </div>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => uploadWidgetRef.current?.open()}>
              <Image src="/addVideo.png" alt="" width={20} height={20} />
              Video
            </div>
          </div>
          <button onClick={handleCreatePost} className='bg-blue-500 py-2 px-3 rounded-lg'>Send</button>
        </div>
        {/* PREVIEW */}
        {uploadedMedia && (
          <div className="mt-4">
            {uploadedMedia.match(/\.(jpeg|jpg|gif|png)$/) ? (
              <div className=''>
                <img src={uploadedMedia} alt="Uploaded" className=" w-full h-[250px] object-contain rounded-md" />
              </div>
            ) : (
              <video controls className="w-full h-auto object-cover rounded-md">
                <source src={uploadedMedia} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        )}
      </div>
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
        onUpload={handleUploadImage}
        ref={uploadWidgetRef}
      >
        {({ open }) => {
          uploadWidgetRef.current = { open };
          return null; // The widget is hidden
        }}
      </CldUploadWidget>
    </div>
  )
}

export default AddPost
