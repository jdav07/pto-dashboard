import { observer } from 'mobx-react-lite';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { rootStore } from '@/stores/RootStore';

export const Header = observer(() => {
  const navigate = useNavigate();
  const { authStore } = rootStore;

  function handleLogout() {
    // Clear the store’s token + user
    authStore.logout();

    // Redirect to /login
    navigate('/login');
  }

  const userName = authStore.userEmail 
    ? authStore.userEmail.split('@')[0].charAt(0).toUpperCase() + authStore.userEmail.split('@')[0].slice(1)
    : 'User';

  return (
    <header className="fixed top-0 w-full border-b bg-white dark:bg-background dark:border-border z-[3]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="font-bold text-xl">
          <Link to={authStore.token ? '/dashboard' : '/login'} className="font-bold">
            PTO
          </Link>
        </div>

        <nav className="flex items-center space-x-4 md:space-x-6">
          {authStore.token ? (
            <>
              <Link
                to="/dashboard"
                className="hover:text-muted-foreground transition-colors text-sm font-light"
              >
                Dashboard
              </Link>
              <Link
                to="/new-request"
                className="hover:text-muted-foreground transition-colors text-sm font-light"
              >
                New Request
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="font-light text-zinc-900">
                        {userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-light">{userName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="font-light">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="font-light" onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link
              to="/login"
              className="hover:text-muted-foreground transition-colors"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
});