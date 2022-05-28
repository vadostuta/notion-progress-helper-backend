const dotenv = require('dotenv').config()
const { Client } = require('@notionhq/client')

// Init client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const database_id = process.env.NOTION_DATABASE_ID

module.exports = async function getDatebaseItems() {
  // TODO: add payload dynamic
  const payload = {
    path: `databases/${database_id}/query`,
    method: 'POST',
    body: {
      "filter": {
        "property": "Tags",
        "multi_select": {
          "contains": "angular"
        }
      }
    }
  }

  const { results } = await notion.request(payload)

  const data = results.map(el => ({
    name: el.properties.Name.title[0].plain_text,
    description: el.properties?.['additional comment'].rich_text[0]?.plain_text,
    progress: el.properties.done.checkbox,
    url: el.properties.link.url
  }))

  return data
}
