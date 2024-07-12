const axios = require("axios");
require("dotenv").config();

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const FIGMA_TEAM_ID = process.env.FIGMA_TEAM_ID;
const WEBHOOK_PASSCODE = process.env.WEBHOOK_PASSCODE;
const ENDPOINT = process.env.WEBHOOK_ENDPOINT;

const url = "https://api.figma.com/v2/webhooks/744533";
const headers = {
  "X-Figma-Token": FIGMA_TOKEN,
  "Content-Type": "application/json",
};
const data = {
  event_type: "FILE_COMMENT",
  team_id: FIGMA_TEAM_ID,
  endpoint: ENDPOINT,
  passcode: WEBHOOK_PASSCODE,
  description: "Webhook for file comments",
};
