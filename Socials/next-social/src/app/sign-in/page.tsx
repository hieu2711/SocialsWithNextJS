'use client'
import { endpoints } from '@/config/api';
import axios from 'axios';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {};

const Page = (props: Props) => {
  const [phoneNum, setPhoneNum] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignin = async () => {
    try {
      const response = await axios.post(endpoints.login, {
        phone: phoneNum,
        password: password
      });
      const data = response.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('name',data.name);
      localStorage.setItem('avt',data.avt);
      localStorage.setItem('id',data.id);
      router.push('/');
    } catch (error) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      console.error('Đăng nhập thất bại:', error);
    }
  };

  return (
    <div className='bg-gray-100 h-screen flex items-center justify-center'>
      <div className='flex justify-center items-center'>
        <div className='w-1/2'>
          <h1 className='text-2xl font-bold mb-4 text-blue-600'>Social App</h1>
          <p>Connect with friends and the world around you on Social.</p>
        </div>
        <div className='w-1/2 bg-white rounded-md p-8 shadow-md'>
          <h1 className='text-center font-bold text-3xl my-3 mb-6 text-blue-600'>Social App</h1>
          {error && <p className='text-red-500 text-center mb-4'>{error}</p>}
          <div>
            <input
              type='text'
              className='w-full mb-4 p-2 border border-gray-300 rounded-md'
              placeholder='Phone number...'
              onChange={(e) => setPhoneNum(e.target.value)}
            />
            <input
              type='password'
              className='w-full p-2 border border-gray-300 rounded-md'
              placeholder='Password...'
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={handleSignin}
              type='button'
              className='w-full mt-4 bg-blue-500 text-white p-2 rounded-md'
            >
              Sign In
            </button>
            <div className='w-full h-[1px] bg-gray-400 bottom-2 mt-3'></div>
            <Link href="/sign-up">
              <button
                type='button'
                className='w-full mt-4 bg-green-400 text-white p-2 rounded-md'
              >
                Create a new account
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
