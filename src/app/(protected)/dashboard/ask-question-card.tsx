"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import useProject from "@/hooks/use-project";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import Image from "next/image";
import React from "react";
import { askQuestion } from "./action";
import { readStreamableValue } from "ai/rsc";
import MDEditor from "@uiw/react-md-editor";
import { CodeReferences } from "./code-references";
import { api } from "@/trpc/react";
import { toast } from "sonner";

const AskQuestionCard = () => {
  const { project } = useProject();
  const [question, setQuestion] = React.useState(" ");
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [answer, setAnswer] = React.useState("");
  const [filesReferences, setFilesReferences] = React.useState<
    { fileName: string; sourceCode: string; summary: string }[]
  >([]);

  const saveAnswer = api.project.saveAnswer.useMutation();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setAnswer("");
    setFilesReferences([]);
    e.preventDefault();
    if (!project?.id) return;
    setLoading(true);

    const { output, filesReferences } = await askQuestion(question, project.id);
    setOpen(true);
    setFilesReferences(filesReferences);

    for await (const delta of readStreamableValue(output)) {
      //taking token(delta) one by one and appendig in ans
      if (delta) {
        setAnswer((ans) => ans + delta);
      }
    }
    setLoading(false);
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[80vw] m-5">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle>
                <Image src="/logo.png" alt="autogitai" width={40} height={40} />
                Ask a question!
              </DialogTitle>
              <Button
                disabled={saveAnswer.isPending}
                onClick={() => {
                  saveAnswer.mutate(
                    {
                      projectId: project!.id,
                      question,
                      answer,
                      filesReferences,
                    },
                    {
                      onSuccess: () => {
                        toast.success("Answer Saved");
                      },
                      onError: () => {
                        toast.error("Failed to save answer!");
                      },
                    },
                  );
                }}
                variant={"outline"}
              >
                Save Answer
              </Button>
            </div>
          </DialogHeader>
          <MDEditor.Markdown
            source={answer}
            className="!h-full max-h-[40vh] max-w-[70vw] overflow-scroll"
          />
          <div className="h-4"></div>
          <CodeReferences filesReferences={filesReferences} />
          <Button type="button" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
      <Card className="relative col-span-3">
        <CardHeader>
          <CardTitle>Ask a question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <Textarea
              placeholder="Which file should I edit to change the home page?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div className="h-4"></div>
            <Button type="submit" disabled={loading}>
              Ask AutoGitAi!
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AskQuestionCard;
