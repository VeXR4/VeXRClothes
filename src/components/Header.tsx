import { useEffect, useState } from 'react';
import { Menu, Moon, Search, ShoppingBag, Sun, User, X, Heart, GitCompare } from 'lucide-react';
import Logo from './Logo';
import { useStore } from '@/lib/store';
import { navigate, useRoute } from '@/lib/router';
import { useTheme } from '@/lib/theme';

const navLinks = [
  { label: 'زنانه', path: '/category/women' },
  { label: 'مردانه', path: '/category/men' },
  { label: 'کفش', path: '/category/shoes' },
  { label: 'جدیدترین‌ها', path: '/new' },
  { label: 'پرفروش‌ها', path: '/bestsellers' },
  { label: 'مجله', path: '/magazine' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { cartCount, setCartOpen, wishlist, compare } = useStore();
  const route = useRoute();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const go = (path: string) => {
    setMobileOpen(false);
    navigate(path);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[var(--ease-soft)] ${
        scrolled || route.path !== '/'
          ? 'bg-cream/90 backdrop-blur-xl border-b border-ink-900/5 dark:bg-night-950/90 dark:border-night-700/50'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <button
          className="lg:hidden -ml-2 p-2 text-ink-900 dark:text-night-100"
          onClick={() => setMobileOpen(true)}
          aria-label="منو"
        >
          <Menu size={22} strokeWidth={1.5} />
        </button>

        <a href="#/" className="lg:mr-0">
          <Logo />
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => go(link.path)}
              className="text-sm text-ink-700 hover:text-ink-900 transition-colors duration-300 relative group dark:text-night-100 dark:hover:text-night-50"
            >
              {link.label}
              <span className="absolute -bottom-1 right-0 h-px w-0 bg-sand-400 transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            className="p-2 text-ink-700 hover:text-ink-900 transition-colors dark:text-night-100 dark:hover:text-night-50"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="جستجو"
          >
            <Search size={20} strokeWidth={1.5} />
          </button>
          <button
            className="p-2 text-ink-700 hover:text-ink-900 transition-colors dark:text-night-100 dark:hover:text-night-50"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'حالت روشن' : 'حالت تیره'}
            title={theme === 'dark' ? 'حالت روشن' : 'حالت تیره'}
          >
            {theme === 'dark' ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
          </button>
          <button
            className="relative p-2 text-ink-700 hover:text-ink-900 transition-colors hidden sm:block dark:text-night-100 dark:hover:text-night-50"
            onClick={() => go('/compare')}
            aria-label="مقایسه"
          >
            <GitCompare size={20} strokeWidth={1.5} />
            {compare.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-sand-400 px-1 text-[10px] font-semibold text-ink-900">
                {compare.length.toLocaleString('fa-IR')}
              </span>
            )}
          </button>
          <button
            className="relative p-2 text-ink-700 hover:text-ink-900 transition-colors hidden sm:block dark:text-night-100 dark:hover:text-night-50"
            onClick={() => go('/wishlist')}
            aria-label="علاقه‌مندی"
          >
            <Heart size={20} strokeWidth={1.5} />
            {wishlist.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-sand-400 px-1 text-[10px] font-semibold text-ink-900">
                {wishlist.length.toLocaleString('fa-IR')}
              </span>
            )}
          </button>
          <button
            className="p-2 text-ink-700 hover:text-ink-900 transition-colors hidden sm:block dark:text-night-100 dark:hover:text-night-50"
            onClick={() => go('/account')}
            aria-label="حساب کاربری"
          >
            <User size={20} strokeWidth={1.5} />
          </button>
          <button
            className="relative p-2 text-ink-700 hover:text-ink-900 transition-colors dark:text-night-100 dark:hover:text-night-50"
            onClick={() => setCartOpen(true)}
            aria-label="سبد خرید"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-sand-400 px-1 text-[10px] font-semibold text-ink-900">
                {cartCount.toLocaleString('fa-IR')}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-ink-900/5 bg-cream/95 backdrop-blur-xl dark:bg-night-950/95 dark:border-night-700/50">
          <form onSubmit={submitSearch} className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:px-8">
            <Search size={20} strokeWidth={1.5} className="text-ink-400" />
            <input
              autoFocus
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجوی محصول..."
              className="flex-1 bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none dark:text-night-50 dark:placeholder:text-night-300"
            />
            <button type="submit" className="text-sm font-medium text-ink-700 hover:text-ink-900">
              جستجو
            </button>
          </form>
        </div>
      )}

      {/* Mobile drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="منوی موبایل"
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div
          className="absolute inset-0 bg-ink-950/70 backdrop-blur-md"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[82%] max-w-sm bg-cream shadow-2xl transition-transform duration-500 ease-[var(--ease-soft)] dark:bg-night-900 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-ink-900/10 px-5 py-4">
            <Logo />
            <button className="p-2 text-ink-700" onClick={() => setMobileOpen(false)} aria-label="بستن">
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>
          <nav className="flex flex-col px-5 py-4">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => go(link.path)}
                className="border-b border-ink-900/5 py-4 text-right text-base text-ink-800 hover:text-sand-500 transition-colors dark:border-night-700/30 dark:text-night-100 dark:hover:text-sand-400"
              >
                {link.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-4 px-5 py-4 text-sm text-ink-600 dark:text-night-200">
            <button onClick={() => go('/account')} className="flex items-center gap-2">
              <User size={18} strokeWidth={1.5} /> حساب کاربری
            </button>
            <button onClick={() => go('/wishlist')} className="flex items-center gap-2">
              <Heart size={18} strokeWidth={1.5} /> علاقه‌مندی
            </button>
            <button onClick={() => go('/compare')} className="flex items-center gap-2">
              <GitCompare size={18} strokeWidth={1.5} /> مقایسه
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
