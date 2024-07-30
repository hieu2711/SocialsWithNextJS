import * as React from 'react';
import EmojiPicker from 'emoji-picker-react';
import Image from 'next/image';
export default function Dropdown() {
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };
  return (
    <div>
      <Image 
        src={"/emoji.png"} 
        alt="" 
        width={20} 
        height={20} 
        className="cursor-pointer"
        onClick={toggleEmojiPicker} 
      />
      {showEmojiPicker && (
        <div className="absolute mt-2 z-10">
          <EmojiPicker />
        </div>
      )}
    </div>
  );
}
