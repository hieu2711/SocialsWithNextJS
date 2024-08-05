'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import MobileMenu from './MobileMenu'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {jwtDecode} from "jwt-decode";
import { useGlobalContext } from '@/app/globalContext'

type Props = {}

const Navbar = (props: Props) => {
    const router = useRouter();
    const [avt, setAvt] = useState<string>('');
    const [name, setName] = useState<string>('');
    const { id } = useGlobalContext();

    useEffect(() => {
        const name = localStorage.getItem('name');
        setName(name || '')
        const avt = localStorage.getItem('avt');
        setAvt(avt || '')
    }, [name]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('avt');
        setAvt('');
        setName('');
        router.push('/sign-in');
    };
    return (
        <div className='flex items-center justify-between h-24'>
            <div className='md:hidden lg:block w-[20%]'>
                <Link href={"/"} className='font-bold text-xl text-blue-500'>
                    Social App
                </Link>
            </div>
            <div className='hidden md:flex w-[50%] text-sm items-center justify-between'>
                <div className='flex gap-6 text-gray-600'>
                    <Link href={"/"} className='flex gap-2 items-center'>
                        <Image src="/home.png" alt="homepage" width={16} height={16} className='w-4 h-4'/>
                        <span>Homepage</span>
                    </Link>
                    <Link href={"/"} className='flex gap-2 items-center'>
                        <Image src="/friends.png" alt="friends" width={16} height={16} className='w-4 h-4'/>
                        <span>Friends</span>
                    </Link>
                    <Link href={"/"} className='flex gap-2 items-center'>
                        <Image src="/stories.png" alt="stories" width={16} height={16} className='w-4 h-4'/>
                        <span>Stories</span>
                    </Link>
                </div>
                <div className='hidden xl:flex p-2 bg-slate-100 items-center rounded-lg'>
                    <input type='text' placeholder='search...' className='bg-transparent outline-none' />
                    <Image src={"/search.png"} alt='search' width={14} height={14} />
                </div>
            </div>
            <div className='w-[30%] flex items-center gap-4 xl:gap-4 justify-end'>
                {name !== '' &&
                    <div className='hidden sm:flex items-center gap-4'>
                        <Link href={`/profile/${id}`} className='cursor-pointer flex items-center'>
                        <Image src={avt} 
                        alt='avt' width={32} height={32} className='rounded-full w-8 h-8 mr-2'/>
                        <p className='font-semibold'>{name}</p>
                        </Link>
                        <p onClick={handleLogout} className='cursor-pointer'>Log out</p>
                    </div>
                }
                <MobileMenu />
            </div>
        </div>
    );
}

export default Navbar;
