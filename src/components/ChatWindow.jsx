import React, { useEffect } from 'react'
import Cookies from 'js-cookie'

export default function ChatWindow({ chatMessageList, chatInfo }) {
  console.log(chatMessageList);
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

  let previousDate = "";


  return (
    <div className="showMessages py-4 px-2 h-[70vh] flex flex-col">
      {
        chatMessageList.map((item, index) => {
          const currentDate = new Date(item.createdAt || Date.now()).toUTCString().slice(0, 16); // Extract the date part

          const showDate = currentDate !== previousDate; // Compare with the previous date

          // Update previousDate to the current date for the next iteration
          previousDate = currentDate;

          return (
            <React.Fragment key={index}>
              {
                showDate &&
                <div className="text-center">
                  <span className='bg-slate-700 px-2 p-1 rounded '>
                    {currentDate}
                  </span>
                </div>
              }
              <div className={`w-fit text-black p-2 py-1 mx-4 my-1 rounded-lg ${(Cookies.get('userId') === item.author._id || Cookies.get('userId') === item.author) ?
                " rounded-tr-[0%] float-right bg-blue-300 self-end" :
                "rounded-tl-[0%] float-left bg-green-300 self-start"}`}>
                <div className=''>
                  {
                    chatInfo.isGroupChat && (
                      <span className='text-sm text-pink-500'>{(Cookies.get('userId') === item.author._id || Cookies.get('userId') === item.author) ? "You" : item.author.name || item.author}: </span>
                    )
                  }
                  {item.message}
                </div>
                <div className='text-[.60rem] leading-3 float-right '>
                  {
                    item.time || (new Date(item.createdAt).getHours()
                      + ":" +
                      new Date(item.createdAt).getMinutes())
                  }
                </div>
              </div>
            </React.Fragment>
          )
        })
      }
    </div>
  )
}
