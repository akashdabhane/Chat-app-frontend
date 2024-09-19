import React, { useEffect } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { baseUrl } from '../utils/helper'


export default function LeftPanel({ users, handleChatOnClick }) {
  // useEffect(() => {
  //   axios.get(`${baseUrl}/messages/${chatInfo.lastMessage}`, {
  //     withCredentials: true,
  //     headers: {
  //       'Authorization': `Bearer ${Cookies.get('accessToken')}`,
  //     }
  //   })
  //     .then(response => {
  //       console.log(response.data.data)
  //     })
  //     .catch(error => {
  //       console.log(error)
  //     })
  // }, [])

  return (
    <div>
      {
        (users.length > 0) && (
          users.map((item, index) => {
            // // Check if lastMessageDetails exists and has elements
            // const hasLastMessageDetails = item?.lastMessageDetails.length > 0;

            // // Default to an empty string if no lastMessageDetails
            // const lastMessageDate = hasLastMessageDetails ? new Date(item?.lastMessageDetails?.createdAt).toUTCString().slice(5, 16) : "";
            // console.log(new Date(Date.now()).toUTCString());
            // const currentDate = new Date(Date.now()).toUTCString().slice(5, 16);
            // console.log(new Date(item?.lastMessageDetails?.createdAt));
            // const lastMessageHourMinute = hasLastMessageDetails && `${new Date(item?.lastMessageDetails[0]?.createdAt).getHours()}:${String(new Date(item?.lastMessageDetails[0]?.createdAt).getMinutes()).padStart(2, '0')}`;

            return (
              <div className="flex p-2 py-3 justify-between cursor-pointer border-b-2 border-slate-500 hover:bg-slate-500" key={index} onClick={(e) => handleChatOnClick(item)}>    {/*   */}
                <div className="space-x-2 flex ">
                  {
                    item.isGroupChat ?
                      <img className='rounded-[50%] w-10 h-10' src={"https://media.istockphoto.com/id/1158561473/vector/three-persons-icon-black-vector.jpg?s=612x612&w=0&k=20&c=UvL4Nvz9nL4zi5RdjAabosuFer98suMTA-FheZ2KLlQ="} alt="profileImg" />
                      :
                      <img className='rounded-[50%] w-10 h-10' src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVTtlOwG_6l93Lo3NcGZcQpGx4LXNwa3lF5A&s"} alt="profileImg" />
                  }
                  <div className="leading-5">
                    {
                      item.isGroupChat ?
                        <p>{item.name}</p>
                        :
                        <p>{item.participants[1].name === Cookies.get('name') ? item.participants[0].name : item.participants[1].name}</p>
                    }
                    {
                      <span className='text-gray-300 text-sm'>
                        {
                          item?.lastMessageDetails?.length > 0
                            ? item.lastMessageDetails[0].message
                            : ""
                        }
                      </span>
                    }
                  </div>
                </div>
                <div className='text-xs '>
                  {
                    item.lastMessageDetails.length > 0
                      ? new Date(item.lastMessageDetails[0].createdAt).toUTCString().slice(5, 16)
                      : ""
                    // lastMessageDate === currentDate ?
                    //   (hasLastMessageDetails && new Date(item?.lastMessageDetails[0]?.createdAt).getHours() + ":" + String(new Date(item?.lastMessageDetails[0]?.createdAt).getMinutes()).padStart(2, '0'))
                    //   : (hasLastMessageDetails && hasLastMessageDetails ? new Date(item?.lastMessageDetails?.createdAt).toUTCString().slice(5, 16) : "")
                  }
                </div>
              </div>
            )
          }
          )
        )
      }
    </div>
  )
}

