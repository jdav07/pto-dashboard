// routes/DashboardRoute.tsx
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Navigate } from 'react-router-dom';
import { DashboardView } from '@/views/Dashboard/DashboardView';
import { DashboardViewModel } from '@/viewModels/PTO/DashboardViewModel';
import { rootStore } from '@/stores/RootStore';

const dashboardViewModel = new DashboardViewModel(rootStore.ptoStore);

export const DashboardRoute = observer(() => {

  if (!rootStore.authStore.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    dashboardViewModel.loadData();
  }, []);

  return <DashboardView viewModel={dashboardViewModel} />;
  
});