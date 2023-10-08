import './App.css';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import Header from './Components/Header/Header';
import Login from './Components/Login/Login';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loadUser } from './Actions/user';
import Home from './Components/Home/Home';
import Account from './Components/Account/Account';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  });
  
  const { isAuthenticated } = useSelector((state) => state.user);

  return (
    <Router>
      {isAuthenticated && <Header/>}

      <Routes>
        <Route path='/' element={isAuthenticated ? <Home/>:<Login/> } />
        <Route path='/account' element={isAuthenticated ? <Account/>:<Login/> } />

    </Routes>
    </Router>
  );
}

export default App;
