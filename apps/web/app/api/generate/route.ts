import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";
import { match } from "ts-pattern";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";

// Create an OpenAI API client (that's edge friendly!)
// Using LLamma's OpenAI client:

// IMPORTANT! Set the runtime to edge: https://vercel.com/docs/functions/edge-functions/edge-runtime
//export const runtime = "edge";

/*const apiKey= process.env.OPENAI_API_KEY
  const llama = new OpenAI({
  apiKey: "ollama",
  baseURL: "http://localhost:11434/v1",
}); */

export const maxDuration = 60 

export async function POST(req: Request): Promise<Response> {

  //OpenAI接口
/*   const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
  });
  // Check if the OPENAI_API_KEY is set, if not return 400
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "") {
    return new Response(
      "Missing OPENAI_API_KEY - make sure to add it to your .env file.",
      {
        status: 400,
      },
    );
  }
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const ip = req.headers.get("x-forwarded-for");
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(50, "1 d"),
    });

    const { success, limit, reset, remaining } = await ratelimit.limit(
      `novel_ratelimit_${ip}`,
    );

    if (!success) {
      return new Response("You have reached your request limit for the day.", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }
  } */

  let { prompt, option, command } = await req.json();
  const messages = match(option)
    .with("translate", () => [
      {
        role: "user",
        content: `translate: ${prompt}`,
      },
    ])
    .with("shorter", () => [
      {
        role: "user",
        content: `Make shorter: ${prompt}`,
      },
    ])
    .with("longer", () => [
      {
        role: "user",
        content: `Make longer: ${prompt}`,
      },
    ])
    .with("refine", () => [
      {
        role: "user",
        content: `refine usecase: ${prompt}`,
      },
    ])
    .with("testcase", () => [
      {
        role: "user",
        content: `generate testcase: ${prompt}.`,
      },
    ])
    .with("requirement", () => [
      {
        role: "user",
        content: `generate requirement: ${prompt}. `,
      },
    ])
    .with("fmea", () => [
      {
        role: "user",
        content: `FMEA analysis: ${prompt}. `,
      },
    ])
    .with("sequence", () => [
      {
        role: "user",
        content: `generate sequence diagram: ${prompt}. `,
      },
    ])
    .with("zap", () => [
      {
        role: "system",
        content:
          "You area an AI writing assistant that generates text based on a prompt. " +
          "You take an input from the user and a command for manipulating the text" +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `For this text: ${prompt}. You have to respect the command: ${command}`,
      },
    ])
    .run() as ChatCompletionMessageParam[];

    //OpenAI接口
/*   // const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    n: 1,
  }); */

  const response = await fetch(`${process.env.DIFY2OPENAI_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DIFY_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'dify',
      stream: true,
      messages,
    }),
  });


  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}