import { Calendar, DollarSign, Users, UserCheck } from "lucide-react";
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
      subtitle="Welcome back! Here's your salon at a glance."
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Today's Appointments"
            value={stats.totalAppointments}
            change={stats.appointmentsChange}
            icon={Calendar}
            variant="primary"
          />
          <StatCard
            title="Monthly Revenue"
            value={stats.revenue}
            change={stats.revenueChange}
            icon={DollarSign}
            prefix="$"
            variant="gold"
          />
          <StatCard
            title="Total Customers"
            value={stats.customers}
            change={stats.customersChange}
            icon={UserCheck}
          />
          <StatCard
            title="Active Staff"
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
