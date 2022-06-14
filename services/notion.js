const dotenv = require('dotenv').config()
const { Client } = require('@notionhq/client')

/**
 * I think It's dumb initialize every time notion client,
 * but right now I don't better way
 */

const getDatebaseItemsByFilter = async function getDatebaseItemsByFilter(filter, query) {
  const notion = new Client({
    auth: query.integrationKey
  })

  const payload = {
    path: `databases/${query.databaseId}/query`,
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

const getDatebaseFilters = async function getDatebaseFilters(query) {
  const notion = new Client({
    auth: query.integrationKey
  })

  const payload = {
    path: `databases/${query.databaseId}/query`,
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

const getAllItems = async function getAllItems(query) {
  const notion = new Client({
    auth: query.integrationKey
  })

  const payload = {
    path: `databases/${query.databaseId}/query`,
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