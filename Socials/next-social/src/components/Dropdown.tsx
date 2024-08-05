
import React, { useState } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import Image from 'next/image';

type DropdownProps = {
    onEmojiSelect: (emoji: string) => void;
};

export default function DropdownEmoji({ onEmojiSelect }: DropdownProps) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        onEmojiSelect(emojiData.emoji);
        setShowEmojiPicker(false);
    };

    return (
        <div>
            <Image
                src="/emoji.png"
                alt="Emoji Picker"
                width={20}
                height={20}
                className="cursor-pointer"
                onClick={toggleEmojiPicker}
            />
            {showEmojiPicker && (
                <div className="absolute mt-2 z-10">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
            )}
        </div>
    );
}
