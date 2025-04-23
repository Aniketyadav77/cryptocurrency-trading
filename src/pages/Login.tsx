
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bitcoin } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    const success = await login(email, password);
    setIsLoading(false);
    
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-crypto-bg-dark">
      <div className="container max-w-md mx-auto px-6 py-12 bg-crypto-bg-card rounded-lg shadow-xl">
        <div className="flex justify-center mb-8">
          <div className="rounded-full bg-primary/10 p-3">
            <Bitcoin className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            <span className="text-primary">Crypto</span>Horizon
          </h1>
          <p className="text-gray-400 mt-2">
            Sign in to access your trading dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <a
                href="#"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>

          {error && <p className="text-danger text-sm">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <a href="#" className="text-primary hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
