import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-perplexity-bg">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-perplexity-text">404</h1>
        <p className="text-xl text-perplexity-text-muted mb-4">Oops! Page not found</p>
        <a 
          href="/" 
          className="text-perplexity-accent hover:text-perplexity-accent underline transition-colors duration-200"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
