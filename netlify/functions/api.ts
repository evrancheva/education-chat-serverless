import serverless from "serverless-http";
import express, { Router } from "express";
import handleQuestion from "../utils/openAi";

const api = express();

const router = Router();

router.get("/ask", handleQuestion);

api.use("/api/", router);

export const handler = serverless(api);
