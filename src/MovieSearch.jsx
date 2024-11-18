import React, { useState } from 'react';
import { FixedSizeList as List } from 'react-window';

const throttle = (func, limit) => {
  let flag=true;
  return function(...args){
     let context=this;
     if(flag){
      func.apply(context,args);
      flag=false;
      setTimeout(()=>{
         flag=true;
      },limit)
     }
  }
};

export default function MovieSearchWithScroll() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // To track if more data is available
  const [count,setCount]=useState(0);
  // API call for fetching search results
  const fetchItems = async (query, offset = 0, limit = 50) => {
    if (!hasMore && offset > 0) return; // Prevent unnecessary calls
    if (query.trim() === '') {
      setItems([]);
      return;
    }
    setCount(count+1);
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/search?query=${query}&offset=${offset}&limit=${limit}`
      );
      const data = await response.json();
      if (offset === 0) {
        // New search query
        setItems(data.items || []);
      } else {
        // Append data for infinite scroll
        setItems((prev) => [...prev, ...(data.items || [])]);
      }
      setHasMore(data.hasMore); // Update if more data is available
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };


  // Throttled version of fetchItems for infinite scrolling
  const throttledFetchItems = throttle(fetchItems, 20000);

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    throttledFetchItems(value,0,50);
  };

  // Handle scrolling near the bottom
  const handleScroll = ({ visibleStopIndex }) => {
    if (visibleStopIndex >= items.length - 1) {
      // Fetch next chunk of data
      throttledFetchItems(query, items.length, 50); // Offset is the current length of items
    }
  };

  // Render each row
  const renderRow = ({ index, style }) => {
    return (
      <div style={style}>
        {items[index] ? <p>{items[index]}</p> : <p>Loading...</p>}
      </div>
    );
  };

  return (
    <div>
      {count}
      <h1>Throttled Scroll with React Window</h1>
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
          itemCount={hasMore ? items.length + 1 : items.length}
          itemSize={35}
          width={300}
          onItemsRendered={({ visibleStopIndex }) => handleScroll({ visibleStopIndex })}
        >
          {renderRow}
        </List>
      </div>
    </div>
  );
}
