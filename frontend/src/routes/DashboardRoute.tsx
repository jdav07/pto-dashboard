// src/routes/DashboardRoute.tsx
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { DashboardView } from '@/views/Dashboard/DashboardView';
import { DashboardViewModel } from '@/viewModels/PTO/DashboardViewModel';
import { rootStore } from '@/stores/RootStore';

const dashboardViewModel = new DashboardViewModel(rootStore.ptoStore);

export const DashboardRoute = observer(() => {
  const navigate = useNavigate();
  const isAuthenticated = rootStore.authStore.isAuthenticated;


  useEffect(() => {
    if (!isAuthenticated) {
      // Force a navigation to /login
      navigate('/login');
      return;
    }
    // If still authenticated, load the data
    dashboardViewModel.loadData();
  }, [isAuthenticated, navigate]);

  return <DashboardView viewModel={dashboardViewModel} />;
});
