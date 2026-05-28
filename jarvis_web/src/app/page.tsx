"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


const page = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('/jarvis');
  }, []);
  return (
    <div>page</div>
  )
}

export default page