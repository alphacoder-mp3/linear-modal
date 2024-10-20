'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

type ErrorProps = {
  error: Error;
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('error boundary', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="mt-2 text-red-500">{error.message}</p>
      <Button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => reset()}
      >
        Try again
      </Button>
    </div>
  );
}
