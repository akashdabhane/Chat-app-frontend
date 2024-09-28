import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


export default function ContactListSkeleton() {
    return (
        <div className='md:w-[40%] lg:w-[36%] md:block bg-slate-700 lg:rounded-l-2xl'>
            <div className="flex items-center w-full p-3 justify-between border-b-2 border-slate-500">
                <Skeleton />
                <span className='text-lg flex items-center px-2 space-x-2 '>
                    <Skeleton />
                    <Skeleton />
                </span>
            </div>
            {
                Array(8).fill(0).map((item, index) => (
                    <div className="flex p-2 justify-between cursor-pointer border-b-2 border-slate-500 hover:bg-slate-500" key={index}>
                        <div className="space-x-2 flex w-full">
                            <div className="rounded-[50%] w-10 h-10">
                                <Skeleton className='w-full h-full rounded-[50%]' />
                            </div>
                            <p className='w-full'>{<Skeleton count={2} />}</p>
                        </div>
                        <span className='text-xs '>{<Skeleton />}</span>
                    </div>
                ))
            }
        </div>
    )
}

