import React from 'react';
import { Button } from '../ui/button';
import { HandMetal } from 'lucide-react';
import Link from 'next/link';

const Subscribe = () => {
  return (
<div className="container bg-gradient-custom py-20 flex flex-col gap-6 items-center justify-center rounded-3xl mb-20">
  <h1 className="text-white text-4xl font-bold uppercase">SUBSCRIBE FOR PREMIUM CONTENT</h1>
  <Button className="text-lg" size='lg' asChild><Link href="/pricing">SUBSCRIBE <HandMetal width={18} height={18} className='ml-1'/></Link></Button>
</div>
  );
};

export default Subscribe;