// src/routes/Layout.tsx
import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/Header';


export const Layout = observer(() => {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header />
      <div className="flex justify-center">
        <Outlet />
      </div>
    </div>
  );
});