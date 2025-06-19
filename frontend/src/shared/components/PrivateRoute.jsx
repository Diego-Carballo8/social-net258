import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const isAuth = !!localStorage.getItem('userId');
  return isAuth ? children : <Navigate to="/login" />;
}