import "./App.css";
import React, { useEffect, useState } from "react";
const title = "Sweety!";

const welcome = {
  greeting: "Hey",
  title: "React",
};

function App() {
  const stories = [
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

  
  const List = ({list}) => {
    return list.map((item) => (
      <div key={item.objectID}>
        <span>
          <a href={item.url}>{item.title}</a>
        </span>
        <span>{item.author}</span>
        <span>{item.num_comments}</span>
        <span>{item.points}</span>
      </div>
    ));
  };

  const useSemiPersistentState = (key,initialState) => {
    const [value, setValue] = useState(
      localStorage.getItem(key) || initialState
    );

    React.useEffect(() => {
      localStorage.setItem(key, value);
    }, [value,key]);

    return [value,setValue]
  };
  
  const [searchTerm,setSearchTerm] = useSemiPersistentState('search','React');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
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
        onInputChange={handleSearch}
      >
        <strong>Search: </strong>
      </InputWithLabel>
      <hr />
      &nbsp;
      <List list={searchedStories} />
    </div>
  );
}

const InputWithLabel =({id,label,value,type,onInputChange,children})=>(
  <>
   {children}
    &nbsp; &nbsp;
    <input 
      id={id}
      type={type}
      value={value}
      onChange={onInputChange}></input>
  </>
);

export default App;
