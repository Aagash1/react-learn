import React, { useState } from 'react';
import { FixedSizeList as List } from 'react-window';

export default function MovieSearch() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce function
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // API call with debounce
  const fetchItems = async (query) => {
    if (query.trim() === '') {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/search?query=${query}`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  // Debounced version of fetchItems
  const debouncedFetchItems = debounce(fetchItems, 500);

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedFetchItems(value);
  };

  // Render function for the virtualized list
  const renderRow = ({ index, style }) => {
    return (
      <div style={style}>
        <div>{items[index]}</div>
      </div>
    );
  };

  // Return the JSX for the component
  return (
    <div>
      <h1>Virtualized Search with Debouncing</h1>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search items..."
      />
      {loading && <p>Loading...</p>}
      <div>
        <List
          height={400}
          itemCount={items.length}
          itemSize={35}
          width={300}
        >
          {renderRow}
        </List>
      </div>
    </div>
  );
}
