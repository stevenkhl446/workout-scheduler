import React, {useState, useEffect} from 'react';
import axios from 'axios';

function WorkoutScheduler(){
  const [workout, setWorkout] = useState([]);
  const [newWorkout, setNewWorkout] = useState({name:'',duration:''});

  useEffect(()=>{
    axios.get('/api/workouts')
    .then(response=>{
      setWorkout(response.data)
    }).catch(error=>console.error('There was an error fetching the workouts:', error))
  },[])
  const handleSubmit=(event)=>{
    event.preventDefault();
    axios.post('/api/workouts',newWorkout)
    .then(response=>{
      setWorkout([...workout, response.data]);
      setNewWorkout({ name: '', duration: '' });
    }).catch(error=>console.error('There was an error fetching the workouts:', error));
  }


  return(
    <div>

      <h2>Work Outs</h2>

      <ul>
      {workout.map(workout => (
        <li key={workout.id}>{workout.name} - {workout.duration}</li>
      ))}
      </ul>

      <h2>Add a New Workout</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newWorkout.name}
          onChange={e => setNewWorkout({ ...newWorkout, name: e.target.value })}
          placeholder="Workout name"
          required
        />
        <input
          type="text"
          value={newWorkout.duration}
          onChange={e => setNewWorkout({ ...newWorkout, duration: e.target.value })}
          placeholder="Duration"
          required
        />
        <button type="submit">Add Workout</button>
      </form>


    </div>
  );
}

export default WorkoutScheduler;

