"use client";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { Card } from "@/components/ui/card";
import { useDropzone } from "react-dropzone";
import React from "react";
import { uploadFile } from "@/lib/firebase";
import { Presentation, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import useProject from "@/hooks/use-project";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const MeetingCard = () => {
  const { project } = useProject();
  const [isUploading, setIsUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const router = useRouter()
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "audio/*": [".mp3", ".wav", ".m4a"],
    },
    multiple: false,
    maxSize: 15_000_000,
    onDrop: async (acceptedFiles) => {
      if (!project) {
        return;
      }
      setIsUploading(true);
      console.log(acceptedFiles);
      const file = acceptedFiles[0];
      if (!file) {
        return;
      }
      const donwloadUrl = (await uploadFile(
        file as File,
        setProgress,
      )) as string;
    //   window.alert(donwloadUrl);
      console.log("Uploading meeting...")
      uploadMeeting.mutate({
        projectId: project.id,
        meetingUrl: donwloadUrl,
        name: file?.name,
      },{
        onSuccess: () => {
            toast.success("Meeting upload successfully.");
            router.push('/meetings')
          },
          onError: () => {
            toast.error("Failed to upload meeting!");
          },
      });
      setIsUploading(false);
    },
  });

  const uploadMeeting = api.project.uploadMeeting.useMutation();
  return (
    <Card
      className="col-span-2 flex flex-col items-center justify-center p-10"
      {...getRootProps()}
    >
      {!isUploading && (
        <>
          <Presentation className="h-10 w-10 animate-bounce" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            Create a new meeting
          </h3>
          <p className="mt-1 text-center text-sm text-gray-500">
            Analyse your meeting with AutoGitAi.
            <br />
            Powered by AI.
          </p>
          <div className="mt-6">
            <Button disabled={isUploading}>
              <Upload className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Upload Meeting
              <input className="hidden" {...getInputProps()} />
            </Button>
          </div>
        </>
      )}
      {isUploading && (
        <div>
          <CircularProgressbar
            value={progress}
            text={`${progress}%`}
            className="size-20"
            styles={buildStyles({
              pathColor: "#2563eb",
              textColor: "#2563eb",
            })}
          />
          <p className="text-center text-sm text-gray-500">
            Uploading your meeting....
          </p>
        </div>
      )}
    </Card>
  );
};

export default MeetingCard;
