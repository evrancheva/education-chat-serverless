import { Handler } from "@netlify/functions";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_APIKEY || "",
});

const handler: Handler = async (event, context) => {
  try {
    // Check if the request method is GET
    if (event.httpMethod !== "GET") {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: "Method Not Allowed" }),
      };
    }

    // Get the query parameter from the URL
    const { q } = event.queryStringParameters || {};
    if (!q) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing queryParam" }),
      };
    }

    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: q }],
      model: "gpt-3.5-turbo",
    });
    const text = response.choices[0].message.content;
    // Return the response from OpenAI
    return {
      statusCode: 200,
      body: JSON.stringify({ response: text }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
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
