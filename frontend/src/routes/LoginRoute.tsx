// src/routes/LoginRoute.tsx
import { observer } from 'mobx-react-lite';
import { Navigate } from 'react-router-dom';
import { LoginView } from '@/views/Login/LoginView';
import { LoginViewModel } from '@/viewModels/Auth/LoginViewModel';
import { rootStore } from '@/stores/RootStore';

const loginViewModel = new LoginViewModel(rootStore.authStore);

export const LoginRoute = observer(() => {
  if (rootStore.authStore.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return <LoginView viewModel={loginViewModel} />;
});