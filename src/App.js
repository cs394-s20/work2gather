import React from 'react';

const work2gather = {
  title: "Work2Gather",
  content: ["First commit"]
};

const App = () =>  (
  <div>
    <h1>{ work2gather.title }</h1>
    <p>{work2gather.content}</p>
    <button>Click Me!</button>
  </div>
);

export default App;