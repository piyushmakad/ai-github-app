import { AssemblyAI } from "assemblyai";
import { CustomError } from "./CustomError";

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLY_API_KEY!,
});

function msToTime(ms: number) {
  const seconds = ms / 100;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")} :${remainingSeconds.toString().padStart(2, "0")}`;
}

export const processMeeting = async (meetingUrl: string) => {
  const transcrpit = await client.transcripts.transcribe({
    audio: meetingUrl,
    auto_chapters: true,
  });

  const summaries =
    transcrpit.chapters?.map((chapter) => ({
      start: msToTime(chapter.start),
      end: msToTime(chapter.end),
      gist: chapter.gist,
      headline: chapter.headline,
      summary: chapter.summary,
    })) || [];

  if (!transcrpit.text) throw new CustomError("No Transcript Found.", 404);

  return {
    summaries,
  };
};
