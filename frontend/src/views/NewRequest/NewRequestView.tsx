import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { NewRequestViewModel } from '@/viewModels/PTO/NewRequestViewModel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CalendarIcon } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';

interface NewRequestViewProps {
 viewModel: NewRequestViewModel;
}

export const NewRequestView = observer(({ viewModel }: NewRequestViewProps) => {
 const navigate = useNavigate();
 const [calendarOpen, setCalendarOpen] = useState(false);
 const form = useForm();

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   const { valid } = viewModel.validateForm();
   
   if (!valid) {
     return;
   }

   const success = await viewModel.submitRequest();
   if (success) {
     navigate('/dashboard');
   }
 };

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
       <form onSubmit={handleSubmit} className="space-y-4">
         <FormField
           control={form.control}
           name="requestDate"
           render={() => (
             <FormItem>
               <FormLabel>Date</FormLabel>
               <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                 <PopoverTrigger asChild>
                   <FormControl>
                     <Button
                       variant="outline"
                       className={cn(
                         'w-full justify-start text-left font-normal',
                         !viewModel.requestDate && 'text-muted-foreground'
                       )}
                     >
                       {viewModel.requestDate || 'Pick a date'}
                       <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                     </Button>
                   </FormControl>
                 </PopoverTrigger>
                 <PopoverContent className="p-0" align="start">
                   <Calendar
                     mode="single"
                     initialFocus
                     selected={viewModel.parseDateString(viewModel.requestDate)}
                     disabled={viewModel.isDateDisabled}
                     onSelect={(date) => {
                       if (date) {
                         viewModel.setRequestDate(format(date, 'MM/dd/yyyy'));
                         setCalendarOpen(false);
                       }
                     }}
                   />
                 </PopoverContent>
               </Popover>
               <FormMessage />
             </FormItem>
           )}
         />

         <FormField
           control={form.control}
           name="hours"
           render={() => (
             <FormItem>
               <FormLabel>Hours</FormLabel>
               <FormControl>
                 <Input 
                   type="number" 
                   value={viewModel.hours}
                   onChange={(e) => viewModel.setHours(Number(e.target.value))}
                 />
               </FormControl>
               <FormMessage />
             </FormItem>
           )}
         />

         <FormField
           control={form.control}
           name="reason"
           render={() => (
             <FormItem>
               <FormLabel>Reason</FormLabel>
               <FormControl>
                 <Textarea
                   placeholder="Vacation, appointment, etc."
                   value={viewModel.reason}
                   onChange={(e) => viewModel.setReason(e.target.value)}
                 />
               </FormControl>
               <FormMessage />
             </FormItem>
           )}
         />

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