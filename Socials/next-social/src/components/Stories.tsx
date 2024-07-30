import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { CldUploadWidget } from 'next-cloudinary';
import axios from 'axios';
import { endpoints } from '@/config/api';
import StoryZoom from './StoryZoom';
import {User, Story} from '../config/interface'

type Props = {
  story: Story[];
  avatar: string;
  userId: number;
  name: string;
  onStoryUpload: () => void;
}

const Stories = ({ userId, avatar, name, story, onStoryUpload }: Props) => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const uploadWidgetRef = useRef<any>(null);

  const handleUploadStory = async (result: any) => {
    console.log('Upload result:', result.info.secure_url);
    try {
      await axios.post(endpoints.createStory, {
        img: result.info.secure_url,
        userId: userId
      });
      onStoryUpload();
    } catch (error) {
      console.error('Error uploading story:', error);
    }
  }

  const handleStoryClick = (storyItem: Story) => {
    setSelectedStory(storyItem);
    setModalOpen(true);
  }

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedStory(null);
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md overflow-x-auto text-xs">
      <div className="flex gap-3 w-max">
        <div className='relative flex flex-col items-center gap-2 cursor-pointer'
          onClick={() => uploadWidgetRef.current?.open()}>
          <Image
            src={avatar}
            alt={`Story by`}
            width={150}
            height={250}
            className="rounded-lg w-[150px] h-[250px]"
          />
          <span className='font-semibold'>{name}</span>
          <div className='bg-white p-1 rounded-full absolute bottom-5 left-1/2 transform -translate-x-1/2'>
            <div className='bg-blue-500 rounded-full px-[6px]'>
              <p className='text-2xl text-white'>+</p>
            </div>
          </div>
        </div>
        {story.map((storyItem) => (
          <div key={storyItem.id} className='relative flex flex-col items-center gap-2 cursor-pointer' onClick={() => handleStoryClick(storyItem)}>
            <Image
              src={storyItem.img}
              alt={`Story by ${storyItem.User.name}`}
              width={150}
              height={250}
              className="rounded-lg w-[150px] h-[250px]"
            />
            <span className='font-semibold'>{storyItem.User.name}</span>
          </div>
        ))}
      </div>

      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
        onUpload={handleUploadStory}
        ref={uploadWidgetRef}
      >
        {({ open }) => {
          uploadWidgetRef.current = { open };
          return null; // The widget is hidden
        }}
      </CldUploadWidget>

      {selectedStory && (
        <StoryZoom
          username={selectedStory.User.name}
          image={selectedStory.img}
          open={modalOpen}
          handleClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default Stories;
