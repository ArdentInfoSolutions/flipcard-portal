
// app/web/page.tsx
"use client";

import { use, useEffect, useState } from "react";
import TabBar from "../../components/common/TabBar";
import { WebItemFeed } from "../../components/page-components/web-feed/WebItemFeed";
import WebPost from "@/app/webpost/[id]/page";
import AllWebPosts from "../webpost/page";



export default function WebPage() {
  const [websiteId, setWebsiteId] = useState<string>("");
  const [posts,setPosts] =useState<any[]>([]);

  // useEffect(() => {
  //   console.log("Website ID:", websiteId);
  // }, [websiteId]);


  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("websiteData") || "{}");
    console.log("localData", localData);
    if (localData && localData.id) {
      setWebsiteId(localData.id);
    }
  }, []); // ✅ only once

  


  return (
    <main className="flex flex-col items-center">
      <div className="hidden md:block w-full">
        <TabBar />
      </div>
      {/* Render AllWebPosts here */}
      <div className="w-full max-w-6xl p-4">
        <AllWebPosts /> {/* This will display all posts */}
      </div>

      
      {/* Pass the websiteId to WebPost */}
       {/* {websiteId && <WebPost id={websiteId} />} */}
      {/* {websiteId && <WebPost/>} */}
     

      <div className="block md:hidden">
        <TabBar />
      </div>
    </main>
  );
}





