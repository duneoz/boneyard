import React from 'react';
import HomePage from './components/HomePage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  console.log(process.env.NODE_ENV);  // This will log either 'development' or 'production'

  return (
    <div className="App">
      <HomePage />
      <ToastContainer 
        position="bottom-left" 
        autoClose={5000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // Optional: Choose light, dark, or colored themes
      />
    </div>
  );
}

export default App;