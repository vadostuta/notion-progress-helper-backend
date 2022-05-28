const cors = require('cors');
const express = require('express')
const getDatebaseItems = require('./services/notion')
const PORT = process.env.PORT || 5555

const app = express()
app.use(cors());

app.get('/getItems', async (req, res) => {
  const items = await getDatebaseItems()
  res.json(items)
})

app.listen(PORT, console.log(`Server started on port ${PORT}`))
