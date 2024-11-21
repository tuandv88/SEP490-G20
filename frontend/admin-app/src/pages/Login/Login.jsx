import { LogInIcon } from 'lucide-react';
import { useState } from 'react';

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
    //   setIsLoading(true);
    //   // Simulating redirection to OIDC authentication page
    //   await new Promise(resolve => setTimeout(resolve, 1000));
    //   console.log('Redirecting to authentication page...');
    //   // In a real application, you would redirect to the actual OIDC auth URL
    //   // window.location.href = 'https://your-oidc-provider.com/auth';
    //   setIsLoading(false);
    };
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Access the admin panel securely with OIDC authentication
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <div>
              <button
                onClick={handleLogin}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LogInIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
                {isLoading ? 'Redirecting...' : 'Sign in with OIDC'}
              </button>
            </div>
            <div className="text-sm text-center">
              <p className="font-medium text-indigo-600 hover:text-indigo-500">
                You will be redirected to a secure login page
              </p>
            </div>
          </div>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-100 text-gray-500">
                  Protected by OIDC OAuth2
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}