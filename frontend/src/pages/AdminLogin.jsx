import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API}/admin/login`, credentials);
      if (response.data.success) {
        localStorage.setItem("adminToken", response.data.token);
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-navy flex items-center justify-center p-4"
      data-testid="admin-login-page"
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <span className="font-heading font-extrabold text-3xl text-white">
              Groove Media
            </span>
          </a>
          <p className="text-white/60 font-body mt-2">Admin Dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-sm shadow-xl p-8">
          <h1 className="font-heading font-bold text-2xl text-navy text-center mb-6">
            Sign In
          </h1>

          {error && (
            <div
              className="flex items-center gap-2 bg-error/10 text-error font-body text-sm p-3 rounded-sm mb-6"
              data-testid="login-error"
            >
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} data-testid="admin-login-form">
            <div className="space-y-4">
              {/* Username */}
              <div>
                <Label htmlFor="username" className="label-base">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-800/40" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={credentials.username}
                    onChange={handleChange}
                    className="input-base pl-10"
                    placeholder="Enter username"
                    data-testid="input-username"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password" className="label-base">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-800/40" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={credentials.password}
                    onChange={handleChange}
                    className="input-base pl-10"
                    placeholder="Enter password"
                    data-testid="input-password"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mt-6"
              data-testid="login-submit-btn"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-neutral-800/50 font-body text-sm mt-6">
            Default credentials: admin / groovemedia2024
          </p>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-white/60 font-body text-sm hover:text-white transition-colors"
          >
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  );
}
