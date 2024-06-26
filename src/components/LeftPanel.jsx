import React from 'react'
import Cookies from 'js-cookie'


export default function LeftPanel({ users, setOtherUser }) {
  return (
    <div>
      {
        users.map((item, index) => (
          item.name !== Cookies.get('user') && (
            <div className="flex p-2 justify-between cursor-pointer border-b-2 border-slate-500 hover:bg-slate-500" key={index} onClick={(e) => { setOtherUser(item) }}>
              <div className="space-x-2 flex">
                <img className='rounded-[50%] w-10 h-10' src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVTtlOwG_6l93Lo3NcGZcQpGx4LXNwa3lF5A&s" } alt="profileImg" />
                <p>{item.name}</p>
              </div>
              <span className='text-xs '>{"12/23/2003"}</span>
            </div>
          )
        ))
      }
    </div>
  )
}

