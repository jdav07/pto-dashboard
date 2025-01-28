import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { observer } from 'mobx-react-lite';
import { LoginViewModel } from '@/viewModels/Auth/LoginViewModel';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {
  viewModel: LoginViewModel;
}

export const LoginForm = observer(
  ({ className, viewModel, ...props }: LoginFormProps) => {
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof loginSchema>>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
        email: '',
        password: '',
      },
    });

    async function onSubmit(values: z.infer<typeof loginSchema>) {
      try {
        const success = await viewModel.login(values.email, values.password);
        if (success) {
          navigate('/dashboard');
        } else {
          form.setError('password', {
            message: viewModel.error || 'Invalid credentials',
          });
        }
      } catch (err) {
        form.setError('password', {
          message: viewModel.error || 'Invalid credentials',
        });
      }
    }

    return (
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <Card className="overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-sm text-muted-foreground">
                      Login to your PTO Manager account
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="******" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={viewModel.loading}>
                    {viewModel.loading ? 'Logging in...' : 'Login'}
                  </Button>

                  <div className="text-center text-sm">
                    Don&apos;t have an account?{' '}
                    <a
                      href="mailto:jose@josedavila.dev"
                      className="underline underline-offset-4"
                    >
                      Contact Admin
                    </a>
                  </div>
                </div>
              </form>
            </Form>

            <div className="relative hidden bg-muted md:block">
              <img
                src="../mimipic-photography-XmR3y0bp3Kw-unsplash.jpg"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
);