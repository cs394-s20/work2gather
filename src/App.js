import React, { useState } from 'react';

const work2gather = {
  title: "Work2Gather",
  content: ["First commit"]
};

const TaskList = ({numTasks}) => {
  var array = Array(numTasks);
  for (var i = 0; i < numTasks; i++){
    array[i] = i+ 1;
  }
  return (
    <React.Fragment>
        <div>{numTasks}</div>
        { array.map(index =>
           <p key={index}> Hi!  I'm task {index + 1}.</p>) }
    </React.Fragment>
  );
};

const App = () =>  {
  
  const [numTasks, setNumTasks] = useState(0);

  return (
    <div>
      <h1>{ work2gather.title }</h1>
      <p>{work2gather.content}</p>
      <button onClick={() => setNumTasks(numTasks + 1)}>Click Me to create task!</button>
      <TaskList numTasks = {numTasks}></TaskList>
    </div>
  );
}

export default App;