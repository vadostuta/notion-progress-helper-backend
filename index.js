const cors = require('cors');
const express = require('express')
const { getDatebaseItemsByFilter, getDatebaseFilters, getAllItems } = require('./services/notion')
const PORT = process.env.PORT || 5555

const app = express()
app.use(cors());

app.get('/getFilters', async (req, res) => {
  const filters = await getDatebaseFilters()
  res.json(filters)
})

app.get('/getItemsByTag/:filter', async (req, res) => {
  const { filter } = req.params
  const items = await getDatebaseItemsByFilter(filter)
  res.json(items)
})

app.get('/getAllItems', async (req, res) => {
  const items = await getAllItems()
  res.json(items)
})

app.listen(PORT, console.log(`Server started on port ${PORT}`))
