// src/views/NewRequest/NewRequestView.tsx
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { NewRequestViewModel } from '@/viewModels/PTO/NewRequestViewModel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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

  // We use react-hook-form for local state
  const form = useForm<NewRequestFormValues>({
    defaultValues: {
      requestDate: '',
      hours: 0,
      reason: '',
    },
  });

  async function onSubmit(data: NewRequestFormValues) {
    // 1) Validate on the client side
    const validation = viewModel.validateForm(
      data.requestDate,
      data.hours,
      data.reason
    );
    if (!validation.valid) {
      // Show errors in react-hook-form, or just do a quick toast
      if (validation.errors.requestDate) {
        form.setError('requestDate', { message: validation.errors.requestDate });
      }
      if (validation.errors.hours) {
        form.setError('hours', { message: validation.errors.hours });
      }
      if (validation.errors.reason) {
        form.setError('reason', { message: validation.errors.reason });
      }
      return;
    }

    try {
      // 2) Attempt submission via the view model
      await viewModel.submitPtoRequest(
        data.requestDate,
        data.hours,
        data.reason
      );

      // 3) On success, show a success toast
      toast({
        title: 'Request Submitted',
        description: `Successfully created a request for ${data.hours} hour(s) on ${data.requestDate}.`,
      });

      // 4) Navigate to Dashboard
      navigate('/dashboard');
      // The toast stays up by default for a while, so user will see it

    } catch (error: any) {
      // 5) On error, show a destructive toast with the message from the server
      const errMsg =
        error?.response?.data?.error || 'Failed to submit PTO request';

      toast({
        title: 'Error',
        description: errMsg,
        variant: 'destructive',
      });
    }
  }

  function handleDateSelect(date: Date | undefined, onChange: (value: string) => void) {
    if (!date) return;
    const formatted = format(date, 'MM/dd/yyyy');
    onChange(formatted);
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
          {/* Date Field */}
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
                      // The date object for the string
                      selected={
                        field.value
                          ? viewModel.parseDateString(field.value)
                          : undefined
                      }
                      disabled={viewModel.isDateDisabled}
                      onSelect={(date) => handleDateSelect(date, field.onChange)}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Hours Field */}
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

          {/* Reason Field */}
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reason</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Vacation, appointment, etc."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-flow-col gap-4">
            <Button type="submit" className="relative">
              <span>Submit</span>
              {/* If you want a spinner, handle store’s loading, or your own local loading. */}
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
});
