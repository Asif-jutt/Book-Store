import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createBook, updateBook, getBook } from "../../services/bookService";

function BookForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category: "free",
    price: 0,
    thumbnail: "",
    level: "beginner",
    language: "English",
    tags: "",
    isPublished: false,
    chapters: [{ title: "", content: "", duration: "", videoUrl: "" }],
  });

  useEffect(() => {
    if (isEditing) {
      fetchBook();
    }
  }, [id]);

  const fetchBook = async () => {
    try {
      setFetchLoading(true);
      const response = await getBook(id);
      if (response.success) {
        const book = response.data;
        setFormData({
          title: book.title || "",
          author: book.author || "",
          description: book.description || "",
          category: book.category || "free",
          price: book.price || 0,
          thumbnail: book.thumbnail || "",
          level: book.level || "beginner",
          language: book.language || "English",
          tags: book.tags?.join(", ") || "",
          isPublished: book.isPublished || false,
          chapters:
            book.chapters?.length > 0
              ? book.chapters
              : [{ title: "", content: "", duration: "", videoUrl: "" }],
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch book");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleChapterChange = (index, field, value) => {
    const updatedChapters = [...formData.chapters];
    updatedChapters[index] = { ...updatedChapters[index], [field]: value };
    setFormData((prev) => ({ ...prev, chapters: updatedChapters }));
  };

  const addChapter = () => {
    setFormData((prev) => ({
      ...prev,
      chapters: [
        ...prev.chapters,
        { title: "", content: "", duration: "", videoUrl: "" },
      ],
    }));
  };

  const removeChapter = (index) => {
    if (formData.chapters.length === 1) return;
    const updatedChapters = formData.chapters.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, chapters: updatedChapters }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const bookData = {
        ...formData,
        price: formData.category === "free" ? 0 : parseFloat(formData.price),
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        chapters: formData.chapters.filter((ch) => ch.title.trim()),
      };

      let response;
      if (isEditing) {
        response = await updateBook(id, bookData);
      } else {
        response = await createBook(bookData);
      }

      if (response.success) {
        navigate("/admin");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save book");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">
        {isEditing ? "Edit Book" : "Add New Book"}
      </h1>

      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title *</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="input input-bordered"
                  placeholder="Book title"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Author *</span>
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  className="input input-bordered"
                  placeholder="Author name"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="textarea textarea-bordered h-24"
                placeholder="Book description"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Thumbnail URL</span>
              </label>
              <input
                type="url"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                className="input input-bordered"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Category *</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="select select-bordered"
                >
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Price ($)</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  disabled={formData.category === "free"}
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Level</span>
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="select select-bordered"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Language</span>
                </label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="input input-bordered"
                  placeholder="English"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tags (comma separated)</span>
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="input input-bordered"
                  placeholder="javascript, web, programming"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">Publish this book</span>
              </label>
            </div>
          </div>
        </div>

        {/* Chapters */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title">Chapters</h2>
              <button
                type="button"
                onClick={addChapter}
                className="btn btn-outline btn-sm"
              >
                + Add Chapter
              </button>
            </div>

            <div className="space-y-6">
              {formData.chapters.map((chapter, index) => (
                <div
                  key={index}
                  className="border border-base-300 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Chapter {index + 1}</h3>
                    {formData.chapters.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeChapter(index)}
                        className="btn btn-error btn-sm btn-outline"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Chapter Title</span>
                      </label>
                      <input
                        type="text"
                        value={chapter.title}
                        onChange={(e) =>
                          handleChapterChange(index, "title", e.target.value)
                        }
                        className="input input-bordered"
                        placeholder="Chapter title"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Duration</span>
                      </label>
                      <input
                        type="text"
                        value={chapter.duration}
                        onChange={(e) =>
                          handleChapterChange(index, "duration", e.target.value)
                        }
                        className="input input-bordered"
                        placeholder="e.g. 15 min"
                      />
                    </div>
                  </div>

                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">Video URL (optional)</span>
                    </label>
                    <input
                      type="url"
                      value={chapter.videoUrl}
                      onChange={(e) =>
                        handleChapterChange(index, "videoUrl", e.target.value)
                      }
                      className="input input-bordered"
                      placeholder="https://example.com/video.mp4"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Content</span>
                    </label>
                    <textarea
                      value={chapter.content}
                      onChange={(e) =>
                        handleChapterChange(index, "content", e.target.value)
                      }
                      className="textarea textarea-bordered h-32"
                      placeholder="Chapter content..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : isEditing ? (
              "Update Book"
            ) : (
              "Create Book"
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="btn btn-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookForm;
