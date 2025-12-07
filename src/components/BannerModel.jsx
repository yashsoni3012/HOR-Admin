import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Save,
  X,
  Video,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  ArrowUpDown,
} from "lucide-react";

// API Configuration
const API_BASE_URL = "https://api.houseofresha.com";
// const VIDEO_BASE_URL = 'https://hor-server.onrender.com';

// Utility function to show toast notifications
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

  // Auto remove after 4 seconds
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 4000);
};

// ============== API FUNCTIONS ==============

// GET: Fetch all banners
const fetchBanners = async () => {
  try {
    console.log("📡 Fetching banners from API...");
    const response = await fetch(`${API_BASE_URL}/banner`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ API Response:", data);

    // Handle different response structures
    if (Array.isArray(data)) {
      return { success: true, banners: data };
    } else if (data.data && Array.isArray(data.data)) {
      return { success: true, banners: data.data };
    } else if (data.banners && Array.isArray(data.banners)) {
      return { success: true, banners: data.banners };
    } else if (data.success && Array.isArray(data.banners)) {
      return data;
    }

    console.warn("⚠️ Unexpected API response structure:", data);
    return { success: true, banners: [] };
  } catch (error) {
    console.error("❌ Error fetching banners:", error);
    throw error;
  }
};

// POST: Create new banner
const createBanner = async (bannerData) => {
  console.log("🚀 Creating new banner:", bannerData);

  const formData = new FormData();

  // Required fields
  formData.append("title", bannerData.title.trim());
  formData.append("buttonText", bannerData.buttonText.trim());
  formData.append("buttonLink", bannerData.buttonLink.trim());
  formData.append("category", bannerData.category);
  formData.append("description", bannerData.description?.trim() || "");
  formData.append("isActive", bannerData.isActive);
  formData.append("position", bannerData.position.toString());

  // Optional video file
  if (bannerData.videoFile) {
    console.log("📹 Adding video file:", bannerData.videoFile.name);
    formData.append("video", bannerData.videoFile);
  }

  // Debug: Log FormData contents
  console.log("📋 FormData contents:");
  for (let [key, value] of formData.entries()) {
    console.log(
      `  ${key}:`,
      value instanceof File
        ? `${value.name} (${value.type}, ${value.size} bytes)`
        : value
    );
  }

  try {
    const response = await fetch(`${API_BASE_URL}/banner`, {
      method: "POST",
      body: formData,
      // Note: Don't set Content-Type header for FormData - browser sets it automatically
    });

    const responseData = await response.json();
    console.log("📥 Create API Response:", responseData);

    if (!response.ok) {
      const errorMsg =
        responseData.message ||
        responseData.error ||
        `HTTP ${response.status}: Failed to create banner`;
      throw new Error(errorMsg);
    }

    return responseData;
  } catch (error) {
    console.error("❌ Create banner error:", error);
    throw error;
  }
};

// PUT: Update existing banner
const updateBanner = async (bannerData) => {
  console.log("✏️ Updating banner:", bannerData._id);

  const formData = new FormData();

  // Required fields
  formData.append("title", bannerData.title.trim());
  formData.append("buttonText", bannerData.buttonText.trim());
  formData.append("buttonLink", bannerData.buttonLink.trim());
  formData.append("category", bannerData.category);
  formData.append("description", bannerData.description?.trim() || "");
  formData.append("isActive", bannerData.isActive);
  formData.append("position", bannerData.position.toString());

  // Optional video file (only if new one is provided)
  if (bannerData.videoFile) {
    console.log("📹 Adding new video file:", bannerData.videoFile.name);
    formData.append("video", bannerData.videoFile);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/banner/${bannerData._id}`, {
      method: "PUT",
      body: formData,
    });

    const responseData = await response.json();
    console.log("📥 Update API Response:", responseData);

    if (!response.ok) {
      const errorMsg =
        responseData.message ||
        responseData.error ||
        `HTTP ${response.status}: Failed to update banner`;
      throw new Error(errorMsg);
    }

    return responseData;
  } catch (error) {
    console.error("❌ Update banner error:", error);
    throw error;
  }
};

// DELETE: Remove banner
const deleteBanner = async (bannerId) => {
  console.log("🗑️ Deleting banner:", bannerId);

  try {
    const response = await fetch(`${API_BASE_URL}/banner/${bannerId}`, {
      method: "DELETE",
    });

    const responseData = await response.json();
    console.log("📥 Delete API Response:", responseData);

    if (!response.ok) {
      const errorMsg =
        responseData.message ||
        responseData.error ||
        `HTTP ${response.status}: Failed to delete banner`;
      throw new Error(errorMsg);
    }

    return responseData;
  } catch (error) {
    console.error("❌ Delete banner error:", error);
    throw error;
  }
};

// PATCH: Toggle banner active status
const toggleBannerStatus = async ({ bannerId, isActive }) => {
  console.log(
    "🔄 Toggling banner status:",
    bannerId,
    isActive ? "→ inactive" : "→ active"
  );

  try {
    const response = await fetch(`${API_BASE_URL}/banner/${bannerId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive: !isActive }),
    });

    const responseData = await response.json();
    console.log("📥 Toggle API Response:", responseData);

    if (!response.ok) {
      const errorMsg =
        responseData.message ||
        responseData.error ||
        `HTTP ${response.status}: Failed to toggle banner status`;
      throw new Error(errorMsg);
    }

    return responseData;
  } catch (error) {
    console.error("❌ Toggle status error:", error);
    throw error;
  }
};

// ============== MAIN COMPONENT ==============

const BannerManager = () => {
  const queryClient = useQueryClient();
  const [editingBanner, setEditingBanner] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [videoPreview, setVideoPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [sortOrder, setSortOrder] = useState("position"); // position, date, title

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    category: "men",
    description: "",
    buttonText: "Shop Now",
    buttonLink: "",
    isActive: true,
    position: "1",
    videoFile: null,
  });

  // Categories
  const categories = [
    { value: "men", label: "For Men" },
    { value: "women", label: "For Women" },
    { value: "unisex", label: "Unisex" },
    { value: "glow-ritual", label: "Glow Ritual" },
    { value: "featured", label: "Featured" },
    { value: "new-arrivals", label: "New Arrivals" },
    { value: "sale", label: "Sale" },
  ];

  // ============== TANSTACK QUERY ==============

  // GET: Fetch all banners
  const {
    data: apiResponse = { success: false, banners: [] },
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["banners"],
    queryFn: fetchBanners,
    retry: 2,
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 seconds
  });

  // Process banners data
  const banners = React.useMemo(() => {
    if (!apiResponse) return [];

    let bannersArray = [];

    if (Array.isArray(apiResponse)) {
      bannersArray = apiResponse;
    } else if (apiResponse.banners && Array.isArray(apiResponse.banners)) {
      bannersArray = apiResponse.banners;
    } else if (apiResponse.data && Array.isArray(apiResponse.data)) {
      bannersArray = apiResponse.data;
    } else if (apiResponse.success && apiResponse.banners) {
      bannersArray = apiResponse.banners;
    }

    // Sort banners
    return [...bannersArray].sort((a, b) => {
      switch (sortOrder) {
        case "date":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        case "position":
        default:
          return (a.position || 99) - (b.position || 99);
      }
    });
  }, [apiResponse, sortOrder]);

  // POST: Create mutation
  const createMutation = useMutation({
    mutationFn: createBanner,
    onSuccess: (data) => {
      console.log("✅ Banner created successfully:", data);
      queryClient.invalidateQueries(["banners"]);
      resetForm();
      showToast("Banner created successfully!", "success");
    },
    onError: (error) => {
      console.error("❌ Create failed:", error);
      showToast(`Failed to create banner: ${error.message}`, "error");
    },
  });

  // PUT: Update mutation
  const updateMutation = useMutation({
    mutationFn: updateBanner,
    onSuccess: (data) => {
      console.log("✅ Banner updated successfully:", data);
      queryClient.invalidateQueries(["banners"]);
      resetForm();
      showToast("Banner updated successfully!", "success");
    },
    onError: (error) => {
      console.error("❌ Update failed:", error);
      showToast(`Failed to update banner: ${error.message}`, "error");
    },
  });

  // PATCH: Toggle status mutation
  const toggleMutation = useMutation({
    mutationFn: toggleBannerStatus,
    onMutate: async ({ bannerId, isActive }) => {
      await queryClient.cancelQueries(["banners"]);
      const previousBanners = queryClient.getQueryData(["banners"]);

      queryClient.setQueryData(["banners"], (old) => {
        const oldData = old || { success: false, banners: [] };
        return {
          ...oldData,
          banners: oldData.banners.map((banner) =>
            banner._id === bannerId
              ? { ...banner, isActive: !isActive }
              : banner
          ),
        };
      });

      return { previousBanners };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["banners"], context.previousBanners);
      showToast(`Failed to update status: ${err.message}`, "error");
    },
    onSuccess: () => {
      showToast("Banner status updated!", "success");
    },
    onSettled: () => {
      queryClient.invalidateQueries(["banners"]);
    },
  });

  // DELETE: Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries(["banners"]);
      setDeleteConfirm(null);
      showToast("Banner deleted successfully!", "success");
    },
    onError: (error) => {
      showToast(`Failed to delete banner: ${error.message}`, "error");
    },
  });

  // ============== EVENT HANDLERS ==============

  const handleEdit = (banner) => {
    console.log("✏️ Editing banner:", banner);
    setEditingBanner(banner);
    setFormData({
      title: banner.title || "",
      category: banner.category || "men",
      description: banner.description || "",
      buttonText: banner.buttonText || "Shop Now",
      buttonLink: banner.buttonLink || "",
      isActive: banner.isActive !== undefined ? banner.isActive : true,
      position: banner.position?.toString() || "1",
      videoFile: null,
    });

    // Set video preview if exists
    const videoUrl = banner.videoUrl || banner.video;
    if (videoUrl) {
      const fullUrl = videoUrl.startsWith("http")
        ? videoUrl
        : `${API_BASE_URL}${videoUrl}`;
      setVideoPreview(fullUrl);
    } else {
      setVideoPreview("");
    }

    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingBanner(null);
    resetForm();
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
      "video/x-msvideo",
    ];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        video: "Please select a valid video file (MP4, WebM, OGG, MOV, AVI)",
      }));
      return;
    }

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        video: "Video size should be less than 50MB",
      }));
      return;
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);
    setFormData((prev) => ({ ...prev, videoFile: file }));
    if (errors.video) setErrors((prev) => ({ ...prev, video: "" }));

    showToast("Video uploaded successfully!", "success");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (formData.title.length > 100)
      newErrors.title = "Title should be less than 100 characters";

    if (!formData.buttonText.trim())
      newErrors.buttonText = "Button text is required";
    if (formData.buttonText.length > 30)
      newErrors.buttonText = "Button text should be less than 30 characters";

    if (!formData.buttonLink.trim())
      newErrors.buttonLink = "Button link is required";
    if (!formData.buttonLink.startsWith("http")) {
      newErrors.buttonLink =
        "Please enter a valid URL starting with http:// or https://";
    }

    if (formData.description.length > 500) {
      newErrors.description = "Description should be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("📝 Form submitted");

    if (!validateForm()) {
      showToast("Please fix the form errors", "error");
      return;
    }

    const bannerData = {
      ...formData,
      position: parseInt(formData.position),
      _id: editingBanner?._id,
    };

    console.log("📤 Sending banner data to API:", bannerData);

    if (editingBanner) {
      updateMutation.mutate(bannerData);
    } else {
      createMutation.mutate(bannerData);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "men",
      description: "",
      buttonText: "Shop Now",
      buttonLink: "",
      isActive: true,
      position: "1",
      videoFile: null,
    });

    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }

    setVideoPreview("");
    setErrors({});
    setEditingBanner(null);
    setShowModal(false);
  };

  const handleToggleActive = (banner) => {
    toggleMutation.mutate({
      bannerId: banner._id,
      isActive: banner.isActive,
    });
  };

  const handleDeleteConfirm = (banner) => {
    setDeleteConfirm(banner);
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      deleteMutation.mutate(deleteConfirm._id);
    }
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    showToast(`Sorted by ${order}`, "success");
  };

  // Cleanup video preview URLs
  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  // ============== UI COMPONENTS ==============

  // Banner Card Component
  const BannerCard = ({ banner }) => {
    const videoUrl = banner.videoUrl;
    const fullVideoUrl = videoUrl ? `${API_BASE_URL}${videoUrl}` : null;

    const createdAt = banner.createdAt ? new Date(banner.createdAt) : null;
    const updatedAt = banner.updatedAt ? new Date(banner.updatedAt) : null;

    return (
      <div
        className={`group relative bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
          banner.isActive ? "border-green-400" : "border-gray-300"
        }`}
      >
        {/* Status Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          <span
            className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-lg ${
              banner.isActive
                ? "bg-green-500 text-white"
                : "bg-gray-500 text-white"
            }`}
          >
            {banner.isActive ? "ACTIVE" : "INACTIVE"}
          </span>
          <span className="px-3 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
            POS #{banner.position || 1}
          </span>
        </div>

        {/* Category Badge */}
        <span className="absolute top-3 right-3 px-3 py-1.5 bg-purple-500 text-white text-xs font-bold rounded-full shadow-lg capitalize z-10">
          {banner.category || "general"}
        </span>

        {/* Video Section */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
          {fullVideoUrl ? (
            <>
              <video
                src={fullVideoUrl}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                preload="metadata"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <Video size={48} className="text-gray-400 mb-3" />
              <span className="text-sm text-gray-500">No video uploaded</span>
            </div>
          )}

          {/* Action Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-3">
              <button
                onClick={() => handleToggleActive(banner)}
                disabled={toggleMutation.isLoading}
                className={`p-3.5 rounded-full shadow-lg transition-transform hover:scale-110 ${
                  banner.isActive
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-white disabled:opacity-50`}
                title={banner.isActive ? "Deactivate" : "Activate"}
              >
                {toggleMutation.isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : banner.isActive ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
              <button
                onClick={() => handleEdit(banner)}
                className="p-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-transform hover:scale-110"
                title="Edit"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={() => handleDeleteConfirm(banner)}
                className="p-3.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-transform hover:scale-110"
                title="Delete"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-1">
            {banner.title || "Untitled Banner"}
          </h3>

          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {banner.description || "No description provided"}
          </p>

          <div className="flex items-center justify-between mb-3">
            <a
              href={banner.buttonLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-full hover:shadow-lg transition-all"
            >
              {banner.buttonText || "Button"}
              <ExternalLink size={14} />
            </a>

            <button
              onClick={() => handleEdit(banner)}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              Quick Edit →
            </button>
          </div>

          <div className="pt-3 border-t border-gray-100 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>
                Created: {createdAt ? createdAt.toLocaleDateString() : "N/A"}
              </span>
              {updatedAt && (
                <span>Updated: {updatedAt.toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============== RENDER STATES ==============

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Loading Banners
          </h2>
          <p className="text-gray-600">Fetching data from your API...</p>
          <p className="text-sm text-gray-500 mt-2">{API_BASE_URL}/banner</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border border-red-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-3">
              API Connection Error
            </h2>
            <p className="text-red-600 mb-4">{error.message}</p>
            <div className="space-y-3">
              <button
                onClick={() => refetch()}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                Retry Connection
              </button>
              <button
                onClick={() => window.open(`${API_BASE_URL}/banner`, "_blank")}
                className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <ExternalLink size={18} />
                Test API in Browser
              </button>
            </div>
            <div className="mt-6 p-3 bg-gray-100 rounded-lg">
              <p className="text-xs text-gray-600 font-mono break-all">
                API Endpoint: {API_BASE_URL}/banner
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6">
      {/* Toast container will be added by showToast function */}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Banner Management Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your promotional banners (Total: {banners.length} |
                Active: {banners.filter((b) => b.isActive).length})
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {banners.length}
                  </div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {banners.filter((b) => b.isActive).length}
                  </div>
                  <div className="text-xs text-gray-600">Active</div>
                </div>
              </div>

              <button
                onClick={handleAddNew}
                disabled={createMutation.isLoading}
                className="px-6 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-2"
              >
                <Plus size={20} />
                <span>Create New Banner</span>
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Sort by:
              </span>
              <div className="flex gap-2">
                {["position", "date", "title"].map((sortType) => (
                  <button
                    key={sortType}
                    onClick={() => handleSortChange(sortType)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition ${
                      sortOrder === sortType
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <ArrowUpDown size={14} className="inline mr-1" />
                    {sortType.charAt(0).toUpperCase() + sortType.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                title="Refresh Data"
              >
                <RefreshCw size={18} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-700">
                  {banners.filter((b) => b.isActive).length} banners live
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Banners Grid */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6">
          {banners.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((banner) => (
                  <BannerCard key={banner._id} banner={banner} />
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-gray-600 text-sm">
                  Showing {banners.length} banners • API: {API_BASE_URL}/banner
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl mb-6">
                <Video size={40} className="text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Banners Found
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Create your first promotional banner to showcase products and
                drive sales
              </p>
              <button
                onClick={handleAddNew}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                Create Your First Banner
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Banner Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-2xl p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingBanner ? "Edit Banner" : "Create New Banner"}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {editingBanner
                    ? `Editing: ${editingBanner.title}`
                    : "Fill in the form below to create a new banner"}
                </p>
              </div>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-xl transition"
                disabled={createMutation.isLoading || updateMutation.isLoading}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Video Preview Section */}
              {videoPreview && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Video className="text-purple-600" size={20} />
                    Video Preview
                  </h3>
                  <div className="relative rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-900 to-gray-800">
                    <video
                      src={videoPreview}
                      className="w-full h-48 object-cover"
                      controls
                      muted
                      playsInline
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-gradient-to-t from-black/60 to-transparent">
                      <h3 className="text-xl font-bold mb-2">
                        {formData.title || "Banner Title"}
                      </h3>
                      <p className="text-sm mb-4 opacity-90 line-clamp-2">
                        {formData.description || "Banner description..."}
                      </p>
                      <button className="px-6 py-2 bg-white text-gray-900 rounded-lg font-bold hover:bg-gray-100 transition">
                        {formData.buttonText || "Shop Now"} →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Banner Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition ${
                          errors.title ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter banner title"
                        maxLength={100}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.title}
                        </p>
                      )}
                      <p className="text-gray-500 text-xs mt-2">
                        {formData.title.length}/100 characters
                      </p>
                    </div>

                    {/* Category & Position */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                        >
                          {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Position
                        </label>
                        <select
                          name="position"
                          value={formData.position}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((pos) => (
                            <option key={pos} value={pos}>
                              Position {pos}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none ${
                          errors.description ? "border-red-500" : ""
                        }`}
                        placeholder="Enter banner description (optional)"
                        maxLength={500}
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.description}
                        </p>
                      )}
                      <p className="text-gray-500 text-xs mt-2">
                        {formData.description.length}/500 characters
                      </p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Button Text & Link */}
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
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none ${
                            errors.buttonText
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="e.g., Shop Now"
                          maxLength={30}
                        />
                        {errors.buttonText && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.buttonText}
                          </p>
                        )}
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
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none ${
                            errors.buttonLink
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="https://example.com"
                        />
                        {errors.buttonLink && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.buttonLink}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Video Upload */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Upload Video
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition cursor-pointer bg-gradient-to-br from-gray-50 to-white">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="hidden"
                          id="videoUpload"
                        />
                        <label
                          htmlFor="videoUpload"
                          className="cursor-pointer flex flex-col items-center gap-3"
                        >
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
                            <Upload size={28} className="text-purple-600" />
                          </div>
                          <div>
                            <p className="text-gray-700 font-semibold">
                              Click to upload video
                            </p>
                            <p className="text-gray-500 text-sm mt-1">
                              MP4, WebM, OGG, MOV, AVI • Max 50MB
                            </p>
                          </div>
                          {editingBanner?.videoUrl && !formData.videoFile && (
                            <p className="text-green-600 text-sm mt-2">
                              Current video will be kept
                            </p>
                          )}
                        </label>
                      </div>
                      {errors.video && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.video}
                        </p>
                      )}
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-100">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                          className="sr-only"
                          id="isActiveToggle"
                        />
                        <label
                          htmlFor="isActiveToggle"
                          className={`block w-14 h-8 rounded-full cursor-pointer transition-all duration-300 ${
                            formData.isActive ? "bg-green-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`block w-6 h-6 mt-1 ml-1 rounded-full bg-white transition-all duration-300 transform ${
                              formData.isActive ? "translate-x-6" : ""
                            }`}
                          ></span>
                        </label>
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-700 block">
                          Set as Active
                        </label>
                        <p className="text-gray-500 text-xs">
                          {formData.isActive
                            ? "Banner will be visible on the website"
                            : "Banner will be hidden"}
                        </p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={
                        createMutation.isLoading || updateMutation.isLoading
                      }
                      className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {createMutation.isLoading || updateMutation.isLoading ? (
                        <>
                          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>
                            {editingBanner ? "Updating..." : "Creating..."}
                          </span>
                        </>
                      ) : editingBanner ? (
                        <>
                          <Save size={20} />
                          <span>Update Banner</span>
                        </>
                      ) : (
                        <>
                          <Plus size={20} />
                          <span>Create Banner</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* API Info */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-center text-gray-500 text-sm">
                    Data will be saved to:{" "}
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {API_BASE_URL}/banner
                    </code>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex items-center gap-4 text-red-600 mb-6">
              <div className="p-4 bg-red-50 rounded-2xl">
                <Trash2 size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Delete Banner?</h3>
                <p className="text-red-500 text-sm">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
              <h4 className="font-bold text-gray-800 mb-2">
                "{deleteConfirm.title || "Untitled Banner"}"
              </h4>
              <p className="text-gray-700">
                Are you sure you want to permanently delete this banner? All
                associated data including video files will be removed from the
                API database.
              </p>
              {deleteConfirm.videoUrl && (
                <p className="text-sm text-gray-600 mt-3">
                  ⚠️ Video file will also be deleted
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-bold"
                disabled={deleteMutation.isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:shadow-xl transition font-bold shadow-lg disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {deleteMutation.isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete Permanently
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-gray-500 text-xs mt-6">
              API Endpoint:{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">
                {API_BASE_URL}/banner/{deleteConfirm._id}
              </code>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManager;

// Add CSS styles
const bannerStyles = `
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #9333ea, #ec4899);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #7e22ce, #db2777);
}

/* Modal scrollbar */
.modal-scroll {
  scrollbar-width: thin;
  scrollbar-color: #9333ea #f1f1f1;
}
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.textContent = bannerStyles;
document.head.appendChild(styleSheet);
