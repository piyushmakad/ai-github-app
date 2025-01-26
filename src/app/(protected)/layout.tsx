import { SidebarProvider } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import React from "react";
import { AppSideBar } from "./app-sidebar";

type Props = {
  children: React.ReactNode;
};
const SidebarLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <AppSideBar/>
      <main className="m-2 w-full">
        <div className="flex items-center gap-2 rounded-md border border-sidebar-border bg-sidebar p-2 px-4 shadow">
          {/* <SearchBar/> */}
          <div className="ml-auto"></div>
          <UserButton />
        </div>
        <div className="h-4"></div>
        {/* main content */}
        <div className="border-sidebar-border bg-sidebar border shadow overflow-y-scroll rounded-md h-[calc(100vh-6rem)] p-4">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default SidebarLayout;
