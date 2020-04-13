import React, { useEffect, useState } from 'react';
import Goal from './Goal'

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
  const [goalsJSON, setGoals] = useState({});
  const [users, setUsers] = useState({});
  const [numTasks, setNumTasks] = useState(0);
  var goals = Object.values(goalsJSON);
  // var goals = {};
  // var goal = Object.values(goalsJSON);
  // for(var i = 0; i < inventoryKeys.length; i++){
  //   // jsonI[inventoryKeys[i]]['sku'] = inventoryKeys[i];
  //   inventory[inventoryKeys[i]] = inventoryJSON[inventoryKeys[i]];
  // } 

  useEffect(() => {
    const fetchGoals = async () => {
      const response = await fetch('./data.json');
      const json = await response.json();
      setGoals(json.goals);
      
    };
    fetchGoals();
    const fetchUsers = async () => {
      const response = await fetch('./data.json');
      const json = await response.json();
      setUsers(json.users);
      
    };
    fetchUsers();

  }, []);

  return (
    <div>
      <h1>{ work2gather.title }</h1>
      <p>{work2gather.content}</p>
      <button onClick={() => setNumTasks(numTasks + 1)}>Click Me to create task!</button>
      <TaskList numTasks = {numTasks}></TaskList>
      {goals.map(goal => <Goal goal={goal}/>)}
    </div>
  );
}

export default App;