import { GoogleGenerativeAI } from "@google/generative-ai";
import { Document } from "@langchain/core/documents";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAi.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const aisummariseCommit = async (diff: string) => {
  console.log("Ai summarizer");
  // https://github.com/owner/repo/commit/commithash.diff
//   const response = await model.generateContent([
//     `You are an expert programmer, and you are trying to summarize a git diff.
// Reminders about the git diff format:
// For every file, there are a few metadata lines, like (for example):
// \`\`\`
// diff --git a/lib/index.js b/lib/index.js
// index aadf691..bfef603 100644
// --- a/lib/index.js
// +++ b/lib/index.js
// \`\`\`
// This means that \`lib/index.js\` was modified in this commit. Note that this is only an example
// Then there is a specifier of the lines that were modified.
// line starting with \`+\` means it was added.
// A line that starting with \`-\` means that line was deleted.
// A line that starts with neither \`+\`nor \`-\`is code given for context and better understanding
// It is not part of the diff.
// [...]
// EXAMPLE SUMMARY COMMENTS:
// \`\`\`
// Raised the amount of returned recordings from \`10\` to \`100\` [packages/server/recordings_api.ts], [packages/server/constants.ts]
// Fixed a typo in the github action name [.github/workflows/gpt-commit-summarizer.yml]
// Moved the \`octokit\` initialization to a separate file [src/ootokit.ts], [src/index.ts]
// Added an OpenAI API for completions [packages/utils/apis/openai.ts]
// Lowered numeric tolerance for test files
// \`\`\`
// Most commits will have less comments than this examples list.
// The last comment does not include the file names,
// because there were more than two relevant files in the hypothetical commit.
// Do not include parts of the example in your summary.
// It is given only as an example of appropriate comments. `,
//     `Please summarise the following diff file: \n\n${diff}`,
//   ]);

const response = await model.generateContent([`
  You are an expert programmer, and your task is to summarize a git diff.
  
  Here are the rules for understanding the git diff format:
  - Metadata lines: 
    \`\`\`
    diff --git a/lib/index.js b/lib/index.js
    index aadf691..bfef603 100644
    --- a/lib/index.js
    +++ b/lib/index.js
    \`\`\`
    This means \`lib/index.js\` was modified.
  
  - Lines starting with \`+\` indicate additions.
  - Lines starting with \`-\` indicate deletions.
  - Context lines (neither \`+\` nor \`-\`) are for understanding but are not part of the diff.
  
  EXAMPLE SUMMARY COMMENTS:
  \`\`\`
  - "Raised the amount of returned recordings from 10 to 100 [packages/server/recordings_api.ts], [packages/server/constants.ts]"
  - "Fixed a typo in the GitHub action name [.github/workflows/gpt-commit-summarizer.yml]"
  - "Moved \`octokit\` initialization to a separate file [src/octokit.ts], [src/index.ts]"
  - "Added an OpenAI API for completions [packages/utils/apis/openai.ts]"
  \`\`\`
  Most commits will have fewer comments than this. Omit file names when there are more than two relevant files.
  
  Now, summarize the following git diff:
  ${diff}
  `]);

  return response.response.text();
};

export async function summariseCode(doc: Document) {
  try {
    console.log("Getting summary for:", doc.metadata.source);
    const code = doc.pageContent.slice(0, 10000); //limits to 1000 char
    const response = await model.generateContent([
      `You are an intelligent senior software engineer who specialises in onboarding junior software engineers onto projects`,
      `You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file
        Here is the code: 
        ---
       ${code}
        ---
                Give a summary no more than 100 words of the above code`,
    ]);

    return response.response.text();
  } catch (error) {
    return " ";
  }
}

export async function generateEmbeddingVector(summary: string) {
  //generate a vector (2d array type) which give closeness between documents - all values here
  const model = genAi.getGenerativeModel({
    model: "text-embedding-004",
  });
  const result = await model.embedContent(summary);
  const embedding = result.embedding;
  return embedding.values;
}
