import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { useGlobalContext } from '../app/globalContext';
import axios from 'axios';
import { authApi, endpoints } from '@/config/api';

type Props = {
    open: boolean;
    handleClose: () => void;
    content: string;
    commentId: number;
    isShowFormShared: "comment" | "shared" | 'post';
    imagePost:string;
    dataShared: {
        userId: number;
        postId: number;
        image: string;
        desc: string;
    };
    descPost: string,
};

const EditContent = ({ open, handleClose, content, commentId, isShowFormShared, imagePost, dataShared, descPost }: Props) => {
    const { avatar, name, fetchApiStory, reloadPage, id} = useGlobalContext();
    const [contentState, setContentState] = useState(content);
    const [descShared, setDescShared] = useState('');
    const [descUpdate, setDescUpdate] = useState(descPost);


    useEffect(() => {
        setContentState(content);
    }, [content]);

    const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContentState(event.target.value);
    };

    
    const handleContentChangeUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescUpdate(event.target.value);
    };

    const fetchUpdateComment = async () => {
        const res = await axios.put(endpoints.updateComment(commentId), {
            desc: contentState
        });
    };

    const handleUpdateComment = () => {
        fetchUpdateComment();
        handleClose();
        fetchApiStory();
    };

    const fetchShared = async () =>{
        const { userId, postId, image, desc } = dataShared;
        const isShared = await axios.post(endpoints.shared,{
            userId: userId,
            postId: postId,
            image: image,
            description: desc,
            descShared: descShared
        })
    }  

    const handleSharePost = () =>{
        fetchShared();
         handleClose();
    }

    const fetchUpdatePost = async () => {
        try {
            const isUpdate = await axios.put(endpoints.updatePost(commentId), {
                image: imagePost,
                desc: descUpdate,
                userId: id,
            });
            fetchApiStory();
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdatePost = () =>{
        fetchUpdatePost();
         handleClose();
    }
    console.log(id)
    return (
        <>
            {isShowFormShared === 'comment' && (
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="comment-modal-title"
                    aria-describedby="comment-modal-description"
                >
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                        <div className='flex justify-between items-center'>
                            <div className='flex items-center gap-4'>
                                <Image src={avatar} alt='' width={30} height={30} className='rounded-2xl' />
                                <Typography id="comment-modal-title" variant="h6" component="h2">
                                    {name}
                                </Typography>
                            </div>
                            <div className='bg-green-600 w-[10px] h-[10px] rounded-full '></div>
                        </div>
                        <textarea
                            value={contentState}
                            onChange={handleContentChange}
                            className='border-gray-200 border w-full mt-2 rounded-lg'
                        />
                        <button onClick={handleUpdateComment} className='bg-green-500 p-2 rounded-lg text-white'>Cập nhật</button>
                    </Box>
                </Modal>
            )}
            {isShowFormShared === 'shared' && (
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="shared-modal-title"
                    aria-describedby="shared-modal-description"
                >
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 1000, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                        <div className='flex justify-between items-center'>
                            <div className='flex items-center gap-4'>
                                <Image src={avatar} alt='' width={30} height={30} className='rounded-2xl' />
                                <Typography id="shared-modal-title" variant="h6" component="h2">
                                    {name}
                                </Typography>
                            </div>
                            <div className='bg-green-600 w-[10px] h-[10px] rounded-full '></div>
                        </div>
                        <input placeholder='Nhập nội dung mô tả...' className='w-full mt-3 border border-gray-200'
                        onChange={(e) => setDescShared(e.target.value)} />
                        <div className='w-full min-h-96 relative mb-4'>
                            <Image src={imagePost} fill alt="Post image" className='object-cover rounded-md my-4' />
                        </div>
                        <p >{content}</p>
                        <button  onClick={handleSharePost} className='bg-blue-500 p-2 rounded-lg text-white'>Chia sẻ</button>
                    </Box>
                </Modal>
            )}

                {isShowFormShared === 'post' && (
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="shared-modal-title"
                    aria-describedby="shared-modal-description"
                >
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 1000, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                        <div className='flex justify-between items-center'>
                            <div className='flex items-center gap-4'>
                                <Image src={avatar} alt='' width={30} height={30} className='rounded-2xl' />
                                <Typography id="shared-modal-title" variant="h6" component="h2">
                                    {name}
                                </Typography>
                            </div>
                            <div className='bg-green-600 w-[10px] h-[10px] rounded-full '></div>
                        </div>
                        <div className='w-full min-h-96 relative mb-4'>
                            <Image src={imagePost} fill alt="Post image" className='object-cover rounded-md my-4' />
                        </div>
                        <input  className='w-full mt-3 border border-gray-200'
                          value={descUpdate}
                          onChange={handleContentChangeUpdate}/>
                        <button  onClick={handleUpdatePost} className='bg-blue-500 p-2 rounded-lg text-white'>Cập nhật</button>
                    </Box>
                </Modal>
            )}
        </>
    );
};

export default EditContent;
