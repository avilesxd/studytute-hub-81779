import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

/**
 * The `NotFound` component in TypeScript React displays a 404 error message for non-existent routes and provides a link to return to the home
 * page.
 * @returns The NotFound component is being returned. It displays a 404 error message with a link to return to the home page.
 */
const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      location.pathname,
    )
  }, [location.pathname])

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100'>
      <div className='text-center'>
        <h1 className='mb-4 text-4xl font-bold'>404</h1>
        <p className='mb-4 text-xl text-gray-600'>Oops! Page not found</p>
        <a href='/' className='text-blue-500 underline hover:text-blue-700'>
          Return to Home
        </a>
      </div>
    </div>
  )
}

export default NotFound
