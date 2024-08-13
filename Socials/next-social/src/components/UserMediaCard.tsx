import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import StoryZoom from './StoryZoom'
import { useGlobalContext } from '@/app/globalContext'

type Props = {
  userId:string
  listImage: object
}

const UserMediaCard = ({userId, listImage}: Props) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleImageClick = (imageItem) => {
    setSelectedImage(imageItem);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      {/* TOP */}
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">User Media</span>
      </div>
      {/* BOTTOM */}
      <div className="flex gap-4 justify-start flex-wrap">
        {listImage?.map((item, index) => {
          return (
            <div onClick={() => handleImageClick(item)} key={index} className='relative w-1/5 h-24 cursor-pointer'>
              <Image   src={item.url} alt='' fill className='object-cover rounded-md' />
            </div>
          )
          
        })
        }
      </div>
      {selectedImage && (
          <StoryZoom
            image={selectedImage.url}
            open={modalOpen}
            handleClose={handleCloseModal}
          />
        )}
    </div>
  )
}

export default UserMediaCard