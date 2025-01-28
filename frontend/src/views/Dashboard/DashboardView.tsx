import { observer } from 'mobx-react-lite';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/Skeletons";
import { Link } from "react-router-dom";
import { DashboardViewModel } from '@/viewModels/PTO/DashboardViewModel';

// Define props interface for type safety
interface DashboardViewProps {
  viewModel: DashboardViewModel;
}

// Create the view component as an observer to react to viewModel changes
export const DashboardView = observer(({ viewModel }: DashboardViewProps) => {
  // Destructure commonly used values from viewModel
  const { isLoading, error, balanceCards, sortedRequests } = viewModel;

  return (
    <div className="mx-auto w-full max-w-6xl pt-24 p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Balance Cards Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {balanceCards.map((card, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-5xl font-bold">
                {card.value}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* PTO Requests Section */}
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
          {isLoading ? (
            // Render skeleton rows while loading
            Array.from({ length: 5 }).map((_, idx) => (
              <TableRow key={idx}>
                <TableCell><Skeleton className="h-4 w-[140px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
              </TableRow>
            ))
          ) : (
            sortedRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.requestDate}</TableCell>
                <TableCell>{request.hours}</TableCell>
                <TableCell>{request.reason}</TableCell>
                <TableCell>
                  <Badge 
                    variant={viewModel.getBadgeVariant(request.status)} 
                    className="capitalize"
                  >
                    {request.status || "unknown"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
});