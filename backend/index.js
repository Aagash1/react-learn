const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin:"http://localhost:5173"
}));

const items = Array.from({ length: 1000 }, (_, index) => `Item ${index + 1}`);

app.get('/search', (req, res) => {
  const query = req.query.query.toLowerCase();
  const filteredItems = items.filter((item) => item.toLowerCase().includes(query));
  res.json(filteredItems);
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
