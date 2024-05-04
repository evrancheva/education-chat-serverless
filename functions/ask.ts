import { Handler, HandlerResponse } from "@netlify/functions";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_APIKEY || "",
});

const handler: Handler = async (event, context): Promise<HandlerResponse> => {
  try {
    // Handle preflight OPTIONS request
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept, Authorization",
        },
        body: JSON.stringify({ message: "Preflight request successful" }),
      };
    }

    // Ignore request if it's not POST
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: "Method Not Allowed" }),
      };
    }

    // Parse the request body as JSON
    const messageHistory = JSON.parse(event.body || "");

    if (!messageHistory || !Array.isArray(messageHistory)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid request body" }),
      };
    }

    // Call OpenAI's completions.create method with the provided messages
    const response = await openai.chat.completions.create({
      messages: messageHistory,
      model: "gpt-4",
      temperature: 1,
    });

    const text = response.choices[0].message.content;
    // Return the response from OpenAI
    return {
      statusCode: 200,
      body: JSON.stringify({ response: text }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      },
    };
  } catch (error) {
    if (error.response && error.response.status === 502) {
      // Handle 502 Bad Gateway error
      console.error("502 Bad Gateway error occurred:", error.response.data);
      return {
        statusCode: 502,
        body: JSON.stringify({ message: "502 Bad Gateway Error from OpenAI" }),
      };
    } else {
      // Handle other errors
      console.error("An error occurred:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal Server Error" }),
      };
    }
  }
};

export { handler };
