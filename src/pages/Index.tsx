
import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect from the index page to the dashboard
  return <Navigate to="/" replace />;
};

export default Index;
