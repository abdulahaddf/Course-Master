const CreateCourse = ({
  editingCourse,
  handleSubmit,
  handleInputChange,
  formData,
  setFormData,
  addLesson,
  addModule,
  setEditingCourse,
  setShowCreateForm,
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6 mb-4">
      <h2>
        {editingCourse ? (
          <p className="text-center text-3xl mb-10">Edit Course</p>
        ) : (
          <p className="text-center text-3xl mb-10">
            Fill all the info of New Course
          </p>
        )}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows="4"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="e.g., React, JavaScript, Frontend"
          />
        </div>

        <div className="form-group">
          <h3>Syllabus</h3>
          {formData.syllabus.map((module, moduleIndex) => (
            <div key={moduleIndex} className="border p-3 mb-3">
              <h4>Module {moduleIndex + 1}</h4>
              <input
                type="text"
                placeholder="Module Title"
                value={module.title}
                onChange={(e) => {
                  const newSyllabus = [...formData.syllabus];
                  newSyllabus[moduleIndex].title = e.target.value;
                  setFormData((prev) => ({ ...prev, syllabus: newSyllabus }));
                }}
                className="mb-2"
              />
              <textarea
                placeholder="Module Description"
                value={module.description}
                onChange={(e) => {
                  const newSyllabus = [...formData.syllabus];
                  newSyllabus[moduleIndex].description = e.target.value;
                  setFormData((prev) => ({ ...prev, syllabus: newSyllabus }));
                }}
                rows="2"
                className="mb-2"
              />

              <h5>Lessons</h5>
              {(module.lessons || []).map((lesson, lessonIndex) => (
                <div
                  key={lessonIndex}
                  className="ml-3 mb-2 border-l-2 border-yellow-500 pl-2"
                >
                  <input
                    type="text"
                    placeholder="Lesson Title"
                    value={lesson.title}
                    onChange={(e) => {
                      const newSyllabus = [...formData.syllabus];
                      newSyllabus[moduleIndex].lessons[lessonIndex].title =
                        e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        syllabus: newSyllabus,
                      }));
                    }}
                    className="mb-1"
                  />
                  <textarea
                    placeholder="Lesson Description"
                    value={lesson.description}
                    onChange={(e) => {
                      const newSyllabus = [...formData.syllabus];
                      newSyllabus[moduleIndex].lessons[
                        lessonIndex
                      ].description = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        syllabus: newSyllabus,
                      }));
                    }}
                    rows="2"
                    className="mb-1"
                  />
                  <input
                    type="text"
                    placeholder="Video URL"
                    value={lesson.videoUrl || ""}
                    onChange={(e) => {
                      const newSyllabus = [...formData.syllabus];
                      newSyllabus[moduleIndex].lessons[lessonIndex].videoUrl =
                        e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        syllabus: newSyllabus,
                      }));
                    }}
                    className="mb-1"
                  />
                  <input
                    type="number"
                    placeholder="Duration (minutes)"
                    value={lesson.duration || ""}
                    onChange={(e) => {
                      const newSyllabus = [...formData.syllabus];
                      newSyllabus[moduleIndex].lessons[lessonIndex].duration =
                        parseInt(e.target.value) || 0;
                      setFormData((prev) => ({
                        ...prev,
                        syllabus: newSyllabus,
                      }));
                    }}
                    className="mb-1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newSyllabus = [...formData.syllabus];
                      newSyllabus[moduleIndex].lessons.splice(lessonIndex, 1);
                      setFormData((prev) => ({
                        ...prev,
                        syllabus: newSyllabus,
                      }));
                    }}
                    className="bg-red-500 text-white px-4 rounded-md text-xs"
                  >
                    Remove Lesson
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addLesson(moduleIndex)}
                className="btn btn-secondary btn-sm"
              >
                Add Lesson
              </button>
              <button
                type="button"
                onClick={() => {
                  const newSyllabus = formData.syllabus.filter(
                    (_, index) => index !== moduleIndex
                  );
                  setFormData((prev) => ({ ...prev, syllabus: newSyllabus }));
                }}
                className="bg-red-500 text-white px-3 ml-2 py-1 rounded-md text-xs"
              >
                Remove Module
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addModule}
            className="btn btn-primary btn-sm"
          >
            Add Module
          </button>
        </div>

        <div className="form-group">
          <h3>Batch info</h3>
          {formData.batches.map((batch, batchIndex) => (
            <div key={batchIndex} className="border p-3 mb-3">
              <input
                type="text"
                placeholder="Batch Name"
                value={batch.name}
                onChange={(e) => {
                  const newBatches = [...formData.batches];
                  newBatches[batchIndex].name = e.target.value;
                  setFormData((prev) => ({ ...prev, batches: newBatches }));
                }}
                className="mb-2"
              />
              <input
                type="date"
                value={batch.startDate}
                onChange={(e) => {
                  const newBatches = [...formData.batches];
                  newBatches[batchIndex].startDate = e.target.value;
                  setFormData((prev) => ({ ...prev, batches: newBatches }));
                }}
                className="mb-2"
              />
              <input
                type="date"
                value={batch.endDate}
                onChange={(e) => {
                  const newBatches = [...formData.batches];
                  newBatches[batchIndex].endDate = e.target.value;
                  setFormData((prev) => ({ ...prev, batches: newBatches }));
                }}
              />
            </div>
          ))}
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            {editingCourse ? "Update Course" : "Create Course"}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowCreateForm(false);
              setEditingCourse(null);
            }}
            className="btn btn-secondary ml-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;
