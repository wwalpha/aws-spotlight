import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import { useAuth, LoginCallback } from '@/auth';

const AppRoutes = () => {
  const { isLoading, isLoggedIn, signinRedirect, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      console.log('Redirecting to login page...');
      signinRedirect();
    }
  }, [isLoading, isLoggedIn, signinRedirect]);

  if (isLoading) return <p>認証情報を確認中...</p>;

  if (!isAuthenticated) {
    return <div>ログインページにリダイレクト中...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<LoginCallback />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
export default AppRoutes;
