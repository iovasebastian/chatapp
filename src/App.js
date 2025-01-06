import { Route, Routes } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';
import Login from './components/login';
import Main from './components/main';
import Register from './components/register';
import './App.css';


function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/main" element={<Main/>} />
          <Route path="/register" element={<Register/>} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
