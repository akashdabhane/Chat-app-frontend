import { Link } from 'react-router-dom';
import { TbMoodCry } from "react-icons/tb";

function PageNotFound() {
  return (
    <div className='bg-gray-900 text-white flex flex-col items-center justify-center h-screen p-4 text-center'>
      <div className="mb-4 text-cyan-500">
        <TbMoodCry className='text-6xl' />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">404</h1>
      <h2 className='text-2xl md:text-3xl font-semibold text-gray-300 mb-4'>Page Not Found</h2>
      <p className="text-gray-400 max-w-md mb-8">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Link
        to="/"
        className="bg-cyan-600 text-white font-bold rounded-lg px-6 py-3 text-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors">
        Go to Homepage
      </Link>
    </div>
  )
}

export default PageNotFound;