import React from 'react';

// A single skeleton item component for reusability
const SkeletonItem = () => (
    <div className="flex items-center p-3">
        {/* Avatar Skeleton */}
        <div className="mr-4 flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-gray-700"></div>
        </div>
        {/* Name and Message Skeleton */}
        <div className="flex-grow space-y-2">
            <div className="h-4 bg-gray-700 rounded w-3/5"></div>
            <div className="h-3 bg-gray-700 rounded w-4/5"></div>
        </div>
        {/* Timestamp Skeleton */}
        <div className="ml-2 flex-shrink-0">
            <div className="h-3 bg-gray-700 rounded w-12"></div>
        </div>
    </div>
);


export default function ContactListSkeleton() {
    return (
        <div className="w-full md:w-[40%] lg:w-full bg-gray-800 flex flex-col h-full overflow-hidden rounded-l-2xl">
            {/* Header Skeleton */}
            <div className="flex items-center p-3 justify-between border-b-2 border-gray-700 flex-shrink-0">
                {/* Search Bar Skeleton */}
                <div className="w-full mr-4">
                    <div className="h-10 bg-gray-700 rounded-lg"></div>
                </div>
                {/* Action Icons Skeleton */}
                <div className='flex items-center space-x-2'>
                    <div className="h-10 w-10 rounded-full bg-gray-700"></div>
                    <div className="h-10 w-10 rounded-full bg-gray-700"></div>
                </div>
            </div>
            
            {/* Chat List Skeleton with pulse animation */}
            <div className="overflow-y-hidden flex-grow animate-pulse p-1">
              {/* We map over an array to generate multiple skeleton list items */}
              {Array(10).fill(0).map((_, index) => (
                <SkeletonItem key={index} />
              ))}
            </div>
        </div>
    );
}