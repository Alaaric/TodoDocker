import { useState, useEffect } from "react";
import "./css/App.css";

interface TestData {
  id: number;
  place_holder: string;
}

function App() {
  const [data, setData] = useState<TestData[]>([]);

  useEffect(() => {
    fetch("https://localhost:8000/api/tests", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Erreur :", error));
  }, []);

  return (
    <>
      <div>
        <h2>Données de Test</h2>
        <ul>
          {data.map((item) => (
            <li key={item.id}>{item.place_holder}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
