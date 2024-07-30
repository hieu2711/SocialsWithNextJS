import axios from 'axios';
export const SERVER = 'http://localhost:3001';

export const endpoints = {
    register: `${SERVER}/api/users/register`,
    login: `${SERVER}/api/users/login`,
    updateUser: `${SERVER}/api/users/update`,
    deleteUser: `${SERVER}/api/users/delete`,
    toggleFollowRequest: (userId: number) => `${SERVER}/api/followRequests/toggleFollowRequest/${userId}`,
    switchFollow: (userId: number) => `${SERVER}/api/followers/switchFollow/${userId}`,
    toggleBlock: (userId: number) => `${SERVER}/api/blocks/toggleBlock/${userId}`,
    getAllStory: `${SERVER}/api/stories/getAll`,
    createStory: `${SERVER}/api/stories/create`,
    deleteStory: `${SERVER}/api/stories/delete`,
    getAllPost: `${SERVER}/api/posts/getAll`,
    createPost: `${SERVER}/api/posts/create`,
    deletePost: `${SERVER}/api/posts/delete`,
    updatePost: `${SERVER}/api/posts/update`,
    toggleLike: `${SERVER}/api/posts/toggleLike`,
    getCountLike: (postId: number) => `${SERVER}/api/posts/likesCount/${postId}`,
    getCountComment: (postId: number) => `${SERVER}/api/posts/commentsCount/${postId}`,
    getCountShared: (postId: number) => `${SERVER}/api/shared/count/${postId}`,
    shared: `${SERVER}/api/shared/create`,
    getAllComment: `${SERVER}/api/comments/getAll`,
    createComment: `${SERVER}/api/comments/create`,
    deleteComment: `${SERVER}/api/comments/delete`,
    updateComment: `${SERVER}/api/comments/update`,
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
