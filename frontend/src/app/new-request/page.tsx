import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parse, isValid, isBefore, endOfYesterday } from 'date-fns';
import { useState } from 'react';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import { useToast } from '@/hooks/use-toast';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// **Import a loader icon** from lucide-react or your icon set
import { Loader2 } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const requestSchema = z.object({
    requestDate: z.string().nonempty('Please select a date.'),
    hours: z.coerce.number().min(1, 'Hours must be at least 1.'),
    reason: z.string().min(1, 'Reason is required.'),
});

export default function NewRequestPage() {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [open, setOpen] = useState(false); // controls date popover
    const [loading, setLoading] = useState(false); // controls loader in the submit button

    const form = useForm<z.infer<typeof requestSchema>>({
        resolver: zodResolver(requestSchema),
        defaultValues: {
            requestDate: '',
            hours: 0,
            reason: '',
        },
    });

    function parseDateString(dateStr: string): Date | undefined {
        if (!dateStr) return undefined;
        const parsed = parse(dateStr, 'MM/dd/yyyy', new Date());
        return isValid(parsed) ? parsed : undefined;
    }

    async function onSubmit(values: z.infer<typeof requestSchema>) {
        const token = localStorage.getItem('token');
        if (!token) {
            toast({
                title: 'Not logged in',
                description: 'Please log in to submit a PTO request.',
                variant: 'destructive',
            });
            return;
        }

        try {
            setLoading(true); // show spinner
            const headers = { Authorization: `Bearer ${token}` };
            await axios.post('/pto/request', values, { headers });

            toast({
                title: 'Success',
                description: 'PTO request submitted successfully!',
            });
            navigate('/dashboard');
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err?.response?.data?.error || 'Submission failed',
                variant: 'destructive',
            });
        } finally {
            // Keep the button in loading state for a moment if you'd like, or reset it:
            setLoading(false);
        }
    }

    return (
        <div className="max-w-[400px] w-full mx-auto pt-24">
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
                        render={({ field }) => {
                            const selectedDate = parseDateString(field.value);
                            return (
                                <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        'w-full justify-start text-left font-normal',
                                                        !field.value && 'text-muted-foreground',
                                                    )}
                                                >
                                                    {field.value ? field.value : 'Pick a date'}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                initialFocus
                                                selected={selectedDate}
                                                disabled={(date) =>
                                                    isBefore(date, endOfYesterday())
                                                }
                                                onSelect={(date) => {
                                                    if (date) {
                                                        field.onChange(
                                                            format(date, 'MM/dd/yyyy'),
                                                        );
                                                        setOpen(false);
                                                    }
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

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
                        <Button type="submit" disabled={loading} className="relative">
                            {/* This span is our normal button text. We hide it if loading */}
                            <span className={loading ? 'opacity-0' : ''}>Submit</span>

                            {/* If loading, place spinner on top */}
                            {loading && (
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
}
