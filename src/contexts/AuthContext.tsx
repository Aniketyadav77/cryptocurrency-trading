
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  email: string;
  name: string;
  profileImage: string;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem("cryptoUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // For demo purposes, we're using mock data
      if (email && password.length >= 6) {
        const mockUser = {
          id: "user-123",
          email,
          name: email.split("@")[0],
          profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + email,
        };
        
        setUser(mockUser);
        localStorage.setItem("cryptoUser", JSON.stringify(mockUser));
        setIsLoading(false);
        toast.success("Login successful");
        return true;
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Login failed. Please check your credentials.");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cryptoUser");
    toast.info("You have been logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
