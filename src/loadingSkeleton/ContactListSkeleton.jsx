import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


export default function ContactListSkeleton() {
    return (
        <div>
            {
                Array(9).fill(0).map((item, index) => (
                    <div className="flex p-2 justify-between cursor-pointer border-b-2 border-slate-500 hover:bg-slate-500" key={index}>
                        <div className="space-x-2 flex">
                            <img className='rounded-[50%] w-10 h-10' src={<Skeleton />} alt="profileImg" />
                            <p>{<Skeleton />}</p>
                        </div>
                        <span className='text-xs '>{<Skeleton />}</span>
                    </div>
                ))
            }
        </div>
    )
}

