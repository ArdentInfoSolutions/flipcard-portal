import Link from "next/link";
import Image from "next/image";
import { MdFavoriteBorder } from "react-icons/md";
import { FaLink } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa";
import { FaShareAlt } from "react-icons/fa";
import Carousel from "./Carousel";

interface WebItemProps {
  item: {
    id: string;
    userLogo: string;
    userName: string;
    title: string;
    description: string;
    url: string;
    likes: number;
    isLiked: boolean;
    isBookmarked: boolean;
  };
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
}

export default function WebItem({ item, onLike, onBookmark }: WebItemProps) {
  return (
    
    <div className=" bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-52 bg-slate-200 rounded-t-lg overflow-hidden">
        <Carousel />
        {/* <Image
          src={item.userLogo || "/placeholder.svg"}
          alt={item.userName}
          width={40}
          height={40}
          className="rounded-t-full mr-2"
        /> */}
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-blue-800">
          <Link href={`/profile/${item.userName}`} className="font-semibold">
            {item.title}
          </Link>
        </h2>
        <p className="mb-2">{item.description}</p>
        <div className="mt-2 flex items-center text-sm text-gray-600">
          <Image
            src={item.userLogo || "/placeholder.svg"}
            alt="logo"
            width={40}
            height={40}
            className="rounded-t-full mr-2"
          />
          <span>{item.userName}</span>
          <span className="mx-2">•</span>
          <span>1d</span>
        </div>
        <div className="mt-4 flex items-center space-x-4 text-gray-600">
          <div className="flex justify-between space-x-6">
            <Link
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:underline"
            >
              <FaLink />
            </Link>
            <button
              onClick={() => onLike(item.id)}
              className={`${item.isLiked ? "text-red-500" : "text-gray-500"}`}
            >
              <MdFavoriteBorder />
              {/* <span><MdFavoriteBorder/>({item.likes})</span> */}
            </button>
            <button
              onClick={() => onBookmark(item.id)}
              className={`${
                item.isBookmarked ? "text-yellow-500" : "text-gray-500"
              }`}
            >
              <FaBookmark />
            </button>
            <button className="text-gray-500">
              <FaShareAlt />
            </button>
          </div>
        </div>
      </div>
    </div>


    
    ///////////////////////////////////////////////////////////
    // <div className="border rounded-lg p-4 shadow-sm">
    //   <div className="flex items-center mb-2">
    //     <Image
    //       src={item.userLogo || "/placeholder.svg"}
    //       alt={item.userName}
    //       width={40}
    //       height={40}
    //       className="rounded-full mr-2"
    //     />
    //     <Link href={`/profile/${item.userName}`} className="font-semibold">
    //       {item.userName}
    //     </Link>
    //   </div>
    //   <h2 className="text-xl font-bold mb-2">{item.title}</h2>
    //   <p className="mb-2">{item.description}</p>
    //   <Link href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
    //     Visit Website
    //   </Link>
    //   <div className="mt-4 flex justify-between">
    //     <button onClick={() => onLike(item.id)} className={`${item.isLiked ? "text-red-500" : "text-gray-500"}`}>
    //       Like ({item.likes})
    //     </button>
    //     <button
    //       onClick={() => onBookmark(item.id)}
    //       className={`${item.isBookmarked ? "text-yellow-500" : "text-gray-500"}`}
    //     >
    //       Bookmark
    //     </button>
    //     <button className="text-gray-500">Share</button>
    //   </div>
    // </div>
  );
}
