import { Handler } from "@netlify/functions";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_APIKEY || "",
});

const handler: Handler = async (event, context) => {
  try {
    // Check if the request method is GET
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: "Method Not Allowed" }),
      };
    }

    // Parse the request body as JSON
    const requestBody = JSON.parse(event.body || "");
    const { messages } = requestBody;

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid request body" }),
      };
    }

    // Call OpenAI's completions.create method with the provided messages
    const response = await openai.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo",
      temperature: 1,
    });

    const text = response.choices[0].message.content;
    // Return the response from OpenAI
    return {
      statusCode: 200,
      body: JSON.stringify({ response: text }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

export { handler };
