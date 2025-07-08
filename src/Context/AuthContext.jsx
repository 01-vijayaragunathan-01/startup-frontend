import { createContext, useContext, useState, useEffect } from "react";

// Create context
const AuthContext = createContext();

// Custom hook for convenience
export const useAuth = () => useContext(AuthContext);

//  Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user info like { id, name, email, role }

  // Load user from localStorage if available
  useEffect(() => {
    const storedUser = localStorage.getItem("mentorUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  const login = (userData) => {
    localStorage.setItem("mentorUser", JSON.stringify(userData));
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("mentorUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
