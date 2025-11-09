import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "#2d8cf0",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <div className="text-gray-600 text-xs lg:text-sm font-medium">
          {title}
        </div>
        <div
          className="p-2 lg:p-3 rounded-lg shrink-0"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-5 h-5 lg:w-6 lg:h-6" style={{ color }} />
        </div>
      </div>
      <div className="text-2xl lg:text-3xl text-gray-900 mb-2 font-bold">
        {value}
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-xs lg:text-sm">
          {trend.isPositive ? (
            <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-3 h-3 lg:w-4 lg:h-4 text-red-500" />
          )}
          <span
            className={
              trend.isPositive
                ? "text-green-500 font-medium"
                : "text-red-500 font-medium"
            }
          >
            {trend.value}
          </span>
          <span className="text-gray-500 hidden sm:inline">vs last month</span>
          <span className="text-gray-500 sm:hidden">vs last mo.</span>
        </div>
      )}
    </div>
  );
}
