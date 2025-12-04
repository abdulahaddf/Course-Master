import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateCourse from "../components/Course/CreateCourse";
import {
  createCourse,
  deleteCourse,
  getCourses,
  updateCourse,
} from "../features/courses/courseSlice";
import Loading from "../components/Loading";

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { courses, isLoading, isError, message } = useSelector(
    (state) => state.courses
  );
  console.log(courses);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    tags: "",
    syllabus: [{ title: "", description: "", lessons: [] }],
    batches: [{ name: "", startDate: "", endDate: "" }],
  });

  // useEffect(() => {
  //   dispatch(getCourses({ limit: 100 }));

  //   // Refresh enrollment count every 50 seconds
  //   const refreshInterval = setInterval(() => {
  //     dispatch(getCourses({ limit: 100 }));
  //   }, 50000);

  //   return () => clearInterval(refreshInterval);
  // }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const courseData = {
      ...formData,
      price: parseFloat(formData.price),
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      syllabus: formData.syllabus.map((module) => ({
        ...module,
        lessons: module.lessons.map((lesson, index) => ({
          ...lesson,
          order: index + 1,
        })),
        order: formData.syllabus.indexOf(module) + 1,
      })),
    };

    if (editingCourse) {
      await dispatch(updateCourse({ id: editingCourse._id, courseData }));
    } else {
      await dispatch(createCourse(courseData));
    }

    setShowCreateForm(false);
    setEditingCourse(null);
    setFormData({
      title: "",
      description: "",
      price: "",
      category: "",
      tags: "",
      syllabus: [{ title: "", description: "", lessons: [] }],
      batches: [{ name: "", startDate: "", endDate: "" }],
    });
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      price: course.price,
      category: course.category,
      tags: course.tags?.join(", "),
      syllabus: course.syllabus || [
        { title: "", description: "", lessons: [] },
      ],
      batches: course.batches || [{ name: "", startDate: "", endDate: "" }],
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      await dispatch(deleteCourse(id));
    }
  };

  const addModule = () => {
    setFormData((prev) => ({
      ...prev,
      syllabus: [...prev.syllabus, { title: "", description: "", lessons: [] }],
    }));
  };

  const addLesson = (moduleIndex) => {
    const newSyllabus = [...formData.syllabus];
    newSyllabus[moduleIndex].lessons.push({
      title: "",
      description: "",
      videoUrl: "",
      duration: 0,
    });
    setFormData((prev) => ({ ...prev, syllabus: newSyllabus }));
  };

  const addBatch = () => {
    setFormData((prev) => ({
      ...prev,
      batches: [...prev.batches, { name: "", startDate: "", endDate: "" }],
    }));
  };

  if (isLoading) {
    return <Loading/>;
  }

  if (isError) {
    return <div className="error">{message}</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Admin Panel</h1>
          <div>
           
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary"
            >
              Create New Course
            </button>
          </div>
        </div>

        {showCreateForm && (
          <CreateCourse
            editingCourse={editingCourse}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            formData={formData}
            setFormData={setFormData}
            addLesson={addLesson}
            addBatch={addBatch}
            addModule={addModule}
            setEditingCourse={setEditingCourse}
            setShowCreateForm={setShowCreateForm}
          />
        )}

        <div className="grid grid-2">
          {courses.map((course) => (
            <div key={course._id} className="card">
              <h3 className="font-bold text-xl">{course.title}</h3>
              <p>{course.description}</p>
              <p>
                <strong>Price:</strong> ${course.price}
              </p>
              <p>
                <strong>Category:</strong> {course.category}
              </p>
              <p>
                <strong>Students Enrolled:</strong> {course.enrollments || 0}
              </p>

              <div className="mt-3">
                <button
                  onClick={() => handleEdit(course)}
                  className="btn btn-primary mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(course._id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
