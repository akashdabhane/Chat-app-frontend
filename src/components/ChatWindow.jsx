import React, { useState } from 'react'
import Cookies from 'js-cookie'

export default function ChatWindow({ chatPanel }) {
  // const [firstName, setFirstName] = useState(''); 
  // const [fullName, setFullName] = useState(''); 

  // const extractFirstName = () => {
  //   // Split the full name into an array of words
  //   const nameArray = fullName.split(' ');

  //   // Get the first element of the array as the first name
  //   if (nameArray.length > 0) {
  //     setFirstName(nameArray[0]);
  //   } else {
  //     setFirstName(''); // Handle cases where there's no name entered
  //   }
  // };

  return (
      <div className="showMessages pt-6 px-2 h-[70vh] flex flex-col">
        {
          chatPanel.map((item, index) => (
            <div key={index} className={`w-fit text-black p-2 py-1 mx-4 my-1 rounded-lg ${Cookies.get('user') === item.author ? " rounded-tr-[0%] float-right bg-blue-300 self-end" : "rounded-tl-[0%] float-left bg-green-300 self-start"}`}>
              <div className=''><span className='text-sm text-pink-500'>{Cookies.get('user') === item.author ? "You" : item.author} :</span> {item.message} </div>
              <div className='text-[.60rem] leading-3 float-right '>{item.time}</div>
            </div>
          ))
        }
      </div>
  )
}
