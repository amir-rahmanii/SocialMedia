
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className='flex flex-col px-3 items-center gap-6 justify-center h-screen'>
      <img className='w-96 h-96 rounded-lg' src="/images/404-error.jpg" alt="404" />
      <Link className='bg-primary-blue p-3 rounded-sm' to='/'>Back to Home</Link>
    </div>
  )
}

export default NotFound