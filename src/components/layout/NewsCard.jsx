import React from "react";
import { News } from "../../constants";

const NewsCard = () => {
  return (
    <div className="container mx-auto mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {News?.slice(0, 3).map((news, index) => (
          <div
            className="bg-cover bg-no-repeat relative h-[300px] lg:h-[500px] gradient-layer"
            key={index}
            style={{ backgroundImage: `url(${news?.img})` }}
          >
            <div className="flex flex-col gap-2 h-full justify-end pl-5 pb-5 relative z-[1] cursor-pointer">
              <span className="bg-blue-500 text-[11px] lg:text-xs uppercase font-medium w-fit text-white px-3 py-1 inline-block">
                {news?.tag}
              </span>
              <h4 className="text-white text-lg lg:text-2xl font-semibold">
                {news?.title}
              </h4>
              <span className="text-white/50 text-sm">{news?.author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsCard;
