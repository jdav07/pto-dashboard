import { observer } from 'mobx-react-lite';
import { LoginViewModel } from '@/viewModels/Auth/LoginViewModel';
import { LoginForm } from '@/components/LoginForm';

interface LoginViewProps {
  viewModel: LoginViewModel;
}

export const LoginView = observer(({ viewModel }: LoginViewProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 w-full md:w-1/2 align-center">
      <div className="w-full max-w-[700px]">
        <LoginForm viewModel={viewModel} />
      </div>
    </div>
  );
});