import { useState } from "react";
import { Plus, Search, Filter, Calendar, TrendingUp, Package, Zap, Megaphone, Shield, Palette } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { expenses, expenseCategories } from "@/data/mockData";

const categoryIcons: Record<string, any> = {
  Products: Package,
  Equipment: Zap,
  Training: TrendingUp,
  Utilities: Zap,
  Marketing: Megaphone,
  Insurance: Shield,
  Decor: Palette,
};

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function Expenses() {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <AppLayout title="Expenses" subtitle="Track and manage your salon expenses">
      <div className="space-y-6 animate-fade-in">
        {/* Summary Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Total Expenses Card */}
          <Card className="shadow-soft gradient-primary text-primary-foreground">
            <CardContent className="p-6">
              <p className="text-white/80 text-sm">Total Expenses (This Month)</p>
              <p className="text-3xl font-heading font-bold mt-1">${totalExpenses.toLocaleString()}</p>
              <p className="text-white/70 text-sm mt-2">-5.2% from last month</p>
            </CardContent>
          </Card>

          {/* Expense Breakdown Chart */}
          <Card className="shadow-soft lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-heading">Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="total"
                    >
                      {expenseCategories.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                    />
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      iconType="circle"
                      iconSize={8}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expense List */}
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-lg font-heading">Recent Expenses</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{expenses.length} transactions</p>
            </div>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search expenses..." className="pl-9" />
              </div>
              <Button variant="outline" size="icon">
                <Calendar className="h-4 w-4" />
              </Button>
              <Button className="gradient-primary shadow-luxury">
                <Plus className="mr-2 h-4 w-4" /> Add Expense
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => {
                  const CategoryIcon = categoryIcons[expense.category] || Package;
                  return (
                    <TableRow key={expense.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{expense.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <CategoryIcon className="h-3 w-3" />
                          {expense.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{expense.date}</TableCell>
                      <TableCell className="text-right font-heading font-semibold text-destructive">
                        -${expense.amount.toLocaleString()}
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
