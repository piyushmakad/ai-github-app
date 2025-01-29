"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useProject from "@/hooks/use-project";
import useRefetch from "@/hooks/use-refetch";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import {
  Bot,
  CreditCard,
  LayoutDashboardIcon,
  Plus,
  Presentation,
  Trash,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

export function AppSideBar() {
  const { open } = useSidebar();
  const { projects, projectId, setProjectId } = useProject();
  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Q&A",
      url: "/qa",
      icon: Bot,
    },
    {
      title: "Meetings",
      url: "/meetings",
      icon: Presentation,
    },
  ];
  const deleteProject = api.project.deleteProject.useMutation();
  // const projects = [
  //   {
  //     name: "Project 1",
  //   },
  //   {
  //     name: "Project 2",
  //   },
  //   {
  //     name: "Project 3",
  //   },
  // ];

  const pathname = usePathname();
  const refetch = useRefetch();
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={40} height={40} />
          {open && (
            <h1 className="text-xl font-bold text-primary/80">AutoGitAi</h1>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={cn(
                          {
                            "!bg-primary !text-white": pathname === item.url,
                          },
                          "list-none",
                        )}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects?.map((project) => {
                return (
                  <SidebarMenuItem key={project.name} className="flex items-center justify-between">
                    <SidebarMenuButton asChild>
                      <div
                        onClick={() => {
                          setProjectId(project.id);
                        }}
                      >
                        <div
                          className={cn(
                            "flex size-6 items-center justify-center rounded-sm bg-white text-sm text-primary",
                            {
                              "bg-primary text-white": project.id === projectId,
                            },
                          )}
                        >
                          {project.name[0]}
                        </div>
                        <span>{project.name}</span>
                      </div>
                    </SidebarMenuButton>
                    <Button
                      className="h-7 w-7 p-2"
                      // variant="destructive"
                      onClick={() =>
                        deleteProject.mutate(
                          { projectId: project.id },
                          {
                            onSuccess: () => {
                              toast.success("Project deleted Successfully.");
                              refetch();
                            },
                          },
                        )
                      }
                      disabled={deleteProject.isPending}
                    >
                      <Trash className="size-5" />
                    </Button>
                  </SidebarMenuItem>
                );
              })}
              <div className="h-2"> </div>
              {open && (
                <SidebarMenuItem>
                  <Link href={"/create"}>
                    <Button size="sm" variant={"outline"} className="w-fit">
                      <Plus />
                      Create Project
                    </Button>
                  </Link>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
