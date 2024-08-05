import axios from 'axios';
export const SERVER = 'http://localhost:3001';

export const endpoints = {
    register: `${SERVER}/api/users/register`,
    login: `${SERVER}/api/users/login`,
    updateUser:  (userId: number) => `${SERVER}/api/users/update/${userId}`,
    deleteUser:(userId: number)  => `${SERVER}/api/users/delete/${userId}`,
    toggleFollowRequest: (userId: number) => `${SERVER}/api/followRequests/toggleFollowRequest/${userId}`,
    switchFollow: (userId: number) => `${SERVER}/api/followers/switchFollow/${userId}`,
    toggleBlock: (userId: number) => `${SERVER}/api/blocks/toggleBlock/${userId}`,
    getAllStory: `${SERVER}/api/stories/getAll`,
    createStory: `${SERVER}/api/stories/create`,
    deleteStory:(storyId: number) => `${SERVER}/api/stories/delete/${storyId}`,
    getAllPost: `${SERVER}/api/posts/getAll`,
    createPost: `${SERVER}/api/posts/create`,
    deletePost:(postId: number) => `${SERVER}/api/posts/delete/${postId}`,
    updatePost: (postId: number) => `${SERVER}/api/posts/update/${postId}`,
    toggleLike: `${SERVER}/api/posts/toggleLike`,
    toggleLikeComment: `${SERVER}/api/posts/toggleLikeComment`,
    checkUserLike: (userId: number, postId: number) => `${SERVER}/api/posts/check?userId=${userId}&postId=${postId}`,
    checkUserLikeComment: (userId: number, postId: number, commentId: number) => `${SERVER}/api/posts/checkLikedComment?userId=${userId}&postId=${postId}&commentId=${commentId}`,
    getCountLike: (postId: number) => `${SERVER}/api/posts/likesCount/${postId}`,
    getCountLikeComment: (postId: number, commentId: number) => `${SERVER}/api/posts/likesCountComment?postId=${postId}&commentId=${commentId}`,
    getCountComment: (postId: number) => `${SERVER}/api/posts/commentsCount/${postId}`,
    getCountShared: (postId: number) => `${SERVER}/api/shared/count/${postId}`,
    shared: `${SERVER}/api/shared/create`,
    getAllComment: `${SERVER}/api/comments/getAll`,
    createComment: `${SERVER}/api/comments/create`,
    deleteComment:(commentId: number) => `${SERVER}/api/comments/delete/${commentId}`,
    updateComment: (commentId: number) => `${SERVER}/api/comments/update/${commentId}`,
};

export const authApi = () => {
    const token = localStorage.getItem('token');
    const instance = axios.create({
        baseURL: SERVER,
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
        },
    });
    return instance;
};

export default axios.create({
    baseURL: SERVER,
});
