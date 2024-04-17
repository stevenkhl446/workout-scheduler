import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import '/Users/liukaihsin/ytubeWorkoutScheduler/frontEnd/workout-app/public/dashBoard2.css'; 
import '/Users/liukaihsin/ytubeWorkoutScheduler/frontEnd/workout-app/public/button.css';
import { useNavigate } from 'react-router-dom';
import { useWorkouts } from './WorkoutsContext';

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const years = Array.from(new Array(10), (_, i) => new Date().getFullYear() - i); // last 10 years

const DashBoard2 =()=>{
    const history = useNavigate();

    const{user} = useAuth();
    //const [workouts,setWorkouts] = useState({});
    const { workouts, setWorkouts } = useWorkouts();
    const [currentDate, setCurrentDate] = useState(new Date());


    useEffect(()=>{
        if(user){
            //const today = new Date().toISOString().split('T')[0];
            console.log(user)
            fetchWorkouts();
            //history('/dashboard')
        }
    },[user, currentDate])

    //functions to fetch the workouts
    const fetchWorkouts = async()=>{
        if (!user || !user.id) {
            console.log("User or user ID is undefined, skipping fetch");
            return;
        }
        try {
            const response = await axios.get('http://localhost:3000/api/workouts', { withCredentials: true });
            //console.log(response.data)
            const fetchedWorkouts = response.data.reduce((acc, workout) => {
                workout.videos.forEach(video => {
                   
                    if (video.date) {
                        const date = video.date.split('T')[0]; // Extract date part
                        const time = video.date.split('T')[1]?.substring(0, 5); // Safely handle time extraction
                        
                        if (!acc[date]) acc[date] = [];
                        acc[date].push({ time, url: video.url,title: video.title });
                    } else {
                        console.log('Video without date encountered:', video);
                    }
                });
              return acc;
            }, {});
            //console.log(fetchedWorkouts);
            setWorkouts(fetchedWorkouts);
          } catch (error) {
            console.error('Error fetching workouts:', error);
          }
    }
    // Function to get the number of days in a month
const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

// Function to render days in the current month
const renderCalendarDays = () => {
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const days = [];
  for (let i = 0; i < daysInMonth(currentDate.getMonth(), currentDate.getFullYear()); i++) {
    const day = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
    const dayKey = day.toISOString().split('T')[0];
    days.push(
      <div key={i} onClick={() => handleDayClick(day)}>
        <div>{i + 1}</div>
        {workouts[dayKey] && workouts[dayKey].map((workout, index) => (
          <div key={index}>{workout.time}</div>
        ))}
      </div>
    );
  }
  return days;
};

const handleDayClick = (day) => {
    const dayStr = day.toISOString().split('T')[0];
    history(`/schedule/${dayStr}`); // Navigate to the schedule view
};

const handleMonthChange = (e) => {
    const newMonth = months.indexOf(e.target.value);
    setCurrentDate(new Date(currentDate.setMonth(newMonth)));
  };

  const handleYearChange = (e) => {
    const newYear = Number(e.target.value);
    setCurrentDate(new Date(currentDate.setFullYear(newYear)));
  };

  const renderMonthYearSelectors = () => (
    <div className="month-year-selectors">
      <select value={months[currentDate.getMonth()]} onChange={handleMonthChange}>
        {months.map((month, index) => (
          <option key={index} value={month}>{month}</option>
        ))}
      </select>
      <select value={currentDate.getFullYear()} onChange={handleYearChange}>
        {years.map((year, index) => (
          <option key={index} value={year}>{year}</option>
        ))}
      </select>
    </div>
  );
  
return (
    <div>
      <h2>Workout Calendar</h2>
      <div className="calendar-container">
        <div className="fitness-calendar">
          {renderMonthYearSelectors()}
          <div className="calendar">
            {renderCalendarDays()}
          </div>
  </div>
</div>
    </div>
  );

}

export default DashBoard2;


