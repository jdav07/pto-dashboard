// routes/DashboardRoute.tsx
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Navigate } from 'react-router-dom';
import { DashboardView } from '@/views/Dashboard/DashboardView';
import { DashboardViewModel } from '@/viewModels/PTO/DashboardViewModel';
import { rootStore } from '@/stores/RootStore';

// Create a singleton instance of the view model
const dashboardViewModel = new DashboardViewModel(rootStore.ptoStore);

export const DashboardRoute = observer(() => {
  // Check authentication
  if (!rootStore.authStore.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Load initial data when the route mounts
  useEffect(() => {
    dashboardViewModel.loadData();
  }, []);

  // Render the dashboard view with its view model
  return <DashboardView viewModel={dashboardViewModel} />;
});