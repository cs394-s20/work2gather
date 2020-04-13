import React, { useEffect, useState } from 'react';
import Goal from './Goal'

const App = () =>  {
  const [goalsJSON, setGoals] = useState({});
  const [users, setUsers] = useState({});
  var goals = Object.values(goalsJSON);
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
      <h1>{ "Work2Gather" }</h1>
      {goals.map(goal => <Goal goal={goal}/>)}
    </div>
  );
}

export default App;