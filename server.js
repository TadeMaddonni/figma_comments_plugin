require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { Client } = require("@notionhq/client");
const sqlite3 = require("sqlite3").verbose();

// test-notion.js

// ... rest of your server code
// ... (rest of the code)
const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const NOTION_TOKEN = process.env.NOTION_TOKEN;

// Initialize the Notion client
const notion = new Client({
  auth: NOTION_TOKEN,
});

// Initialize SQLite database
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Error opening database", err);
  } else {
    console.log("Database connected");
    db.run(`CREATE TABLE IF NOT EXISTS integrations (
      file_id TEXT PRIMARY KEY,
      notion_page_id TEXT NOT NULL
    )`);
  }
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.json());
// In-memory storage (replace with a database in production)
const integrationMap = new Map();

app.post("/setup-integration", (req, res) => {
  const { fileId, notionPageId } = req.body;
  console.log(
    `Setting up integration for Figma file ${fileId} and Notion page ${notionPageId}`
  );
  db.run(
    `INSERT OR REPLACE INTO integrations (file_id, notion_page_id) VALUES (?, ?)`,
    [fileId, notionPageId],
    (err) => {
      if (err) {
        console.error("Error inserting data:", err);
        res.sendStatus(500);
      } else {
        //integrationMap.set(fileId, notionPageId);
        res.sendStatus(200);
        console.log("File linked");
      }
    }
  );
});

app.post("/webhook", async (req, res) => {
  const { comment, event_type, file_key, comment_id, triggered_by } = req.body;

  if (event_type === "FILE_COMMENT") {
    db.get(
      `SELECT notion_page_id FROM integrations WHERE file_id = ?`,
      [file_key],
      async (err, row) => {
        if (err) {
          console.error("Error querying database:", err);
          return res.sendStatus(500);
        }

        if (!row) {
          console.log(`No Notion page configured for Figma file ${file_key}`);
          return res.sendStatus(400);
        }

        const notionPageId = row.notion_page_id;

        console.log(req.body);
        console.log(
          `Received comment event for Figma file ${file_key}- ${comment_id}`
        );

        try {
          const response = await notion.blocks.children.append({
            block_id: notionPageId,
            children: [
              {
                object: "block",
                type: "paragraph",
                paragraph: {
                  rich_text: [
                    {
                      type: "text",
                      text: {
                        content: `Comment from `,
                      },
                    },
                    {
                      type: "text",
                      text: {
                        content: triggered_by.handle,
                      },
                      annotations: {
                        bold: true,
                      },
                    },
                    {
                      type: "text",
                      text: {
                        content: `: "${comment[0]?.text}"`,
                      },
                    },
                  ],
                },
              },
            ],
          });

          console.log("Content added successfully!");
          res.sendStatus(200);
        } catch (error) {
          console.error("Error adding content to Notion:", error.body);
          res.sendStatus(500);
        }
      }
    );
  } else {
    res.sendStatus(200);
  }
});

/* app.post("/webhook", async (req, res) => {
  const { comment, event_type, file_key, comment_id, triggered_by } = req.body;

  if (event_type === "FILE_COMMENT") {
    const notionPageId = integrationMap.get(file_key);
    if (!notionPageId) {
      console.log(`No Notion page configured for Figma file ${file_key}`);
      return res.sendStatus(400);
    }

    console.log(req.body);
    console.log(
      `Received comment event for Figma file ${file_key}- ${comment_id}`
    );
    try {
      const response = await notion.blocks.children.append({
        block_id: notionPageId,
        children: [
          {
            object: "block",
            type: "heading_2",
            heading_2: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content: `${triggered_by.handle} says ${comment[0]?.text}`,
                  },
                },
              ],
            },
          },
        ],
      });

      console.log("Content added successfully!");
      res.sendStatus(200);
    } catch (error) {
      console.error("Error adding content to Notion:", error.body);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(200);
  }
}); */

app.listen(3000, () => console.log("Server running on port 3000"));
