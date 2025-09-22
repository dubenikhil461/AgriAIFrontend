import { useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import Ax from '../utils/Axios';
import { AuthContext } from "../AuthContext";

function Login() {
  const { login } = useContext(AuthContext);

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const res = await Ax.post("/auth/google", { token });
      login(res.data.user, res.data.jwt);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-200 to-green-400">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md text-center">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-green-800 mb-2">AgriAI Farmer Login</h1>
          <p className="text-gray-600">Login with your Google account to continue</p>
        </div>

        <div className="mb-4 flex justify-center">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => console.log("Login Failed")}
          />
        </div>

        <p className="mt-6 text-sm text-gray-500">
          By logging in, you agree to our{" "}
          <span className="text-green-700 font-semibold hover:underline cursor-pointer">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-green-700 font-semibold hover:underline cursor-pointer">
            Privacy Policy
          </span>.
        </p>
      </div>
    </div>
  );
}

export default Login;
