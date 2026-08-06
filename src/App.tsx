import { Suspense, lazy } from 'react';
import { AuthProvider } from '@/lib/auth';
import { StoreProvider } from '@/lib/store';
import { useRoute, matchRoute, navigate } from '@/lib/router';
import LogoIntro from '@/components/LogoIntro';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/sections/Footer';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import HomePage from '@/pages/HomePage';

const ProductPage = lazy(() => import('@/pages/ProductPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const AccountPage = lazy(() => import('@/pages/AccountPage'));
const CategoryPage = lazy(() => import('@/pages/CategoryPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const WishlistPage = lazy(() => import('@/pages/WishlistPage'));
const ComparePage = lazy(() => import('@/pages/ComparePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));

function PageLoader() {
  return <SkeletonLoader />;
}

function Router() {
  const route = useRoute();
  const { path, query } = route;

  // Match dynamic routes
  const productMatch = matchRoute('/product/:slug', path);
  const categoryMatch = matchRoute('/category/:slug', path);

  let page;
  if (path === '/' || path === '') page = <HomePage />;
  else if (productMatch) page = <ProductPage slug={productMatch.slug} />;
  else if (categoryMatch) page = <CategoryPage slug={categoryMatch.slug} />;
  else if (path === '/new') page = <CategoryPage slug="new" />;
  else if (path === '/bestsellers') page = <CategoryPage slug="bestsellers" />;
  else if (path === '/cart') page = <CartPage />;
  else if (path === '/checkout') page = <CheckoutPage />;
  else if (path === '/auth') page = <AuthPage />;
  else if (path === '/account') page = <AccountPage />;
  else if (path === '/wishlist') page = <WishlistPage />;
  else if (path === '/compare') page = <ComparePage />;
  else if (path === '/search') page = <SearchPage query={query.get('q') || ''} />;
  else if (path === '/about') page = <AboutPage />;
  else if (path === '/magazine') page = <HomePage />;
  else page = <NotFound />;

  return (
    <main className="min-h-screen">
      <Suspense fallback={<PageLoader />}>{page}</Suspense>
    </main>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 pt-20">
      <p className="font-display text-3xl text-ink-900">۴۰۴</p>
      <p className="text-sm text-ink-500">صفحه یافت نشد.</p>
      <button onClick={() => navigate('/')} className="text-sm font-medium text-ink-900 underline underline-offset-4">
        بازگشت به خانه
      </button>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <LogoIntro />
        <Header />
        <Router />
        <CartDrawer />
        <Footer />
      </StoreProvider>
    </AuthProvider>
  );
}
