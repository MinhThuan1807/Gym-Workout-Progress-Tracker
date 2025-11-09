"use client";

import { Users, Dumbbell, Activity, TrendingUp } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "../shared/PageHeader";
import { StatCard } from "../shared/StatCard";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";

const recentActivities = [
  {
    id: 1,
    user: "John Smith",
    action: "Created new workout plan",
    date: "2 hours ago",
    type: "success",
  },
  {
    id: 2,
    user: "Sarah Johnson",
    action: "Completed Chest & Triceps workout",
    date: "3 hours ago",
    type: "info",
  },
  {
    id: 3,
    user: "Mike Wilson",
    action: "Updated profile information",
    date: "5 hours ago",
    type: "warning",
  },
  {
    id: 4,
    user: "Emily Davis",
    action: "Joined Advanced Training program",
    date: "1 day ago",
    type: "success",
  },
  {
    id: 5,
    user: "David Brown",
    action: "Added new exercise to library",
    date: "1 day ago",
    type: "info",
  },
];

export function Dashboard() {
  return (
    <div className="p-4 lg:p-6">
      <PageHeader
        title="Dashboard Overview"
        breadcrumbs={[{ label: "Dashboard" }]}
      />

      <div className="mb-6 bg-gradient-to-r from-[#2d8cf0] to-[#1e6bb8] text-white rounded-lg p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl lg:text-2xl mb-2">
              Welcome back, Admin! 👋
            </h2>
            <p className="text-blue-100 text-sm lg:text-base">
              Here's what's happening with your fitness platform today.
            </p>
          </div>
          <Link href="/admin/dashboard">
            <button
              onClick={() =>
                toast.success("Dashboard data refreshed successfully!")
              }
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm lg:text-base whitespace-nowrap"
            >
              Refresh Data
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <StatCard
          title="Total Users"
          value="2,847"
          icon={Users}
          trend={{ value: "+12.5%", isPositive: true }}
          color="#2d8cf0"
        />
        <StatCard
          title="Total Exercises"
          value="342"
          icon={Dumbbell}
          trend={{ value: "+8.2%", isPositive: true }}
          color="#27ae60"
        />
        <StatCard
          title="Muscle Groups"
          value="24"
          icon={Activity}
          color="#e74c3c"
        />
        <StatCard
          title="Active Workout Plans"
          value="1,234"
          icon={TrendingUp}
          trend={{ value: "+15.3%", isPositive: true }}
          color="#f39c12"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="xl:col-span-2 bg-white rounded-lg shadow-sm">
          <div className="p-4 lg:p-6 border-b border-gray-200">
            <h3 className="text-lg lg:text-xl text-gray-900 font-medium">
              Recent Activity
            </h3>
          </div>
          {/* Mobile: Card layout */}
          <div className="block lg:hidden">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {activity.user}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.action}
                    </p>
                  </div>
                  <Badge
                    variant={
                      activity.type === "success"
                        ? "default"
                        : activity.type === "warning"
                        ? "secondary"
                        : "outline"
                    }
                    className={`ml-2 shrink-0 ${
                      activity.type === "success"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : activity.type === "warning"
                        ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    {activity.type}
                  </Badge>
                </div>
                <span className="text-xs text-gray-400">{activity.date}</span>
              </div>
            ))}
          </div>
          {/* Desktop: Table layout */}
          <div className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">
                      {activity.user}
                    </TableCell>
                    <TableCell>{activity.action}</TableCell>
                    <TableCell className="text-gray-500">
                      {activity.date}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          activity.type === "success"
                            ? "default"
                            : activity.type === "warning"
                            ? "secondary"
                            : "outline"
                        }
                        className={
                          activity.type === "success"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : activity.type === "warning"
                            ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        }
                      >
                        {activity.type}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
          <h3 className="text-lg lg:text-xl text-gray-900 mb-4 font-medium">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => toast.info("Navigate to create new exercise")}
              className="w-full p-3 lg:p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#2d8cf0] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                  <Dumbbell className="w-4 h-4 lg:w-5 lg:h-5 text-[#2d8cf0]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-gray-900 font-medium">Add Exercise</div>
                  <div className="text-xs lg:text-sm text-gray-500 truncate">
                    Create a new workout
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => toast.info("Navigate to create muscle group")}
              className="w-full p-3 lg:p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#2d8cf0] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg shrink-0">
                  <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-[#e74c3c]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-gray-900 font-medium">
                    Add Muscle Group
                  </div>
                  <div className="text-xs lg:text-sm text-gray-500 truncate">
                    Define muscle category
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => toast.info("Navigate to user management")}
              className="w-full p-3 lg:p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#2d8cf0] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg shrink-0">
                  <Users className="w-4 h-4 lg:w-5 lg:h-5 text-[#27ae60]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-gray-900 font-medium">View Users</div>
                  <div className="text-xs lg:text-sm text-gray-500 truncate">
                    Manage user accounts
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
