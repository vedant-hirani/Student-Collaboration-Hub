import React from "react";
import Navbar from "./components/Navbar/Navbar.js";
import AppRoutes from "./routes/AppRoutes.js";
import ErrorBoundary from "./components/common/errorboundary.js";

function App() {
  return (
    <div>
      <Navbar />
      <ErrorBoundary>
              <AppRoutes />
      </ErrorBoundary>
    </div>
  );
}

export default App;

