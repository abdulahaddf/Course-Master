import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import { getMe } from "./features/auth/authSlice";
import ProtectedRoute from "./features/ProtectedRoute/ProtectedRoute";
import AdminAssignments from "./pages/AdminAssignments";
import AdminPanel from "./pages/AdminPanel";
import CourseConsume from "./pages/CourseConsume";
import CourseDetails from "./pages/CourseDetails";
import CreateQuiz from "./pages/CreateQuiz";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";

function App() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getMe(token));
    }
  }, [dispatch, token, user]);

  return (
    <Router>
      <div className="">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/course/:slug" element={<CourseDetails />} />
          <Route
            path="/course/consume/:enrollmentId"
            element={
              <ProtectedRoute>
                <CourseConsume />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/course/:courseId/assignments"
            element={
              <ProtectedRoute adminOnly>
                <AdminAssignments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/course/:courseId/quiz/create"
            element={
              <ProtectedRoute adminOnly>
                <CreateQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
