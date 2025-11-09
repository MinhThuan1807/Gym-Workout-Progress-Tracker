"use client";
import React, { createContext, useState } from "react";

type AdminPage =
  | "dashboard"
  | "profile"
  | "account"
  | "users"
  | "muscle-groups"
  | "exercises"
  | "exercises-new"
  | "exercises-edit"
  | "blogs"
  | "blogs-new"
  | "blogs-edit"
  | "settings";

interface RouterContextProps {
  currentPage: AdminPage;
  navigate: (page: AdminPage, params?: Record<string, any>) => void;
  params?: Record<string, any>;
}
export const RouterContext = createContext<RouterContextProps>({
  currentPage: "dashboard",
  navigate: () => {},
  params: {},
});

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentPage, setCurrentPage] = useState<AdminPage>("dashboard");

  const navigate = (page: AdminPage) => {
    setCurrentPage(page);
  };
  return (
    <RouterContext.Provider value={{ currentPage, navigate, params: {} }}>
      {children}
    </RouterContext.Provider>
  );
};
