import React, { useEffect, useState } from "react";

const App = () => {
  const [carList, setCarList] = useState([]);

  const fetchCars = async () => {
    const response = await fetch("/api/test/cars");
    if (!response.ok) {
      console.log("HTTP ERROR: ", response.status);
    }
    const data = await response.json();
    setCarList(data);
  };

  useEffect(() => {
    fetchCars();
  }, []);
  return (
    <div>
      <h1>Demo OX-App</h1>
      <h3>Car List:</h3>
      <ol>
        {carList.map((car, index) => (
          <li key={index}>{car}</li>
        ))}
      </ol>
    </div>
  );
};

export default App;
