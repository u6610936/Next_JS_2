import { useEffect, useState } from 'react';
import './App.css'
function App() {
  const [message, setMessage] = useState("...Loading...");
    async function fetchData() {
      const result = await fetch('http://localhost:3000/api/test_api/hello');
      const data = await result.json();
      console.log("result: ", result);
      console.log("data:", data);
      setMessage(data.message);
    }
  useEffect(()=>{
    (async () => {
      await fetchData();
    })();
  },[]);
  
  return (
  <div>
    Message: {message}
  </div>
  )
}
export default App