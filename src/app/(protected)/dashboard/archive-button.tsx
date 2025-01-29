"use client";

import { Button } from "@/components/ui/button";
import useProject from "@/hooks/use-project";
import useRefetch from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import React from "react";
import { toast } from "sonner";

const ArchiveButton = () => {
  const archiveProject = api.project.archiveProject.useMutation();
  const { projectId } = useProject();
  const refetch = useRefetch();
  return (
    <Button
      disabled={archiveProject.isPending}
      size='sm'
      variant='destructive'
      onClick={() => {
        const confirm = window.confirm(
          "Are you sure you want to archieve this project?",
        );
        if (confirm) {
          archiveProject.mutate(
            { projectId },
            {
              onSuccess: () => {
                toast.success("Project archieved.");
                refetch();
              },
              onError: () => {
                toast.error("Failed to archieve project.");
              },
            },
          );
        }
      }}
    >
      Archieve Project
    </Button>
  );
};

export default ArchiveButton;
