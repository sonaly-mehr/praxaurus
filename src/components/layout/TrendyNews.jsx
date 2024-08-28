import React from "react";
import { News } from "../../constants/index";
import Image from "next/image";

const Banner = () => {
  return (
    <div className="container mx-auto my-16">
      <h3 className="font-bold text-3xl mb-6">Trendy News</h3>

      <div className="grid grid-col-1 lg:grid-cols-2 gap-8">
        {News?.map((news, index) => (
          <div className="flex gap-4" key={index}>
            <div>
              <Image src={news?.img} alt="" width={250} height={400} className="w-[400px] h-full"/>
            </div>
            <div className="flex flex-col gap-4">
              <span className="bg-blue-500 text-[11px] lg:text-xs uppercase font-medium w-fit text-white px-3 py-1 inline-block">
                {news?.tag}
              </span>
              <h4 className="text-black text-base lg:text-2xl font-semibold">
                {news?.title}
              </h4>
              <div className="flex gap-5 items-center">
                <span className="text-gray-500 text-[15px]">{news?.author}</span>
                <span className="text-gray-500 text-[15px]">{news?.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banner;
