import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isLoggedIn } from './api';

export default function useAuth() {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/signin');
    }
  }, [router]);
}