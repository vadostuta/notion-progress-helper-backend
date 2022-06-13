const dotenv = require('dotenv').config()
const { Client } = require('@notionhq/client')

// Init client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const database_id = process.env.NOTION_DATABASE_ID

const getDatebaseItemsByFilter = async function getDatebaseItemsByFilter(filter) {
  const payload = {
    path: `databases/${database_id}/query`,
    method: 'POST',
    body: {
      "filter": {
        "property": "Tags",
        "multi_select": {
          "contains": filter
        }
      }
    }
  }

  const { results } = await notion.request(payload)

  const data = results.map(el => ({
    name: el.properties.Name.title[0].plain_text,
    description: el.properties?.['additional comment'].rich_text[0]?.plain_text,
    progress: el.properties.done.checkbox,
    url: el.properties.link?.url
  }))

  return data
}

const getDatebaseFilters = async function getDatebaseFilters() {
  const payload = {
    path: `databases/${database_id}/query`,
    method: 'POST'
  }

  const { results } = await notion.request(payload)

  const allDatabaseTags = results.reduce((prev, curr) => {
    const elTagsNames = curr.properties.Tags.multi_select.map(({ name }) => name)
    return [...prev, ...elTagsNames]
  }, [])

  const uniqueDatabaseTags = [...new Set(allDatabaseTags)]

  return uniqueDatabaseTags
}

const getAllItems = async function getAllItems() {
  const payload = {
    path: `databases/${database_id}/query`,
    method: 'POST'
  }

  const { results } = await notion.request(payload)

  const data = results.map(el => ({
    name: el.properties.Name.title[0].plain_text,
    description: el.properties?.['additional comment'].rich_text[0]?.plain_text,
    progress: el.properties.done.checkbox,
    url: el.properties.link?.url
  }))

  return data
}

module.exports = {
  getDatebaseItemsByFilter,
  getDatebaseFilters,
  getAllItems
}