import React from 'react';
import ListPost from './ListPost';
import { useGlobalContext } from '../app/globalContext';
import { Comment, Post } from '../config/interface';

const Feed = ({ listPost }) => {
    const { post, comment, setPost, avatar, id, name } = useGlobalContext();
    
    const postsToDisplay = listPost || post;
    
    if (!Array.isArray(postsToDisplay)) {
        return <div>No posts available</div>;
    }

    const handleHidePost = (postId: number) => {
        setPost((prevPosts) => prevPosts.filter((postItem) => postItem.id !== postId));
    };

    const getMediaType = (url) => {
        if (url) {
            const extension = url.split('.').pop().toLowerCase();
            const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
            const videoExtensions = ['mp4', 'webm', 'ogg'];
            
            if (imageExtensions.includes(extension)) {
                return 'image';
            }
            
            if (videoExtensions.includes(extension)) {
                return 'video';
            }
            
            return 'image';
        }
    };

    return (
        <div className="flex flex-col gap-5">
            {postsToDisplay.map((postItem) => (
                <ListPost
                    key={postItem.id}
                    commentList={comment.filter(comment => comment.postId === postItem.id)}
                    postId={postItem.postId ? postItem.postId :  postItem.id}
                    name={postItem.User.name}
                    avt={postItem.User.avatar}
                    image={postItem.img }
                    desc={postItem.desc}
                    avatarUser={avatar || ''}
                    userId={id || 0}
                    idUserPost={postItem.userId}
                    onHidePost={handleHidePost}
                    mediaType={getMediaType(postItem.img)}
                />
            ))}
        </div>
    );
};

export default Feed;
