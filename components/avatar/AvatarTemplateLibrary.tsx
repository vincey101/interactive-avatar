'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
// import AvatarInteraction from './../AvatarInteraction';

interface TemplateSelectionProps {
  onBack: () => void;
}

interface Avatar {
  avatar_id: string;
  avatar_name: string;
  preview_image_url: string;
  preview_video_url: string;
  gender: string;
}

// Skeleton loading component
const AvatarSkeleton = () => (
  <div className="group relative rounded-xl overflow-hidden shadow-sm bg-white animate-pulse">
    <div className="aspect-video bg-gray-200"></div>
    <div className="p-4">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="mt-3 h-8 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Avatar card component
const AvatarCard = React.memo(({ avatar }: { avatar: Avatar }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(true);
  const router = useRouter();

  const handleSelectAvatar = () => {
    localStorage.setItem('selectedAvatarId', avatar.avatar_id);
    router.push('/interactiveAvatar');
  };

  return (
    <div className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        <img
          src={avatar.preview_image_url}
          alt={avatar.avatar_name}
          className="w-full h-full object-cover"
          loading="eager"
          decoding="sync"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">{avatar.avatar_name}</h3>
          <span className="text-sm text-gray-500 capitalize">{avatar.gender}</span>
        </div>
        <button
          onClick={handleSelectAvatar}
          className="mt-3 w-full py-2 bg-gray-900 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Select Avatar
        </button>
      </div>
    </div>
  );
});

AvatarCard.displayName = 'AvatarCard';

const TemplateSelection = ({ onBack }: TemplateSelectionProps) => {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allAvatarsLoaded, setAllAvatarsLoaded] = useState<Avatar[]>([]);
  const itemsPerPage = 6;

  const loadAvatars = async () => {
    try {
      // Only fetch if we haven't loaded all avatars yet
      if (page === 1 || allAvatarsLoaded.length === 0) {
        const response = await fetch('/api/avatars'); // Updated to use our API route

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch avatars: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();

        if (data.data && data.data.avatars) {
          // Store all avatars and ensure uniqueness
          const uniqueAvatars = data.data.avatars.filter((avatar: Avatar, index: number, self: Avatar[]) =>
            index === self.findIndex((a) => a.avatar_id === avatar.avatar_id)
          );
          setAllAvatarsLoaded(uniqueAvatars);

          // Set initial page of avatars
          const initialAvatars = uniqueAvatars.slice(0, itemsPerPage);
          setAvatars(initialAvatars);
          setHasMore(uniqueAvatars.length > itemsPerPage);
        }
      } else {
        // Load next page from already fetched avatars
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const nextPageAvatars = allAvatarsLoaded.slice(start, end);

        if (nextPageAvatars.length > 0) {
          setAvatars(prev => [...prev, ...nextPageAvatars]);
          setHasMore(end < allAvatarsLoaded.length);
        } else {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load avatars');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvatars();
  }, [page]);

  // Intersection Observer for infinite scroll
  const observerTarget = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-6xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto relative">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="w-[45px] h-[45px] flex items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#111827] hover:from-[#5457DC] hover:to-[#1f2937] shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeftIcon className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900 ml-4">Select Template</h2>
        </div>

        {/* Close button */}
        <button
          onClick={onBack}
          className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <XMarkIcon className="w-6 h-6 text-gray-500" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Show skeleton loading for initial load */}
          {loading && page === 1 && (
            Array(6).fill(0).map((_, i) => (
              <AvatarSkeleton key={`skeleton-${i}`} />
            ))
          )}

          {/* Show loaded avatars */}
          {avatars.map((avatar) => (
            <AvatarCard key={avatar.avatar_id} avatar={avatar} />
          ))}

          {/* Loading more indicator */}
          {loading && page > 1 && (
            <div className="col-span-full text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="text-center py-4">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}

        {/* Intersection observer target */}
        <div ref={observerTarget} className="h-4" />
      </div>
    </div>
  );
};

export default TemplateSelection; 