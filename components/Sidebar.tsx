'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HomeIcon,
  FolderIcon,
  ChartBarIcon,
  BanknotesIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  PlayIcon,
  ChatBubbleLeftIcon,
  GiftIcon,
  PlusIcon,
  WrenchIcon,
  Cog6ToothIcon,
  ArrowUpTrayIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState('');

  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem('projectsMenuOpen');
    if (savedState !== null) {
      setIsProjectsOpen(JSON.parse(savedState));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('projectsMenuOpen', JSON.stringify(isProjectsOpen));
    }
  }, [isProjectsOpen, isInitialized]);

  useEffect(() => {
    // Set the current path on the client side
    setCurrentPath(window.location.pathname);
  }, []);

  // Replace all pathname checks with currentPath
  const isActive = (path: string) => currentPath === path;

  const toggleProjects = () => {
    setIsProjectsOpen(!isProjectsOpen);
  };

  const handleLogout = () => {
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/login');
  };

  const handleSupportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('mailto:hello@appclicksupportdesk.com', '_blank');
  };

  const handleBonusesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://docs.google.com/document/d/1dKEM2hvwe-qkyuNvUUy0cKQ33mhBFmLnMNVzDNmN724/edit?usp=sharing', '_blank');
  };

  if (!isInitialized) {
    return (
      <div className="fixed w-64 h-screen bg-gray-900 flex flex-col">
        <div className="flex items-center h-16 px-6 border-b border-gray-700 bg-black">
          <h1 className="text-lg font-bold text-white">Avatar Studio</h1>
        </div>
        <div className="flex-1" />
      </div>
    );
  }

  return (
    <div className="fixed w-64 h-screen bg-gray-900 flex flex-col">
      <div className="flex items-center h-16 px-6 border-b border-gray-700 bg-black">
        <h1 className="text-lg font-bold text-white">HumanAI Studio</h1>
      </div>

      {/* Main navigation - with custom scrollbar */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
        <Link
          href="/"
          className={`flex items-center px-4 py-2 text-[13px] ${
            isActive('/') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          } rounded-lg transition-colors group`}
        >
          <HomeIcon className="w-[18px] h-[18px] mr-2.5 group-hover:text-white" />
          Dashboard
        </Link>

        {/* Projects dropdown */}
        <div>
          <button
            onClick={toggleProjects}
            className="flex items-center justify-between w-full px-4 py-2 text-[13px] text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors group"
          >
            <div className="flex items-center">
              <FolderIcon className="w-[18px] h-[18px] mr-2.5 group-hover:text-white" />
              Projects
            </div>
            {isProjectsOpen ? (
              <ChevronUpIcon className="w-3.5 h-3.5" />
            ) : (
              <ChevronDownIcon className="w-3.5 h-3.5" />
            )}
          </button>
          {isProjectsOpen && (
            <div className="ml-4 mt-1.5 space-y-1.5">
              <Link
                href="/projects/create-avatar"
                className={`flex items-center px-4 py-2 text-[13px] ${
                  isActive('/projects/create-avatar') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                } rounded-lg transition-colors group`}
              >
                <PlusIcon className="w-[18px] h-[18px] mr-2.5 group-hover:text-white" />
                Interactive Avatar
              </Link>
              <Link
                href="/projects/manage"
                className={`flex items-center px-4 py-2 text-[13px] ${
                  isActive('/projects/manage') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                } rounded-lg transition-colors group`}
              >
                <WrenchIcon className="w-[18px] h-[18px] mr-2.5 group-hover:text-white" />
                Manage
              </Link>
            </div>
          )}
        </div>

        <Link
          href="/traffic"
          className={`flex items-center px-4 py-2 text-[13px] ${
            isActive('/traffic') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          } rounded-lg transition-colors group`}
        >
          <ChartBarIcon className="w-[18px] h-[18px] mr-2.5 group-hover:text-white" />
          Traffic
        </Link>

        <Link
          href="/swift-profit"
          className={`flex items-center px-4 py-2 text-[13px] ${
            isActive('/swift-profit') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          } rounded-lg transition-colors group`}
        >
          <BanknotesIcon className="w-[18px] h-[18px] mr-2.5 group-hover:text-white" />
          Swift Profit
        </Link>

        <Link
          href="/multiple-income"
          className={`flex items-center px-4 py-2 text-[13px] ${
            isActive('/multiple-income') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          } rounded-lg transition-colors group`}
        >
          <BuildingOfficeIcon className="w-[18px] h-[18px] mr-2.5 group-hover:text-white" />
          Multiple Income
        </Link>

        <Link
          href="/agency"
          className={`flex items-center px-4 py-2 text-[13px] ${
            isActive('/agency') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          } rounded-lg transition-colors group`}
        >
          <BuildingOfficeIcon className="w-[18px] h-[18px] mr-2.5 group-hover:text-white" />
          Agency
        </Link>

        <Link
          href="/franchise"
          className={`flex items-center px-4 py-2 text-[13px] ${
            isActive('/franchise') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          } rounded-lg transition-colors group`}
        >
          <BuildingStorefrontIcon className="w-[18px] h-[18px] mr-2.5 group-hover:text-white" />
          Franchise
        </Link>

        <Link
          href="/tutorial"
          className={`flex items-center px-4 py-2 text-[13px] ${
            isActive('/tutorial') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          } rounded-lg transition-colors group`}
        >
          <PlayIcon className="w-[18px] h-[18px] mr-2.5 group-hover:text-white" />
          Tutorial
        </Link>

        <button
          onClick={handleSupportClick}
          className={`flex items-center w-full px-4 py-2 text-[13px] ${
            isActive('/support') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          } rounded-lg transition-colors group`}
        >
          <ChatBubbleLeftIcon className="w-[18px] h-[18px] mr-2.5 group-hover:text-white" />
          Support
        </button>

        <button
          onClick={handleBonusesClick}
          className={`flex items-center w-full px-4 py-2 text-[13px] ${
            isActive('/bonuses') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          } rounded-lg transition-colors group`}
        >
          <GiftIcon className="w-[18px] h-[18px] mr-2.5 group-hover:text-white" />
          Bonuses
        </button>

        <Link
          href="/upgrade-plan"
          className={`flex items-center px-4 py-2 text-[13px] ${
            isActive('/upgrade-plan') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          } rounded-lg transition-colors group`}
        >
          <ArrowUpTrayIcon className="w-[18px] h-[18px] mr-2.5 group-hover:text-white" />
          Upgrade Plan
        </Link>

        <Link
          href="/settings"
          className={`flex items-center px-4 py-2 text-[13px] ${
            isActive('/settings') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          } rounded-lg transition-colors group`}
        >
          <Cog6ToothIcon className="w-[18px] h-[18px] mr-2.5 group-hover:text-white" />
          Settings
        </Link>
      </nav>

      {/* Logout button in a separate container at the bottom */}
      <div className="p-3 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className={`flex items-center w-full px-4 py-2 text-[13px] ${
            isActive('/login') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          } rounded-lg transition-colors group`}
        >
          <ArrowRightOnRectangleIcon className="w-[18px] h-[18px] mr-2.5 group-hover:text-white" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 