// interfaces.ts

export interface User {
    id: number;
    phone: string;
    password: string;
    avatar: string;
    name: string;
    description: string;
    city: string;
    school: string;
    work: string;
    website: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Post {
    id: number;
    createdAt: string;
    expiresAt: string;
    img: string;
    desc: string;
    updatedAt: string;
    userId: number;
    User: User;
  }
  
  export interface Comment {
    id: number;
    createdAt: string;
    expiresAt: string;
    desc: string;
    updatedAt: string;
    userId: number;
    postId: number;
    User: User;
  }

 export interface Story {
    id: number;
    createdAt: string;
    expiresAt: string;
    img: string;
    updatedAt: string;
    userId: number;
    User: User;
  }