import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login, reset } from "../features/auth/authSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message || "Login failed");
    }

    // Prevent double-success toasts: track whether we've already shown
    // a success toast for this login lifecycle using a ref.
    if (!loginSuccessToasted.current) {
      if (isSuccess || user) {
        toast.success("Logged in successfully");
        loginSuccessToasted.current = true;
        if (user?.role === "admin") {
          navigate("/admin");
        } else navigate("/dashboard");
      }
    }

    // If there was an error, allow future success toasts again.
    if (isError) {
      loginSuccessToasted.current = false;
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  // Track whether we've already displayed a success toast for this login
  const loginSuccessToasted = useRef(false);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 mt-20">
      <div className="card">
        <h1 className="text-3xl text-center font-semibold">Login</h1>

        {isError && <div className="error">{message}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="form-group">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        <p style={{ marginTop: "20px", textAlign: "center" }}>
          Don't have an account? <Link className="underline" to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
