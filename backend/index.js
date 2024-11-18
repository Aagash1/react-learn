const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin:"http://localhost:5173"
}));

const items = Array.from({ length: 1000 }, (_, index) => `Item ${index + 1}`);

app.get('/search', (req, res) => {
  const query = req.query.query?.toLowerCase() || '';
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 50;

  const filteredItems = items.filter((item) => item.toLowerCase().includes(query));

  const paginatedItems = filteredItems.slice(offset, offset + limit);

  const hasMore = offset + limit < filteredItems.length;

  res.json({
    items: paginatedItems,
    hasMore,
  });
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
