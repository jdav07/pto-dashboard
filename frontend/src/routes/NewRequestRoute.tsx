// src/routes/NewRequestRoute.tsx
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { NewRequestView } from '@/views/NewRequest/NewRequestView';
import { NewRequestViewModel } from '@/viewModels/PTO/NewRequestViewModel';
import { rootStore } from '@/stores/RootStore';

const newRequestViewModel = new NewRequestViewModel(rootStore.ptoStore);

export const NewRequestRoute = observer(() => {
  const navigate = useNavigate();
  const isAuthenticated = rootStore.authStore.isAuthenticated;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return <NewRequestView viewModel={newRequestViewModel} />;
});