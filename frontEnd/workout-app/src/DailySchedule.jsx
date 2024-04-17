import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import '/Users/liukaihsin/ytubeWorkoutScheduler/frontEnd/workout-app/public/dailySchedule.css'; 
import '/Users/liukaihsin/ytubeWorkoutScheduler/frontEnd/workout-app/public/button.css';

import { useWorkouts } from './WorkoutsContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';




const DailySchedule = ({  }) => {
  //const [workouts, setWorkouts] = useState({}); // State to hold workouts for the day
  const navigate = useNavigate();
  const { workouts, setWorkouts } = useWorkouts();
  const { day } = useParams(); // Get the selected day from URL parameters
  console.log(`Workouts for ${day}:`, workouts[day]);


  // Function to handle adding a workout
  const addWorkout = async (timeSlot) => {
    const url = prompt('Enter the workout URL:');
    if (!url) return;
    const title = prompt('Enter the name of the video:');
    if (!title) return; 
    
    const workoutData = {
      date: `${day}T${timeSlot}:00.000Z`, // Assuming your backend expects ISO format
      url: url,
      title:title
    };
  
    try {
      // Make the POST request to your backend
      const response = await axios.post('http://localhost:3000/api/workouts', workoutData, { withCredentials: true });
      
      // Assuming the response contains the added workout
      const addedWorkout = response.data;
  
      // Update local state to reflect the added workout
      setWorkouts((prevWorkouts) => {
        // Check if there are already workouts for the selected day, if not initialize an empty array
        const updatedWorkoutsForDay = prevWorkouts[day] ? [...prevWorkouts[day]] : [];
  
        // Add the new workout to this array
        updatedWorkoutsForDay.push({
          time: timeSlot,
          url: url,
          title: title
        });
  
        // Return the updated state with the new workout added to the selected day
        return {
          ...prevWorkouts,
          [day]: updatedWorkoutsForDay,
        };
      });
  
      alert('Workout added successfully!');
    } catch (error) {
      console.error('Error adding workout:', error);
      alert('Failed to add workout.');
    }
  };
  const handleWorkoutClick = (e, workout) => {
    e.preventDefault(); // Optional if you want to prevent the default link action
    e.stopPropagation(); // Stops the event from propagating to the parent
    // Implement what should happen on link click, for example, navigating to the workout detail page
    window.open(workout.url, "_blank");
  };
  
  

  // Generate time slots
  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  }); // Filter for 12 AM to 12 PM

  return (
    // Assuming timeSlots covers 0:00 to 23:30 correctly
<div className="daily-schedule-container">
  <div className="schedule-content">
    <button onClick={() => navigate('/dashboard')}>Main Page</button>
    <h2>Schedule for {day}</h2>
    <div className="time-slots-container">
      {timeSlots.map((timeSlot, index) => (
        <div key={index} className="time-slot" onClick={() => addWorkout(timeSlot)}>
          <span className="time">{timeSlot}</span>
          {/* Assuming handleWorkoutClick prevents adding on link click */}
          {workouts[day] && workouts[day].filter(workout => workout.time && workout.time.startsWith(timeSlot)).map((filteredWorkout, i) => (
            <a key={i} href={filteredWorkout.url} target="_blank" rel="noopener noreferrer" className="workout-link" onClick={(e) => e.stopPropagation()}>
              {filteredWorkout.title || 'Workout'}
            </a>
          ))}
        </div>
      ))}
    </div>
  </div>
</div>

  );
};

export default DailySchedule;
