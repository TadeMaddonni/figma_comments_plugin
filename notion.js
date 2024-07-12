require("dotenv").config();
const axios = require("axios");
const notionPageId = "57a24fe703a4445593ecf2fc2e831a19"; // Verify this ID
const notionToken = process.env.NOTION_TOKEN; // Use your actual token

// The ID of the page you want to add content to
const pageId = notionPageId;

async function addContentToNotion() {
  try {
    const response = await notion.blocks.children.append({
      block_id: pageId,
      children: [
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [{ type: "text", text: { content: "Test Heading" } }],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              { type: "text", text: { content: "This is a test paragraph." } },
            ],
          },
        },
        {
          object: "block",
          type: "bulleted_list_item",
          bulleted_list_item: {
            rich_text: [{ type: "text", text: { content: "Bullet point 1" } }],
          },
        },
        {
          object: "block",
          type: "bulleted_list_item",
          bulleted_list_item: {
            rich_text: [{ type: "text", text: { content: "Bullet point 2" } }],
          },
        },
      ],
    });

    console.log("Content added successfully!");
  } catch (error) {
    console.error("Error adding content to Notion:", error.body);
  }
}

// Run the function
addContentToNotion();
