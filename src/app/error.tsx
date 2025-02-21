'use client';

import { useEffect } from 'react';

export default function ErrorPage({
    error,
    reset,
}: Readonly<{
    error: Error & { digest?: string };
    reset: () => void;
}>) {
    const handleTryAgain = () => {
        // Attempt the normal reset first
        reset();

        // Then, trigger a hard reload after a short delay (optional)
        setTimeout(() => {
            window.location.reload(); // The true argument forces a hard reload
        }, 100); // Adjust delay as needed (e.g., 100ms, 200ms)
    };
    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100'>
            <div className='bg-white p-8 rounded-lg shadow-md text-center'>
                <div className='text-red-500 text-5xl font-bold mb-4'>Oops!</div>
                <h2 className='text-2xl font-semibold mb-2 text-gray-800'>Something went wrong!</h2>
                <p className='text-gray-600 mb-6'>
                    We&apos;ve encountered an error. Our team has been notified, and we&apos;re
                    working to fix it.
                </p>
                {/* Conditionally render the error details in development */}
                {process.env.NODE_ENV === 'development' && (
                    <details className='text-left mb-6'>
                        <summary className='text-gray-600 cursor-pointer'>Error Details</summary>
                        <pre className='bg-gray-100 p-4 rounded mt-2 overflow-x-auto text-gray-500'>
                            {error.stack || error.message || error.toString()}
                        </pre>
                    </details>
                )}
                <button
                    onClick={handleTryAgain}
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                >
                    Try again
                </button>
                <p className='mt-4 text-gray-500'>
                    If the problem persists, please{' '}
                    <a href='/contact' className='text-blue-500 hover:underline'>
                        contact us
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}
