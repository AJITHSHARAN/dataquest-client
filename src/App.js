import logo from './logo.svg';
import './App.css';
import MainApplication from './components/MainApplication';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    document. title = "Data Quest"
    }, [])
  return (
    <div className="App">
      <MainApplication></MainApplication>
    </div>
  );
}

export default App;
