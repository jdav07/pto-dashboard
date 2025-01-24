// src/app/dashboard/page.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PtoBalance {
    maxHours: number;
    usedHours: number;
    remainingHours: number;
}

interface PtoRequest {
    id: number;
    userId: number;
    requestDate: string;
    hours: number;
    reason: string;
    status?: string;
}

export default function DashboardPage() {
    const [balance, setBalance] = useState<PtoBalance>();
    const [requests, setRequests] = useState<PtoRequest[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) return;

        const fetchData = async () => {
            try {
                const headers = { Authorization: `Bearer ${token}` };
                const balanceRes = await axios.get('/pto/balance', { headers });
                setBalance(balanceRes.data);

                const requestsRes = await axios.get('/pto/requests', { headers });
                setRequests(requestsRes.data);
            } catch (err: any) {
                setError(err.response?.data?.error || 'Unable to fetch data');
            }
        };

        fetchData();
    }, []);

    function getBadgeVariant(status?: string) {
        switch (status) {
            case 'pending':
                return 'secondary';
            case 'approved':
                return 'default';
            case 'denied':
                return 'destructive';
            default:
                return 'outline';
        }
    }

    // Sort requests by date (most recent first)
    const sortedRequests = [...requests].sort(
        (a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime(),
    );

    return (
        <div className="mx-auto w-full max-w-6xl pt-24 p-6 space-y-8">
            <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Summary Cards */}
            {balance && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Max Hours</CardTitle>
                            <CardDescription>Allotted PTO Hours</CardDescription>
                        </CardHeader>
                        <CardContent className="text-5xl font-bold">
                            {balance.maxHours}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Used Hours</CardTitle>
                            <CardDescription>How many used so far</CardDescription>
                        </CardHeader>
                        <CardContent className="text-5xl font-bold">
                            {balance.usedHours}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Remaining</CardTitle>
                            <CardDescription>Remaining PTO Hours</CardDescription>
                        </CardHeader>
                        <CardContent className="text-5xl font-bold">
                            {balance.remainingHours}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* PTO Requests Table */}
            <div className="flex justify-between items-center">
                <h2 className="text-1xl font-bold">PTO Requests</h2>
                <Button asChild>
                    <Link to="/new-request" className="hover:text-background">
                        Submit New PTO Request
                    </Link>
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[140px]">Date</TableHead>
                        <TableHead className="w-[100px]">Hours</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead className="w-[150px]">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedRequests.map((r) => (
                        <TableRow key={r.id}>
                            <TableCell>{r.requestDate}</TableCell>
                            <TableCell>{r.hours}</TableCell>
                            <TableCell>{r.reason}</TableCell>
                            <TableCell>
                                <Badge
                                    variant={getBadgeVariant(r.status)}
                                    className="capitalize"
                                >
                                    {r.status || 'unknown'}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
