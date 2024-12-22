import React from 'react';
import HomePage from './components/HomePage';

function App() {
  console.log(process.env.NODE_ENV);  // This will log either 'development' or 'production'

  return (
    <div className="App">
      <HomePage />
    </div>
  );
}

export default App;
