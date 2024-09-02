"use client";
import React from 'react';
import { useUser } from '../../contextApi/UserContext';
import { useRouter } from "next/navigation";
const page = () => {
    const router = useRouter()
    const { user } = useUser();
    if (!user) return router.push("/login");
    return (
        <div className='container flex justify-center items-center h-screen bg-slate-200'>
            <h2 className='text-3xl'>Welcome! You are a subscribed user that's why you are able to view this page!</h2>
        </div>
        
    );
};

export default page;