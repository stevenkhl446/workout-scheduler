import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import '/Users/liukaihsin/ytubeWorkoutScheduler/frontEnd/workout-app/public/dashBoard.css'; // Ensure you have corresponding CSS file

const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getFirstDayOfWeek(d = new Date()) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  return new Date(date.setDate(diff));
}

function getISOWeekNumber(d) {
  const date = new Date(d.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  const week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

const Dashboard = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [workouts, setWorkouts] = useState({});
  const firstDayOfWeek = getFirstDayOfWeek();
  

  useEffect(() => {
    if (user) {
      fetchWorkouts();
    }
  }, [user, currentMonth, currentYear]);

  const fetchWorkouts = async () => {
    if (!user || !user.id) {
      console.log("User or user ID is undefined, skipping fetch");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/api/workouts`, { withCredentials: true });
    console.log("Fetched workouts data:", response.data);

    // Initialize the workoutsMap object
    const workoutsMap = {};
    
    // Iterate through each workout
    response.data.forEach(workout => {
      // Make sure each workout has a date and url before processing
      if (workout.date && workout.url) {
        const date = new Date(workout.date);
        
        // Check if the date is valid before proceeding
        if (!isNaN(date)) {
          const normalizedDate = date.toISOString().split('T')[0];
          if (!workoutsMap[normalizedDate]) {
            workoutsMap[normalizedDate] = [];
          }
          workoutsMap[normalizedDate].push(workout.url);
        }
      }
    });

    setWorkouts(workoutsMap);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
};
/*
const handleWorkoutClick = (e, theUser) => {
  e.stopPropagation(); // Prevent the event from reaching the day box
  let theUrl = theUser.videos[0].url
  console.log(theUrl)
  window.open(theUrl, "_blank"); // Open the workout URL in a new tab
};
*/
const handleWorkoutClick = (e, url) => {
  e.preventDefault(); // Prevent default action
  e.stopPropagation(); // Stop the event from propagating further
  window.open(url, "_blank"); // Open the clicked URL in a new tab
};

const handleDayClick = async(day) => {

  const selectedDate = new Date(currentYear, currentMonth, day);
  const url = prompt("Enter the workout URL:");

  if (url) {
    try {
      selectedDate.setHours(0, 0, 0, 0);
      let dateString = selectedDate.toISOString();
      
      const newWorkout = {
        userId: user.id, // Assuming the user object has an 'id' property
        date: dateString,
        url
      };
      const response = await axios.post('/api/workouts', newWorkout, {
        withCredentials: true
      });
      // Assuming the backend returns the saved workout, including its ID
      const dayKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      setWorkouts((prevWorkouts) => ({
        ...prevWorkouts,
        [dayKey]: [...(prevWorkouts[dayKey] || []), response.data],
      }));
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  }
};

function calculateDayKeyForBox(weekIndex, dayIndex) {
  // Assuming firstDayOfWeek is the first day of the current week in local time
  let date = new Date(firstDayOfWeek);
  date.setUTCDate(date.getUTCDate() + weekIndex * 7 + dayIndex);

  // Reset hours to avoid hour-based discrepancies
  date.setUTCHours(0, 0, 0, 0);

  // Calculate week number and day name based on the adjusted date
  const weekNumber = getISOWeekNumber(date);
  const dayName = days[date.getUTCDay()]; // Use UTC day to match the key generation logic
  return `Week ${weekNumber}-${dayName}`;
}

//
function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(month, year) {
  return new Date(year, month).getDay();
}
const handleNextMonth = () => {
  setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1));
  if (currentMonth === 11) {
    setCurrentYear(prev => prev + 1);
  }
};

const handlePrevMonth = () => {
  setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1));
  if (currentMonth === 0) {
    setCurrentYear(prev => prev - 1);
  }
};
const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);

  const renderDayContent = (day) => {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const workoutsForDay = workouts[dateKey] || [];
  
    return (
      <>
      <div className="day-number">{day}</div>
      {
        workoutsForDay.map((workout, index) => {
          // Assuming workout is an object with a 'url' field
          // Adjust this based on your actual data structure
          return workout.videos.map((video, videoIndex) => (
            <a key={`${index}-${videoIndex}`} 
               href="#" // Using "#" for href, real navigation is handled by onClick
               onClick={(e) => handleWorkoutClick(e, video.url)} 
               className="workout-link">
              Video {videoIndex + 1} // Example text, adjust as needed
            </a>
          ));
        })
      }
    </>
    );
  };
   

  return (
    <div className="fitness-calendar">
      <button onClick={handlePrevMonth}>Prev</button>
      <span>{`${currentMonth + 1}/${currentYear}`}</span>
      <button onClick={handleNextMonth}>Next</button>
      <div className="calendar-grid">
        {[...Array(firstDayOfMonth).fill(null), ...Array(daysInMonth).fill(0).map((_, i) => i + 1)].map((day, index) => (
          <div key={index} className="day" onClick={() => handleDayClick(day)}>
            {renderDayContent(day)}
          </div>
        ))}
      </div>
    </div>
  );
  
  
};

export default Dashboard;


