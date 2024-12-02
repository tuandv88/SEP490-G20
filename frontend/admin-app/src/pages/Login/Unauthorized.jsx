export default function Unauthorized() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-6 py-12'>
      <div className='flex flex-col items-center justify-center'>
        <div className='mb-6 text-center text-4xl font-bold'>
          <span className='text-red-500'>403</span>
          <span className='text-red-500'>Forbidden</span>
        </div>
        <div className='text-center text-lg font-medium text-red-500'>
          You do not have permission to access this page.
        </div>
      </div>
    </div>
  )
}
