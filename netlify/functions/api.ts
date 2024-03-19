import serverless from "serverless-http";
import express, { Router } from "express";
import handleUserQuestion from "../utils/openAi";

const api = express();

const router = Router();

router.get("/ask", handleUserQuestion);

api.use("/api/", router);

export const handler = serverless(api);
