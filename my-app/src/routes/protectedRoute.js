import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext.js';
import LoadingSpinner from '../components/common/loadingspinner'; // Adjust the path based on your folder structure

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();
  
    if (loading) {
      return <LoadingSpinner />;
    }
  
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  
    return children;
  };

export default ProtectedRoute;
