// routes/NewRequestRoute.tsx
import { observer } from 'mobx-react-lite';
import { Navigate } from 'react-router-dom';
import { NewRequestView } from '@/views/NewRequest/NewRequestView';
import { NewRequestViewModel } from '@/viewModels/PTO/NewRequestViewModel';
import { rootStore } from '@/stores/RootStore';

// Create a singleton instance of the view model
const newRequestViewModel = new NewRequestViewModel(rootStore.ptoStore);

export const NewRequestRoute = observer(() => {
  // Check authentication
  if (!rootStore.authStore.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Render the new request view with its view model
  return <NewRequestView viewModel={newRequestViewModel} />;
});