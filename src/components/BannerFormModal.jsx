// BannerModel.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Upload, Save } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "../lib/api"; // adjust path

const API_BASE_URL = "https://api.houseofresha.com";

// ============ fetch categories ============
const fetchCategories = async () => {
  const res = await fetch(`${API_BASE_URL}/banner/?category`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch categories: ${res.status} ${res.statusText}`
    );
  }
  const data = await res.json();

  if (Array.isArray(data)) {
    return data.map((item) =>
      typeof item === "string"
        ? item
        : item.value || item.name || item.category || JSON.stringify(item)
    );
  }
  if (data && typeof data === "object") {
    const arr =
      data.categories || data.data || data.values || Object.values(data);
    if (Array.isArray(arr)) {
      return arr.map((item) =>
        typeof item === "string"
          ? item
          : item.value || item.name || item.category || JSON.stringify(item)
      );
    }
  }
  return ["men", "women", "unisex", "glow-ritual", "home"];
};

// ============ create / update API ============
const createBanner = async (bannerData) => {
  const formData = new FormData();
  formData.append("title", bannerData.title.trim());
  formData.append("buttonText", bannerData.buttonText.trim());
  formData.append("buttonLink", bannerData.buttonLink.trim());
  formData.append("category", bannerData.category);
  formData.append("description", bannerData.description?.trim() || "");
  formData.append("isActive", bannerData.isActive ? "true" : "false");
  formData.append("position", bannerData.position.toString());
  if (bannerData.videoFile) formData.append("video", bannerData.videoFile);

  const res = await fetch(`${API_BASE_URL}/banner`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      data.message || data.error || `HTTP ${res.status}: Failed to create`
    );
  }
  return data;
};

const updateBanner = async (bannerData) => {
  if (!bannerData._id) throw new Error("Missing banner _id");

  const formData = new FormData();
  formData.append("title", bannerData.title.trim());
  formData.append("buttonText", bannerData.buttonText.trim());
  formData.append("buttonLink", bannerData.buttonLink.trim());
  formData.append("category", bannerData.category);
  formData.append("description", bannerData.description?.trim() || "");
  formData.append("isActive", bannerData.isActive ? "true" : "false");
  formData.append("position", bannerData.position.toString());
  if (bannerData.videoFile) formData.append("video", bannerData.videoFile);

  const res = await fetch(`${API_BASE_URL}/banner/${bannerData._id}`, {
    method: "PATCH",
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      data.message || data.error || `HTTP ${res.status}: Failed to update`
    );
  }
  return data;
};

// ============ toast helper ============
const showToast = (message, type = "success") => {
  const toastContainer =
    document.getElementById("toast-container") ||
    (() => {
      const container = document.createElement("div");
      container.id = "toast-container";
      container.className = "fixed top-4 right-4 z-50 flex flex-col gap-3";
      document.body.appendChild(container);
      return container;
    })();

  const toastId = `toast-${Date.now()}`;
  const toast = document.createElement("div");
  toast.id = toastId;
  toast.className = `px-6 py-4 rounded-xl shadow-2xl font-bold text-white animate-slide-in ${
    type === "success"
      ? "bg-gradient-to-r from-green-500 to-emerald-600"
      : "bg-gradient-to-r from-red-500 to-pink-600"
  }`;

  toast.innerHTML = `
    <div class="flex items-center gap-3">
      ${
        type === "success"
          ? '<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>'
          : '<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>'
      }
      <span>${message}</span>
    </div>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 4000);
};

// ============ BannerModel (Form only) ============
const BannerFormModel = ({ open, onClose, initialBanner }) => {
  const [videoPreview, setVideoPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    buttonText: "Shop Now",
    buttonLink: "",
    isActive: true,
    position: "1",
    videoFile: null,
  });

  // categories query
  const {
    data: apiCategories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    retry: 2,
    refetchOnWindowFocus: false,
    staleTime: 60000,
  });

  const categories = useMemo(() => {
    if (!apiCategories || apiCategories.length === 0) {
      return [
        { value: "men", label: "Men" },
        { value: "women", label: "Women" },
        { value: "unisex", label: "Unisex" },
      ];
    }
    const map = new Map();
    apiCategories.forEach((cat, i) => {
      let value, label;
      if (typeof cat === "string") {
        value = cat.toLowerCase().replace(/\s+/g, "-");
        label = cat
          .charAt(0)
          .toUpperCase()
          .concat(cat.slice(1).replace(/-/g, " "));
      } else if (cat && typeof cat === "object" && cat.value) {
        value = cat.value;
        label =
          cat.label ||
          cat.name ||
          cat.value.charAt(0).toUpperCase() + cat.value.slice(1);
      } else if (cat && typeof cat === "object" && cat.name) {
        value = cat.name.toLowerCase().replace(/\s+/g, "-");
        label = cat.name.charAt(0).toUpperCase() + cat.name.slice(1);
      } else if (cat && typeof cat === "object") {
        value = cat._id || `category-${i}`;
        label = cat.label || cat.name || cat.title || `Category ${i + 1}`;
      } else {
        value = String(cat);
        label = String(cat).charAt(0).toUpperCase() + String(cat).slice(1);
      }
      if (value && !map.has(value)) map.set(value, { value, label });
    });
    return Array.from(map.values());
  }, [apiCategories]);

  // create / update mutations
  const createMutation = useMutation({
    mutationFn: createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      showToast("Banner created successfully!", "success");
      onClose();
    },
    onError: (error) => {
      showToast(`Failed to create banner: ${error.message}`, "error");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      showToast("Banner updated successfully!", "success");
      onClose();
    },
    onError: (error) => {
      showToast(`Failed to update banner: ${error.message}`, "error");
    },
  });

  // load initialBanner into form
  useEffect(() => {
    if (initialBanner) {
      setFormData({
        title: initialBanner.title || "",
        category:
          initialBanner.category ||
          (categories.length > 0 ? categories[0].value : ""),
        description: initialBanner.description || "",
        buttonText: initialBanner.buttonText || "Shop Now",
        buttonLink: initialBanner.buttonLink || "",
        isActive:
          typeof initialBanner.isActive === "boolean"
            ? initialBanner.isActive
            : true,
        position: initialBanner.position?.toString() || "1",
        videoFile: null,
      });
      const videoUrl = initialBanner.videoUrl || initialBanner.video;
      if (videoUrl) {
        const full = videoUrl.startsWith("http")
          ? videoUrl
          : `${API_BASE_URL}${videoUrl}`;
        setVideoPreview(full);
      } else {
        setVideoPreview("");
      }
    } else {
      setFormData((p) => ({
        title: "",
        category: categories.length > 0 ? categories[0].value : "",
        description: "",
        buttonText: "Shop Now",
        buttonLink: "",
        isActive: true,
        position: "1",
        videoFile: null,
      }));
      setVideoPreview("");
    }
  }, [initialBanner, categories, open]);

  // default category if empty
  useEffect(() => {
    if (categories.length > 0 && !formData.category) {
      setFormData((p) => ({ ...p, category: categories[0].value }));
    }
  }, [categories, formData.category]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
      "video/x-msvideo",
    ];
    if (!validTypes.includes(file.type)) {
      setErrors((p) => ({
        ...p,
        video: "Please select a valid video file (MP4, WebM, OGG, MOV, AVI)",
      }));
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setErrors((p) => ({
        ...p,
        video: "Video size should be less than 50MB",
      }));
      return;
    }

    const preview = URL.createObjectURL(file);
    setVideoPreview(preview);
    setFormData((p) => ({ ...p, videoFile: file }));
    if (errors.video) setErrors((prev) => ({ ...prev, video: "" }));
    showToast("Video uploaded successfully!", "success");
  };

  const validateForm = () => {
    const e = {};
    if (!formData.title.trim()) e.title = "Title is required";
    if (formData.title.length > 100)
      e.title = "Title should be less than 100 characters";
    if (!formData.buttonText.trim()) e.buttonText = "Button text is required";
    if (formData.buttonText.length > 30)
      e.buttonText = "Button text should be less than 30 characters";
    if (!formData.buttonLink.trim()) e.buttonLink = "Button link is required";
    if (!formData.buttonLink.startsWith("http")) {
      e.buttonLink =
        "Please enter a valid URL starting with http:// or https://";
    }
    if (!formData.category.trim()) e.category = "Category is required";
    if (formData.description.length > 500)
      e.description = "Description should be less than 500 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast("Please fix the form errors", "error");
      return;
    }
    const bannerData = {
      ...formData,
      position: parseInt(formData.position || "1", 10),
      _id: initialBanner?._id,
    };

    if (initialBanner) {
      updateMutation.mutate(bannerData);
    } else {
      createMutation.mutate(bannerData);
    }
  };

  useEffect(
    () => () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    },
    [videoPreview]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl my-8 shadow-2xl">
        <div className="sticky top-0 bg-white border-b rounded-t-2xl p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {initialBanner ? "Edit Banner" : "Create New Banner"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-100px)] overflow-y-auto">
          {videoPreview && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Video Preview
              </h3>
              <video
                src={videoPreview}
                className="w-full rounded-xl"
                controls
                muted
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter title"
                    maxLength={100}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-2">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none ${
                      errors.category ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                    rows={4}
                    placeholder="Enter description"
                    maxLength={500}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Button Text *
                    </label>
                    <input
                      type="text"
                      name="buttonText"
                      value={formData.buttonText}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none ${
                        errors.buttonText ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Shop Now"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Button Link *
                  </label>
                  <input
                    type="url"
                    name="buttonLink"
                    value={formData.buttonLink}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none ${
                      errors.buttonLink ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="https://example.com"
                  />
                  {errors.buttonLink && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.buttonLink}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Upload Video
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition cursor-pointer">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      id="videoUpload"
                    />
                    <label htmlFor="videoUpload" className="cursor-pointer">
                      <Upload
                        size={32}
                        className="mx-auto mb-2 text-purple-600"
                      />
                      <p className="text-sm text-gray-700 font-semibold">
                        Upload Video
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        MP4, WebM, Max 50MB
                      </p>
                    </label>
                  </div>
                  {errors.video && (
                    <p className="text-red-500 text-sm mt-2">{errors.video}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-purple-600"
                    id="isActive"
                  />
                  <label
                    htmlFor="isActive"
                    className="text-sm font-medium text-gray-800"
                  >
                    Active (visible on site)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={
                    createMutation.isLoading || updateMutation.isLoading
                  }
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {createMutation.isLoading || updateMutation.isLoading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {initialBanner ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      {initialBanner ? "Update Banner" : "Create Banner"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BannerFormModel;
