"use client"

import Image from 'next/image';
import { useState } from 'react';



export default function WebPage() {
  const [activeTab, setActiveTab] = useState('web');

  const apps = [
    { name: 'JioHotstar', category: 'Entertainment', desc: 'Disney+ Hotstar is now JioHotstar! Welcome to the world of infinite possibilities – where non-stop sports, endless entertainment, and countless stories come alive!', icon: '/images/jiohotstar.jpg', url: 'https://www.jiohotstar.com' },
    { name: 'Seekho', category: 'Education', desc: 'Seekho is India’s first Edutainment OTT platform with 10,000+ video courses on Technology, Money, and Business along with 10+ more categories.', icon: '/images/seekho.jpg', url: 'https://www.seekho.ai' },
    { name: 'Snapchat', category: 'Communication', desc: 'Snapchat is a fast and fun way to connect and share special moments with your friends and family. 📸.', icon: '/images/snapchat.png', url: 'https://www.snapchat.com' },
    { name: 'Meesho', category: 'Shopping', desc: 'Meesho: India’s Favourite One-stop Online Shop. You can now shop for yourself or earn money online, both using the same Meesho App!', icon: '/images/meesho.png', url: 'https://www.meesho.com' },
    { name: 'PhonePe', category: 'Finance', desc: 'PhonePe is a payments app that allows you to use BHIM UPI, your credit card & debit card or wallet to recharge your mobile phone', icon: '/images/phonepe.png', url: 'https://www.phonepe.com' },
    { name: 'Instagram Lite', category: 'Social', desc: 'Instagram Lite from Meta is a fast and smaller version of Instagram. Built to perform well on slower networks, use less mobile data..', icon: '/images/instagram lite.png', url: 'https://www.instagram.com' },
    { name: 'Instagram', category: 'Social', desc: 'Little moments lead to big friendships. Share yours on Instagram. — From Meta', icon: '/images/instagram.jpg', url: 'https://www.instagram.com' },
    { name: 'Kuku TV', category: 'Entertainment', desc: 'Welcome to Kuku TV - Your Ultimate Destination for Vertical Entertainment!', icon: '/images/kuku Fm.png', url: 'https://www.kukutv.com' },
    { name: 'Airtel Thanks', category: 'Finance', desc: 'Airtel Thanks App puts the whole Airtel world on your mobile! Enjoy a hassle-free experience while making your everyday payments.', icon: '/images/airtal.jpg', url: 'https://www.airtel.in/thanks-app' }
  ];


  return (
    <main className="flex flex-col items-center bg-white">
      <div className="hidden md:block w-full">
        
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 w-full max-w-6xl">
        {apps.map((app, index) => (
          <div key={index} className="flex flex-col p-4 shadow rounded-lg bg-white">
            <div className="flex items-start gap-3">
              <Image
                src={app.icon}
                alt={app.name}
                width={50}
                height={50}
                className="rounded-lg object-cover"
              />
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-gray-500 cursor-pointer hover:underline">
                  <a href={app.url} target='_blank' rel='noopener noreferrer'>
                    {app.name}
                    </a>
                    </h2>
                <p className="text-sm text-gray-500">{app.category}</p>
              </div>
            </div>
            <p className="text-sm text-black mt-2">{app.desc}</p>
          </div>
        ))}
      </div>

      <div className="block md:hidden">
        
      </div>
    </main>
  );
}