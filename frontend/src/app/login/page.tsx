import { LoginForm } from '@/components/LoginForm';

interface LoginPageProps {
  setToken: (token: string) => void;
}

export default function LoginPage({ setToken }: LoginPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 w-full md:w-1/2 align-center">
      <div className="w-full max-w-[700px]">
        <LoginForm setToken={setToken} />
      </div>
    </div>
  );
}