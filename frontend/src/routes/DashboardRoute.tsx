// routes/DashboardRoute.tsx
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { DashboardView } from '@/views/Dashboard/DashboardView';
import { DashboardViewModel } from '@/viewModels/PTO/DashboardViewModel';
import { rootStore } from '@/stores/RootStore';

/**
 * Create a single instance of the DashboardViewModel,
 * e.g. a global or module-level. 
 */
const dashboardViewModel = new DashboardViewModel(rootStore.ptoStore);

export const DashboardRoute = observer(() => {
  const navigate = useNavigate();
  const isAuthenticated = rootStore.authStore.isAuthenticated;

  /**
   * Always call the same hooks in every render.
   * If not authenticated, we navigate inside an effect, 
   * rather than returning early.
   */
  useEffect(() => {
    if (!isAuthenticated) {
      // Force a navigation to /login
      navigate('/login');
      return;
    }
    // If still authenticated, load the data
    dashboardViewModel.loadData();
  }, [isAuthenticated, navigate]);

  /**
   * We always return the same structure. 
   * If the store logs the user out, 
   * the effect will navigate away on the next render. 
   */
  return <DashboardView viewModel={dashboardViewModel} />;
});
