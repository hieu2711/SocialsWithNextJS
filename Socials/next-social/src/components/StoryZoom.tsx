import React, { useState, useRef, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Image from 'next/image';

type Props = {
    username: string;
    image: string;
    open: boolean;
    handleClose: () => void;
};

const StoryZoom = ({ username, image, open, handleClose }: Props) => {
    const [progress, setProgress] = useState(100);
    const progressBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open) {
            const totalTime = 15 * 1000; // 30 seconds
            const intervalTime = 100; // Update every 100ms
            const progressStep = intervalTime / totalTime * 100;
            
            const interval = setInterval(() => {
                setProgress(prev => {
                    const newProgress = Math.max(prev - progressStep, 0);
                    if (newProgress === 0) {
                        clearInterval(interval);
                        handleClose(); // Close modal when progress reaches 0
                    }
                    return newProgress;
                });
            }, intervalTime);

            // Cleanup interval on unmount
            return () => clearInterval(interval);
        }
    }, [open, handleClose]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                <Typography id="simple-modal-title" variant="h6" component="h2" className='text-center'>
                    {username}
                </Typography>
                <Typography id="simple-modal-description" sx={{ mt: 2 }} className='w-full mx-auto flex flex-col items-center'>
                    <Image src={image} alt="Story Image" width={400} height={300} className='w-80% h-80%' />
                    <div className='relative w-full mt-2'>
                        <div 
                            ref={progressBarRef}
                            className='absolute bottom-0 left-0 h-1 bg-gray-200 w-full'
                        >
                            <div 
                                style={{ width: `${progress}%`, height: '100%', backgroundColor: 'blue' }}
                                className='transition-all duration-100'
                            />
                        </div>
                    </div>
                </Typography>

            </Box>
        </Modal>
    );
};

export default StoryZoom;
