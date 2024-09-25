import React, { useEffect } from 'react'
import Cookies from 'js-cookie'

export default function LeftPanel({ users, handleChatOnClick }) {

  return (
    <div>
      {
        (users?.length > 0) && (
          users.map((item, index) => {
            // // Check if lastMessageDetails exists and has elements
            const hasLastMessageDetails = item?.lastMessageDetails?.length > 0;

            console.log(item)
            const currentDate = new Date(Date.now()).toUTCString().slice(5, 16);
            console.log(currentDate)

            // Default to an empty string if no lastMessageDetails
            const lastMessageDate = hasLastMessageDetails ? new Date(item?.lastMessageDetails[0]?.createdAt).toUTCString().slice(5, 16) : "";

            // last message hour and minute
            const lastMessageHourMinute = hasLastMessageDetails && `${new Date(item?.lastMessageDetails[0]?.createdAt).getHours()}:${String(new Date(item?.lastMessageDetails[0]?.createdAt).getMinutes()).padStart(2, '0')}`;

            return (
              <div className="flex p-2 py-3 justify-between cursor-pointer border-b-2 border-slate-500 hover:bg-slate-500" key={index} onClick={(e) => handleChatOnClick(item)}>    {/*   */}
                <div className="space-x-2 flex w-60">
                  {
                    item?.isGroupChat ?
                      <img className='rounded-[50%] w-10 h-10' src={item?.profileImage || "https://media.istockphoto.com/id/1158561473/vector/three-persons-icon-black-vector.jpg?s=612x612&w=0&k=20&c=UvL4Nvz9nL4zi5RdjAabosuFer98suMTA-FheZ2KLlQ="} alt="profileImg" />
                      :
                      (
                        item?.participants ?
                          <img className='rounded-[50%] w-10 h-10' src={(item?.participants[1]?.name === Cookies.get('name') ? item?.participants[0]?.profileImage : item?.participants[1]?.profileImage) || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVTtlOwG_6l93Lo3NcGZcQpGx4LXNwa3lF5A&s"} alt="profileImg" />
                          :
                          <img className='rounded-[50%] w-10 h-10' src={item?.profileImage} alt="profileImage" />
                      )
                  }
                  <div className="leading-5">
                    {
                      item.isGroupChat ?
                        <p>{item?.name}</p>
                        :
                        // {
                        (
                          item?.participants ?
                            <p>{item?.participants[1]?.name === Cookies.get('name') ? item?.participants[0]?.name : item?.participants[1]?.name}</p>
                            :
                            <p>{item.name}</p>
                        )
                      // }
                    }
                    {
                      <span className='text-gray-300 text-sm line-clamp-1'>
                        {
                          item?.lastMessageDetails?.length > 0
                            ? item.lastMessageDetails[0].message
                            : ""
                        }
                      </span>
                    }
                  </div>
                </div>
                <div className='text-xs'>
                  {
                    lastMessageDate === currentDate
                      ? lastMessageHourMinute
                      : lastMessageDate
                  }
                </div>
              </div>
            )
          })
        )
      }
    </div>
  )
}

