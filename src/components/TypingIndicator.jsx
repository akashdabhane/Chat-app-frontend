import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex space-x-1">
        <div className="w-2.5 h-2.5 bg-gray-500 rounded-full bounce-custom"></div>
        <div className="w-2.5 h-2.5 bg-gray-500 rounded-full bounce-custom delay-150"></div>
        <div className="w-2.5 h-2.5 bg-gray-500 rounded-full bounce-custom delay-300"></div>
      </div>
    </div>
  );
};

export default TypingIndicator;
