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
  endpoint: ENDPOINT,
  passcode: WEBHOOK_PASSCODE,
  description: "Webhook for file comments",
};
/* 
axios
  .post(url, data, { headers: headers })
  .then((response) => {
    console.log("Response:", response.data);
  })
  .catch((error) => {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }); */

axios
  .put(url, data, { headers: headers })
  .then((response) => {
    console.log("Webhook updated:", response.data);
  })
  .catch((error) => {
    console.error(
      "Error updating webhook:",
      error.response ? error.response.data : error.message
    );
  });
/* 
  GET WEBHOOKS 
    {
  "id": "744533",
  "team_id": "1257873069678685752",
  "event_type": "FILE_COMMENT",
  "client_id": null,
  "endpoint": "http://localhost:3000/webhook",
  "passcode": "GET_WINLAB_TEAMSPACE_ACCESS_GOGO",
  "status": "ACTIVE",
  "description": "Webhook for file comments",
  "protocol_version": "2"
  }
  
  */
