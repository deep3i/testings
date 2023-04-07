import React, {useState, } from "react";

function MySlider() {

  const[state, setState] = useState({
    name:"",
  });
  
 const handleInputChange = (event) => {
    const name = event.target.value;
    setState({ name });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('http:localhost:8090/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: state.name })
    })
      .then(response => {
        // Handle response from Go backend
        console.log("response:", response);
      })
      .catch(error => {
        // Handle error
        console.log("error:", error);
      });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="myInput">Enter your name:</label>
          <input type="text" id="myInput" name="name" value={state.name} onChange={(event) => handleInputChange(event)} />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default MySlider;
