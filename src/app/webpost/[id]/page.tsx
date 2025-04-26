'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function WebPost() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/website/${id}`);
        const json = await res.json();
        if (res.ok) setData(json);
        else setError(json.error || 'Unknown error');
      } catch (err) {
        console.error("❌ Fetch failed:", err);
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="text-blue-500 p-4">🔄 Loading...</div>;
  if (error) return <div className="text-red-500 p-4">❌ {error}</div>;
  if (!data) return <div className="text-yellow-500 p-4">⚠️ No data found</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{data.websiteName}</h1>
      <img src={data.coverPhoto} alt="Cover" className="w-full h-64 object-cover rounded-lg mb-4" />
      <div className="mb-4">
        <strong className="block text-lg mb-1">Overview:</strong>
        <p>{data.overview}</p>
      </div>
      <div className="mb-4">
        <strong className="block text-lg mb-1">Email:</strong>
        <p>{data.email}</p>
      </div>
    </div>
  );
}

// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';

// interface WebPostData {
//     websiteName: string;
//     overview: string;
//     email?: string;
//     coverPhoto?: string;
// }

// export default function WebPost() {
//     const params = useParams();
//     const id = params?.id as string;
//     console.log("params", params); // Debugging
//     console.log("id", id); // Debugging

//     const [data, setData] = useState<WebPostData | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         if (!id) {
//             setError("No ID found in URL");
//             setLoading(false);
//             return;
//         }

//         const fetchData = async () => {
//             try {
//                 const response = await fetch(`/api/website/${id}`);
//                 if (!response.ok) throw new Error('Failed to fetch data');
//                 const fetchedData = await response.json();
//                 setData(fetchedData);
//             } catch (err: any) {
//                 setError(err.message || 'Unknown error');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [id]);

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div className="text-red-500">Error: {error}</div>;
//     if (!data) return <div>No data found</div>;

//     return (
//         <div className="p-2 max-w-xs mx-auto">
//             <div className="bg-white shadow-md rounded-xl overflow-hidden">
//                 <img
//                     src={data.coverPhoto || '/placeholder.jpg'}
//                     alt="Cover"
//                     className="w-full h-40 object-cover"
//                 />

//                 <div className="p-3 space-y-3">
//                     <h1 className="text-lg font-semibold text-gray-900 truncate">
//                         {data.websiteName}
//                     </h1>

//                     <div>
//                         <h2 className="text-sm font-medium text-gray-700">Overview</h2>
//                         <p className="text-sm text-gray-600 whitespace-pre-line">
//                             {data.overview}
//                         </p>
//                     </div>

//                     <div>
//                         <h2 className="text-sm font-medium text-gray-700">Email</h2>
//                         <p className="text-sm text-gray-500">{data.email || 'Not provided'}</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation'; // ✅ Important!
// import Link from 'next/link';
// import { useRouter } from 'next/navigation'; // ✅ Important!
// import { query } from '@/lib/db';

// interface WebPostData {
//     websiteName: string;
//     overview: string;
//     email?: string;
//     coverPhoto?: string;
// }

// export default function WebPost() {
//     const { id } = useParams(); // Correctly using useParams for dynamic params
//     const [data, setData] = useState<WebPostData | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         console.log("Received Website ID in WebPost:", id); // Debugging
//         if (id) {
//             console.log(`Fetching data for ID: `, id); // Debugging to check if fetch is triggered
//             const fetchData = async () => {
//                 setLoading(true);
//                 try {
//                     const response = await fetch(`/api/website/${id}`);
//                     console.log(response);
//                     if (!response.ok) {
//                         throw new Error('Failed to fetch data');
//                     }
//                     const fetchedData = await response.json();
//                     setData(fetchedData);
//                 } catch (err) {
//                     setError('Error fetching data: ' + (err instanceof Error ? err.message : 'Unknown error'));
//                 } finally {
//                     setLoading(false);
//                 }
//             };

//             fetchData();
//         }
//         else{
//             console.log('id is undefined');
//         }
//     }, [id]);

//     if (loading) return <div>Loading....</div>;
//     if (error) return <div>{error}</div>;
//     if (!data) return <div>No data found.</div>;

//     return (
//         <div className="p-2 max-w-xs mx-auto">
//             <div className="bg-white shadow-md rounded-xl overflow-hidden">
//                 {/* Cover Image */}
//                 <img
//                     src={data.coverPhoto || '/placeholder.jpg'}
//                     alt="Cover"
//                     className="w-full h-40 object-cover"
//                 />

//                 {/* Content */}
//                 <div className="p-3 space-y-3">
//                     {/* Website Name */}
//                     <Link href={`/preview/${id}`}>
//                         <h1 className="text-lg font-semibold text-gray-900 hover:underline truncate">
//                             {data.websiteName}
//                         </h1>
//                     </Link>

//                     {/* Overview */}
//                     <div>
//                         <h2 className="text-sm font-medium text-gray-700 mb-0.5">Overview</h2>
//                         <p className="text-sm text-gray-600 whitespace-pre-line line-clamp-3">
//                             {data.overview}
//                         </p>
//                     </div>

//                     {/* Email */}
//                     <div>
//                         <h2 className="text-sm font-medium text-gray-700 mb-0.5">Contact Email</h2>
//                         <p className="text-sm text-gray-500 truncate">{data.email || 'Not provided'}</p>
//                     </div>
//                 </div>
//             </div>
//         </div>


//     );
// }


// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";


// interface WebPostData {
//     websiteName: string;
//     overview: string;
//     email?: string;
//     coverPhoto?: string;
// }

// export default function WebPost({id}: { id: string }) {
//     console.log("Received Website ID in WebPost:", id); // Debugging
   
//     const [data, setData] = useState<WebPostData | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     useEffect(() => {
//         console.log(`Fetching data for ID: `,id); // Debugging to check if fetch is triggered
//         const fetchData = async () => {
//             try {
//                 const response = await fetch(`/api/website/${id}`);
//                 if (!response.ok) {
//                     const errorData = await response.json();
//                     throw new Error(errorData.error || "Failed to fetch data");
//                 }
//                 const data = await response.json();
//                 console.log("Fetched data:", data);  // Debugging: Check data
//                 setData(data);
//             } catch (err) {
//                 setError("Error fetching why  data: " + (err instanceof Error ? err.message : "Unknown error"));
//             } finally {
//                 setLoading(false);
//             }
//         };

       
//     }, [id]);




//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>{error}</div>;
//     if (!data) return <div>No data found.</div>;

//     return (
//         <div className="p-4 max-w-2xl mx-auto">
//             <Link href={`/preview/${id}`}>
//             <h1 className="text-2xl font-bold mb-2">{data.websiteName}</h1>
//             </Link>
//             <img
//                 src={data.coverPhoto || "/placeholder.jpg"}
//                 alt="Cover"
//                 className="rounded-lg w-full h-60 object-cover mb-4"
//             />
//             <p className="text-gray-700 mb-2 whitespace-pre-line">{data.overview}</p>
//             <p className="text-sm text-gray-500">Contact: {data.email || "Not provided"}</p>
//         </div>
//     );
// }
