import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { MoreVertical } from "lucide-react";
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface HomePageItemProps {
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

export default function HomePageItem({ item, onLike, onBookmark }: HomePageItemProps) {
  const formattedUrl = item.url
    .replace(/https?:\/\//, "")
    .split("/")
    .join(" › ")
  return (

    <div className="mb-6 max-w-2xl">
    <ListItem disablePadding>
        <ListItemIcon className="ml-4">
        <Image src={item.userLogo || "/placeholder.svg"} alt={item.userName} width={24} height={24} className="rounded-full" />
        </ListItemIcon>
        <ListItemText
          primary={item.userName}
          secondary={formattedUrl}
        />
      </ListItem>
      <Link href={item.url} className="group block">
         <h3 className="text-xl mb-1 ml-5">
           <span className="text-blue-600 group-hover:underline font-medium inline-flex items-center gap-1">
             {item.title}
           </span>
         </h3>
         <p className="text-sm ml-5 text-gray-700 leading-relaxed">{item.description}</p>
       </Link>
      </div>
    // <div className="mb-6 max-w-2xl">
    //   <div className="flex items-center justify-between mb-1">
    //     <div className="flex items-center gap-2">
    //       <div className="w-6 h-6 relative">
    //         <Image src={item.userLogo || "/placeholder.svg"} alt={item.userName} width={24} height={24} className="rounded-full" />
    //       </div>
    //       <span className="text-sm">{item.userName}</span>
    //     </div>
    //     <Button variant="ghost" size="icon" className="h-8 w-8">
    //       <MoreVertical className="h-4 w-4" />
    //       <span className="sr-only">More options</span>
    //     </Button>
    //   </div>
    //   <div className="text-sm text-gray-600 mb-1">{formattedUrl}</div>
    //   <Link href={item.url} className="group block">
    //     <h3 className="text-xl mb-1">
    //       <span className="text-blue-600 group-hover:underline font-medium inline-flex items-center gap-1">
    //         {item.title}
    //       </span>
    //     </h3>
    //     <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
    //   </Link>
    // </div>
    
    // <div className=" bg-white overflow-hidden">
    
    //   <div className="p-4">
    //     <h2 className="text-lg font-semibold text-blue-800">
    //       <Link href={`/profile/${item.userName}`} className="font-semibold">
    //         {item.title}
    //       </Link>
    //     </h2>
    //     <p className="mb-2">{item.description}</p>
    //     <div className="mt-2 flex items-center text-sm text-gray-600">
    //       <Image
    //         src={item.userLogo || "/placeholder.svg"}
    //         alt="logo"
    //         width={40}
    //         height={40}
    //         className="rounded-t-full mr-2"
    //       />
    //       <span>{item.userName}</span>
    //       <span className="mx-2">•</span>
    //       <span>1d</span>
    //     </div>
    //     <div className="mt-4 flex items-center space-x-4 text-gray-600">
    //       <div className="flex justify-between space-x-6">
    //         <Link
    //           href={item.url}
    //           target="_blank"
    //           rel="noopener noreferrer"
    //           className="text-blue-700 hover:underline"
    //         >
    //           <FaLink />
    //         </Link>
    //         <button
    //           onClick={() => onLike(item.id)}
    //           className={`${item.isLiked ? "text-red-500" : "text-gray-500"}`}
    //         >
    //           <MdFavoriteBorder />
    //           {/* <span><MdFavoriteBorder/>({item.likes})</span> */}
    //         </button>
    //         <button
    //           onClick={() => onBookmark(item.id)}
    //           className={`${
    //             item.isBookmarked ? "text-yellow-500" : "text-gray-500"
    //           }`}
    //         >
    //           <FaBookmark />
    //         </button>
    //         <button className="text-gray-500">
    //           <FaShareAlt />
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>


    
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
