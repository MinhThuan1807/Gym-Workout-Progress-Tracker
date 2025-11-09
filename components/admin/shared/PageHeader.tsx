'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: React.ReactNode;
}

export function PageHeader({ title, breadcrumbs, action }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {item.path ? (
                <Link href={item.path} className="hover:text-[#2d8cf0] transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900">{item.label}</span>
              )}
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="w-4 h-4" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-gray-900">{title}</h1>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
