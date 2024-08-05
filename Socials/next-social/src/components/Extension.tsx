import Image from 'next/image';
import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditContent from './EditContent';
import axios from 'axios';
import { endpoints } from '@/config/api';
import { useGlobalContext } from '../app/globalContext';

type Props = {
    userId: number,
    commentUserId: number,
    content: string
    commentId: number
    onHideComment: (commentId: number) => void;
    image: string,
    desc: string,
    isShowFormShared:string;
    onHidePost: () => void;
    isPost: boolean
}

const Extension = ({ userId, commentUserId, content, commentId, onHideComment, image, desc, isShowFormShared, isPost, onHidePost}: Props) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [isShow, setIsShow] = useState(false);
    const { fetchApiStory} = useGlobalContext();

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEditClick = () => {
        setIsShow(true);
        handleClose();
    };

    const handleModalClose = () => {
        setIsShow(false);
    };

    
  const handleHideComment = () =>{
    onHideComment(commentId);
    handleClose();
}

const handleHidePost = () => {
    onHidePost(); 
    handleClose();
};
    return (
        <div>
            <div
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <Image src="/more.png" alt='' width={16} height={16} className='cursor-pointer w-4 h-4' />
            </div>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {parseInt(userId.toString()) === parseInt(commentUserId.toString()) ? (
                    <>
                        {isPost ? (
                            <MenuItem onClick={handleHidePost}>Ẩn bài viết</MenuItem>
                        ) : (
                            <>
                            <MenuItem onClick={handleEditClick}>Chỉnh sửa</MenuItem>
                            <MenuItem onClick={handleHideComment}>Ẩn comment</MenuItem>
                            </>
                        )
                        }
                    </>
                ) : (
                    <>
                    {isPost ? (
                        <MenuItem onClick={handleHidePost}>Ẩn bài viết</MenuItem>
                    ) : (
                        <MenuItem onClick={handleHideComment}>Ẩn comment</MenuItem>
                    )
                    }
                    </>
                )}
            </Menu>
            {isShow && (
                <EditContent
                    open={isShow}
                    handleClose={handleModalClose}
                    content={content}
                    commentId={commentId}
                    dataShared={''}
                    imagePost={image}
                    descPost={desc}
                    isShowFormShared={isShowFormShared}
                />
            )}
        </div>
    );
}

export default Extension;
