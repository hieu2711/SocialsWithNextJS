"use client";
import { endpoints } from '@/config/api';
import axios from 'axios';
import React, { createContext, useState, useContext, useEffect } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [story, setStory] = useState([]);
    const [post, setPost] = useState([]);
    const [comment, setComment] = useState([]);
    const [name, setName] = useState<string>();
    const [avatar, setAvt] = useState<string>();
    const [id, setId] = useState<number>();
    const [like, setLike] = useState(0);
    const [cmt, setCmt] = useState(0);
    const [shared, setShared] = useState(0);
   

    const fetchApiStory = async () => {
        try {
            const { data } = await axios.get(endpoints.getAllStory);
            setStory(data || []);

            const res = await axios.get(endpoints.getAllPost);
            setPost(res.data || []);

            const resComment = await axios.get(endpoints.getAllComment);
            setComment(resComment.data || []);

            const likeRes = await axios.get(endpoints.getCountLike(2));
            const { likesCount } = likeRes.data;
            setLike(likesCount);

            const cmtRes = await axios.get(endpoints.getCountComment(2));
            const { commentsCount } = cmtRes.data;
            setCmt(commentsCount);

            const sharedRes = await axios.get(endpoints.getCountShared(3));
            const { shareCount } = sharedRes.data;
            setShared(shareCount);
        } catch (error) {
            console.log('Error' + error);
        }
    };
    const reloadPage = (postId: number) =>{
        fetchApiStory();
        fetchCounts(postId, id);
    }

    useEffect(() => {
        const getAvt = localStorage.getItem('avt');
        const getID = localStorage.getItem('id');
        const getName = localStorage.getItem('name');
        setAvt(getAvt || '');
        setId(getID);
        setName(getName || '');
        fetchApiStory();
    }, []);

    

   

    const fetchCounts = async (postId: number, userId: number) => {
        try {
            const likeRes = await axios.get(endpoints.getCountLike(postId));
            setLike(likeRes.data.likesCount);

            const cmtRes = await axios.get(endpoints.getCountComment(postId));
            setCmt(cmtRes.data.commentsCount);

            const sharedRes = await axios.get(endpoints.getCountShared(postId));
            setShared(sharedRes.data.shareCount);

            const checkIsLiked = await axios.get(endpoints.checkUserLike(userId, postId));
            setLike(checkIsLiked.data.isLiked ? 1 : 0);
        } catch (error) {
            console.error('Error fetching counts:', error);
        }
    };

    return (
        <GlobalContext.Provider
            value={{
                story,
                setStory,
                post,
                setPost,
                comment,
                setComment,
                fetchApiStory,
                name,
                setName,
                avatar,
                setAvt,
                id,
                setId,
                like,
                setLike,
                cmt,
                setCmt,
                shared,
                setShared,
                reloadPage,
                fetchCounts,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);
