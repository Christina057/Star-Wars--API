import React from 'react';
import Planets from "./components/Planet";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Star Wars Planets Explorer</h1>
      </header>
      <main>
        <Planets />
      </main>
    </div>
  );
}

export default App;
