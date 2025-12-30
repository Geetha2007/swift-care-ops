import { Calendar, DollarSign, Receipt, Users } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ServiceChart } from "@/components/dashboard/ServiceChart";
import { RecentAppointments } from "@/components/dashboard/RecentAppointments";
import { TodaySchedule } from "@/components/dashboard/TodaySchedule";
import { stats } from "@/data/mockData";

export default function Dashboard() {
  return (
    <AppLayout
      title="Dashboard"
      subtitle="Welcome back! Here's your business overview."
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Appointments"
            value={stats.totalAppointments}
            change={stats.appointmentsChange}
            icon={Calendar}
          />
          <StatCard
            title="Revenue"
            value={stats.revenue}
            change={stats.revenueChange}
            icon={DollarSign}
            prefix="$"
          />
          <StatCard
            title="Expenses"
            value={stats.expenses}
            change={stats.expensesChange}
            icon={Receipt}
            prefix="$"
          />
          <StatCard
            title="Staff Members"
            value={stats.staffCount}
            change={stats.staffChange}
            icon={Users}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RevenueChart />
          <ServiceChart />
        </div>

        {/* Bottom Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentAppointments />
          </div>
          <TodaySchedule />
        </div>
      </div>
    </AppLayout>
  );
}
