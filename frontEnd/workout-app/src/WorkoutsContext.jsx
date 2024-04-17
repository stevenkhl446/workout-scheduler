import React, { createContext, useContext, useState } from 'react';

const WorkoutsContext = createContext();

export const useWorkouts = () => useContext(WorkoutsContext);

export const WorkoutsProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState({});

  return (
    <WorkoutsContext.Provider value={{ workouts, setWorkouts }}>
      {children}
    </WorkoutsContext.Provider>
  );
};

