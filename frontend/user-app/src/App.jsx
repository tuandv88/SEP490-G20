import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HelloWorld from './components/HelloWorld';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HelloWorld />} />
      </Routes>
    </Router>
  );
}

export default App;
