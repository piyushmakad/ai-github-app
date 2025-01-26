"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useRefetch from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const  createProject =api.project.createProject.useMutation();
  const refetch = useRefetch()

  function onSubmit(data: FormInput) {
    window.alert(JSON.stringify(data, null, 2));
    createProject.mutate({
        githubUrl: data.repoUrl,
        name: data.projectName,
        githubToken: data.githubToken
    }, {
        onSuccess: ()=> {
            toast.success("Project Created Successfully.")
            refetch()
            reset()
        },
        onError: ()=> {
            toast.error("Failed To Created Project")
        }
    })
    return true;
  }
  return (
    <div className="flex h-full items-center justify-center gap-12">
      <img
        src="/gitImage.png"
        alt="gitImage"
        className="h-56 w-auto rounded-full"
      />
      <div>
        <div>
          <h1 className="text-2xl font-semibold">
            Link Your Github Repository
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the URL of your repository to link it to AutoGitAi
          </p>
        </div>
        <div className="h-4"></div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register("repoUrl", { required: true })}
              placeholder="Repository Url"
              required
            />
            <div className="h-2"></div>
            <Input
              {...register("projectName", { required: true })}
              placeholder="Project Name"
              required
            />
            <div className="h-2"></div>
            <Input
              {...register("githubToken")}
              placeholder="Github Token (optional)"
            />
            <div className="h-4"></div>
            <Button type="submit" disabled={createProject.isPending}>Create Project</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
