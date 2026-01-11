import { Download, CreditCard, Banknote, Search, Filter, Sparkles } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { invoices, stats } from "@/data/mockData";
import { cn } from "@/lib/utils";

const statusStyles = {
  paid: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  overdue: "bg-destructive/10 text-destructive border-destructive/20",
};

const methodIcons = {
  card: CreditCard,
  cash: Banknote,
};

export default function Billing() {
  const paidTotal = invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0);
  const pendingTotal = invoices.filter(i => i.status === "pending").reduce((sum, i) => sum + i.amount, 0);
  const overdueTotal = invoices.filter(i => i.status === "overdue").reduce((sum, i) => sum + i.amount, 0);

  return (
    <AppLayout title="Billing" subtitle="Manage invoices and payments">
      <div className="space-y-6 animate-fade-in">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="shadow-soft border-success/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Paid</p>
                  <p className="text-2xl font-heading font-bold text-success">₹{paidTotal.toLocaleString()}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft border-warning/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-heading font-bold text-warning">₹{pendingTotal.toLocaleString()}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft border-destructive/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-heading font-bold text-destructive">₹{overdueTotal.toLocaleString()}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Banknote className="h-5 w-5 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoices Table */}
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-lg font-heading">Recent Invoices</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{invoices.length} total invoices</p>
            </div>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search invoices..." className="pl-9" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => {
                  const MethodIcon = methodIcons[invoice.method];
                  return (
                    <TableRow key={invoice.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.client}</TableCell>
                      <TableCell className="text-muted-foreground">{invoice.date}</TableCell>
                      <TableCell className="font-heading font-semibold">₹{invoice.amount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MethodIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="capitalize text-sm">{invoice.method}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("capitalize", statusStyles[invoice.status])}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Download className="h-4 w-4" /> Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
