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


  useEffect(() => {
    if (!token) {
      setUserName('User');
      return;
    }

    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      const firstPart = storedEmail.split('@')[0];
      const capitalized = firstPart.charAt(0).toUpperCase() + firstPart.slice(1);
      setUserName(capitalized);
    }
  }, [token]);

  function handleLogout() {

    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');

 
    setToken(null);


    navigate('/login');
  }

  return (
    <header className="fixed top-0 w-full border-b bg-white dark:bg-background dark:border-border z-[3]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
 
        <div className="font-bold text-xl">
          <Link to={token ? '/dashboard' : '/login'} className="font-bold">PTO</Link>
        </div>

   
        <nav className="flex items-center space-x-4 md:space-x-6">
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

            <Link to="/login" className="hover:text-muted-foreground transition-colors">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}