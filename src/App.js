import "./App.css";
import React, { useEffect, useState } from "react";
const title = "Sweety!";

const welcome = {
  greeting: "Hello",
  title: "Sweety!",
};

const storiesReducer = (state, action) => {
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "STORIES_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
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

  //const [stories, setStories] = React.useState(initialStories);
  //const [isLoading, setIsLoading] = React.useState(false);
  //const [isError, setIsError] = React.useState(false);

  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  React.useEffect(() => {
    dispatchStories({ type: "STORIES_FETCH_INIT" });

    getAsyncStories()
      .then((result) => {
        dispatchStories({
          type: "STORIES_FETCH_SUCCESS",
          payload: result.data.stories,
        });
      })
      .catch(() => dispatchStories({ type: "STORIES_FETCH_FAILURE" }));
  }, []);

  const getAsyncStories = () =>
    new Promise((resolve, reject) =>
      setTimeout(() => resolve({ data: { stories: initialStories } }), 2000)
    );

  const useSemiPersistentState = (key, initialState) => {
    const [value, setValue] = useState(
      localStorage.getItem(key) || initialState
    );

    React.useEffect(() => {
      localStorage.setItem(key, value);
    }, [value, key]);

    return [value, setValue];
  };

  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRemoveStories = (item) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  };

  const Item = ({ item, onRemoveItem }) => {
    function handleRemoveItem() {
      onRemoveItem(item);
    }

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
    return list.map((item) => (
      <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
    ));
  };

  const searchedStories = stories.data.filter((story) =>
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
      {stories.isError && <p>Something went wrong...</p>}
      &nbsp;
      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={searchedStories} onRemoveItem={handleRemoveStories} />
      )}
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
