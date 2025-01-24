// src/components/Header.tsx
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface HeaderProps {
  token: string | null;
  setToken: (newToken: string | null) => void;
}

export default function Header({ token, setToken }: HeaderProps) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('User');

  // Example: parse user’s name from localStorage or JWT decode
  useEffect(() => {
    if (!token) {
      setUserName('User');
      return;
    }
    // If you store userEmail or decode JWT, parse it here
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      const firstPart = storedEmail.split('@')[0];
      const capitalized = firstPart.charAt(0).toUpperCase() + firstPart.slice(1);
      setUserName(capitalized);
    }
  }, [token]);

  function handleLogout() {
    // Remove items from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');

    // Clear token in state => triggers re-render
    setToken(null);

    // Navigate to /login
    navigate('/login');
  }

  return (
    <header className="fixed top-0 w-full border-b bg-white dark:bg-background dark:border-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Left: Logo */}
        <div className="font-bold text-xl">
          <Link to={token ? '/dashboard' : '/login'} className="font-bold">PTO</Link>
        </div>

        {/* Right: Nav + Avatar (if logged in) */}
        <nav className="flex items-center space-x-6">
          {token ? (
            <>
              <Link to="/dashboard" className="hover:text-muted-foreground transition-colors text-sm font-light">
                Dashboard
              </Link>
              <Link to="/new-request" className="hover:text-muted-foreground transition-colors text-sm font-light">
                New Request
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={userName} />
                      <AvatarFallback className="font-light text-zinc-900">{userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-light">{userName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="font-light">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="font-light" onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            /* If no token, just show a "Login" link */
            <Link to="/login" className="hover:text-muted-foreground transition-colors">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}