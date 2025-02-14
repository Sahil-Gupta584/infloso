import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Home } from './pages/private/Home';
import PrivateRoutes from './pages/private';
import {  useDispatch } from 'react-redux';
import { useEffect } from "react";
import { getUser } from './lib/auth';
import { setUser } from './redux/userSlice';

function App() {
  const dispatch = useDispatch()
  
  useEffect(() => {

    (async () => {
      const user = await getUser()
      dispatch(setUser(user))
    })()
  }, [dispatch])
  
  return (
    <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Navigate to="/login" replace />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;