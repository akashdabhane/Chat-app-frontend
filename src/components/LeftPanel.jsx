import React from 'react'
import Cookies from 'js-cookie'


export default function LeftPanel({ users, handleChatOnClick }) {

  return (
    <div>
      {
        (users.length > 0) && (
          users.map((item, index) => (
            <div className="flex p-2 justify-between cursor-pointer border-b-2 border-slate-500 hover:bg-slate-500" key={index} onClick={(e) => handleChatOnClick(item)}>    {/*   */}
              <div className="space-x-2 flex">
                {
                  item.isGroupChat ?
                    <img className='rounded-[50%] w-10 h-10' src={"https://media.istockphoto.com/id/1158561473/vector/three-persons-icon-black-vector.jpg?s=612x612&w=0&k=20&c=UvL4Nvz9nL4zi5RdjAabosuFer98suMTA-FheZ2KLlQ="} alt="profileImg" />
                    :
                    <img className='rounded-[50%] w-10 h-10' src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVTtlOwG_6l93Lo3NcGZcQpGx4LXNwa3lF5A&s"} alt="profileImg" />
                }
                {
                  item.isGroupChat ?
                    <p>{item.name}</p>
                    :
                    <p>{item.participants[1].name === Cookies.get('name') ? item.participants[0].name : item.participants[1].name}</p>
                }
              </div>
              <span className='text-xs '>{"12/23/2003"}</span>
            </div>
          )
          )
        )
      }
    </div>
  )
}

