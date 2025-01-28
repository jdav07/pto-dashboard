import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { NewRequestViewModel } from '@/viewModels/PTO/NewRequestViewModel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CalendarIcon } from 'lucide-react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface NewRequestFormValues {
  requestDate: string;
  hours: number;
  reason: string;
}

interface NewRequestViewProps {
  viewModel: NewRequestViewModel;
}

export const NewRequestView = observer(({ viewModel }: NewRequestViewProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<NewRequestFormValues>({
    defaultValues: {
      requestDate: '',
      hours: 0,
      reason: '',
    },
  });

  function handleDateSelect(date: Date | undefined, onChange: (value: string) => void) {
    if (!date) return;
    const formatted = format(date, 'MM/dd/yyyy');
    onChange(formatted);
  }

  async function onSubmit(data: NewRequestFormValues) {

    const validation = viewModel.validateForm(data.requestDate, data.hours, data.reason);
    if (!validation.valid) {

      Object.entries(validation.errors).forEach(([fieldName, errorMessage]) => {
        form.setError(fieldName as keyof NewRequestFormValues, {
          message: errorMessage,
        });
      });
      return;
    }


    try {
      await viewModel.submitPtoRequest(data.requestDate, data.hours, data.reason);

      toast({
        variant: 'default',
        title: 'Success',
        description: 'Your PTO request has been submitted!',
      });

      navigate('/dashboard');
    } catch (err: any) {

      if (err?.response?.data?.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: err.response.data.error,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: err?.message || 'Failed to submit request',
        });
      }
    }
  }

  return (
    <div className="max-w-[400px] w-full mx-auto pt-24 px-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New Request</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold py-4">New PTO Request</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* requestDate Field */}
          <FormField
            control={form.control}
            name="requestDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value || 'Pick a date'}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <Calendar
                      mode="single"
                      initialFocus
                      selected={field.value ? viewModel.parseDateString(field.value) : undefined}
                      disabled={viewModel.isDateDisabled}
                      onSelect={(date) => handleDateSelect(date, field.onChange)}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* hours Field */}
          <FormField
            control={form.control}
            name="hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hours</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* reason Field */}
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reason</FormLabel>
                <FormControl>
                  <Textarea placeholder="Vacation, appointment, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* The “submit” button */}
          <div className="grid grid-flow-col gap-4">
            <Button type="submit" disabled={viewModel.loading} className="relative">
              <span className={viewModel.loading ? 'opacity-0' : ''}>Submit</span>
              {viewModel.loading && (
                <Loader2 className="absolute inset-0 m-auto h-5 w-5 animate-spin" />
              )}
            </Button>
          </div>
        </form>
      </Form>

      <div className="grid grid-flow-col gap-4 mt-4">
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Cancel
        </Button>
      </div>
    </div>
  );
});