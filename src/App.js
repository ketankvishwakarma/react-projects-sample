import "./App.css";
import React, { useEffect, useState } from "react";
const title = "Sweety!";

const welcome = {
  greeting: "Hello",
  title: "Sweety!",
};

function App() {
  
  const initialStories = [
    {
      title: "React",
      url: "https://reactjs.org/",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: "Redux",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];
  const [stories, setStories] = React.useState(initialStories);

  const useSemiPersistentState = (key, initialState) => {
    const [value, setValue] = useState(
      localStorage.getItem(key) || initialState
    );

    React.useEffect(() => {
      localStorage.setItem(key, value);
    }, [value, key]);

    return [value, setValue];
  };

  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", '');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  
  const handleRemoveStories = (item) => {
    const newStories = stories.filter(
      (story) => item.objectID !== story.objectID
    );
    setStories(newStories);
  };

  const Item = ({ item, onRemoveItem }) => {
    function handleRemoveItem() {
      onRemoveItem(item);
    };

    return (
      <div>
        <span>
          <a href={item.url}>{item.title}</a>
        </span>
        &nbsp;
        <span>written by {item.author}</span>
        &nbsp;
        <span>
          has <b>{item.num_comments}</b> comments
        </span>
        &nbsp;
        <span>
          and scores <b>{item.points}</b> points
        </span>
        <span>
          <button type="button" onClick={() => onRemoveItem(item)}>
            Dismiss
          </button>
        </span>
      </div>
    );
  };

  const List = ({ list, onRemoveItem }) => {
   return list.map(item =>(
     <Item 
        key={item.objectID} 
        item={item} 
        onRemoveItem={onRemoveItem}
      />
   ));
  };

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div>
      <h1>
        {welcome.greeting} {welcome.title}
      </h1>
      <InputWithLabel
        id="search"
        label="Search"
        type="text"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search: </strong>
      </InputWithLabel>
      <hr />
      &nbsp;
      <List list={searchedStories} onRemoveItem={handleRemoveStories} />
    </div>
  );
}

const InputWithLabel = ({
  id,
  label,
  value,
  isFocused,
  type,
  onInputChange,
  child,
}) => {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);
  return (
    <>
      {child}
      &nbsp; &nbsp;
      <input
        id={id}
        ref={inputRef}
        type={type}
        value={value}
        autoFocus={isFocused}
        onChange={onInputChange}
      ></input>
    </>
  );
};

export default App;
