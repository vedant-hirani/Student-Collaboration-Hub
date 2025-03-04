import React from 'react';
import AppRoutes from "./routes/AppRoutes.js";
import { AuthProvider } from './context/authContext.js';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;