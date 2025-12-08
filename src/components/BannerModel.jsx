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

// CREATE: Create new category
const createCategory = async (categoryData) => {
  console.log("📝 Creating category:", categoryData);

  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    });

    const responseData = await response.json();
    console.log("📥 Create Category API Response:", responseData);

    if (!response.ok) {
      const errorMsg =
        responseData.message ||
        responseData.error ||
        `HTTP ${response.status}: Failed to create category`;
      throw new Error(errorMsg);
    }

    return responseData;
  } catch (error) {
    console.error("❌ Create category error:", error);
    throw error;
  }
};

// GET: Fetch categories
const fetchCategories = async () => {
  try {
    console.log("📡 Fetching categories from API...");

    const response = await fetch(
      "https://api.houseofresha.com/banner/?category"
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch categories: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("✅ Categories API Response:", data);

    // If the API returns a simple array of strings like ["men", "women", "unisex"]
    if (Array.isArray(data)) {
      return data.map((item) => {
        if (typeof item === "string") {
          return item;
        } else if (item && typeof item === "object") {
          return (
            item.value || item.name || item.category || JSON.stringify(item)
          );
        }
        return String(item);
      });
    }
    // If the API returns an object with categories property
    else if (data && typeof data === "object") {
      const categoriesArray =
        data.categories || data.data || data.values || Object.values(data);
      if (Array.isArray(categoriesArray)) {
        return categoriesArray.map((item) => {
          if (typeof item === "string") {
            return item;
          } else if (item && typeof item === "object") {
            return (
              item.value || item.name || item.category || JSON.stringify(item)
            );
          }
          return String(item);
        });
      }
    }

    console.warn("⚠️ Unexpected categories API response structure:", data);
    return ["men", "women", "unisex", "glow-ritual", "home"];
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    return ["men", "women", "unisex", "glow-ritual", "home"];
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
  const [sortOrder, setSortOrder] = useState("position");

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", value: "" });
  const [categoryErrors, setCategoryErrors] = useState({});

  // Form state
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

  // ============== TANSTACK QUERY ==============

  // GET: Fetch all banners
  const {
    data: apiResponse = { success: false, banners: [] },
    isLoading: bannersLoading,
    error: bannersError,
    refetch: refetchBanners,
  } = useQuery({
    queryKey: ["banners"],
    queryFn: fetchBanners,
    retry: 2,
    refetchOnWindowFocus: false,
    staleTime: 30000,
  });

  // GET: Fetch categories from API
  const {
    data: apiCategories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    retry: 2,
    refetchOnWindowFocus: false,
    staleTime: 60000,
  });

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

  // POST: Create category mutation (MOVED INSIDE COMPONENT)
  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (data) => {
      console.log("✅ Category created successfully:", data);
      queryClient.invalidateQueries(["categories"]);
      setShowCategoryModal(false);
      setNewCategory({ name: "", value: "" });
      setCategoryErrors({});
      showToast("Category created successfully!", "success");
    },
    onError: (error) => {
      console.error("❌ Category creation failed:", error);
      showToast(`Failed to create category: ${error.message}`, "error");
    },
  });

  // Format categories for dropdown
  const categories = React.useMemo(() => {
    if (!apiCategories || apiCategories.length === 0) {
      console.log("❌ No categories received from API");
      return [
        { value: "men", label: "Men" },
        { value: "women", label: "Women" },
        { value: "unisex", label: "Unisex" },
      ];
    }

    console.log("📊 Raw API categories:", apiCategories);

    // Process categories and remove duplicates
    const categoryMap = new Map();

    apiCategories.forEach((cat, index) => {
      let value, label;

      // Extract value and label based on category type
      if (typeof cat === "string") {
        value = cat.toLowerCase().replace(/\s+/g, "-");
        label = cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, " ");
      }
      // If cat is an object with value property
      else if (cat && typeof cat === "object" && cat.value) {
        value = cat.value;
        label =
          cat.label ||
          cat.name ||
          cat.value.charAt(0).toUpperCase() + cat.value.slice(1);
      }
      // If cat is an object with name property
      else if (cat && typeof cat === "object" && cat.name) {
        value = cat.name.toLowerCase().replace(/\s+/g, "-");
        label = cat.name.charAt(0).toUpperCase() + cat.name.slice(1);
      }
      // If cat is an object but we don't know its structure
      else if (cat && typeof cat === "object") {
        // Try to extract value from object
        value = cat._id || `category-${index}`;
        label = cat.label || cat.name || cat.title || `Category ${index + 1}`;
      }
      // Fallback
      else {
        value = String(cat);
        label = String(cat).charAt(0).toUpperCase() + String(cat).slice(1);
      }

      // Only add to map if not already present (removes duplicates)
      if (value && !categoryMap.has(value)) {
        categoryMap.set(value, { value, label });
      }
    });

    // Convert map back to array
    const formatted = Array.from(categoryMap.values());

    console.log("📋 Formatted categories (duplicates removed):", formatted);
    return formatted;
  }, [apiCategories]);

  // Set default category when categories load
  useEffect(() => {
    if (categories.length > 0 && !formData.category) {
      setFormData((prev) => ({
        ...prev,
        category: categories[0].value,
      }));
    }
  }, [categories, formData.category]);

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

  // ============== EVENT HANDLERS ==============

  const handleEdit = (banner) => {
    console.log("✏️ Editing banner:", banner);
    setEditingBanner(banner);
    setFormData({
      title: banner.title || "",
      category:
        banner.category || (categories.length > 0 ? categories[0].value : ""),
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

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
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
      category: categories.length > 0 ? categories[0].value : "",
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

  // Category handlers
  const handleAddCategory = () => {
    setShowCategoryModal(true);
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "name" &&
        !prev.value && {
          value: value.toLowerCase().replace(/\s+/g, "-"),
        }),
    }));
    if (categoryErrors[name]) {
      setCategoryErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateCategoryForm = () => {
    const newErrors = {};

    if (!newCategory.name.trim()) {
      newErrors.name = "Category name is required";
    }

    if (!newCategory.value.trim()) {
      newErrors.value = "Category value is required";
    }

    // Check if category value already exists
    if (
      categories.some((cat) => cat.value === newCategory.value.toLowerCase())
    ) {
      newErrors.value = "Category value already exists";
    }

    setCategoryErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();

    if (!validateCategoryForm()) {
      showToast("Please fix the category form errors", "error");
      return;
    }

    const categoryData = {
      name: newCategory.name.trim(),
      value: newCategory.value.toLowerCase().trim(),
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    createCategoryMutation.mutate(categoryData);
  };

  const resetCategoryForm = () => {
    setNewCategory({ name: "", value: "" });
    setCategoryErrors({});
    setShowCategoryModal(false);
  };

  // Cleanup video preview URLs
  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  // Combined loading state
  const isLoading = bannersLoading || categoriesLoading;
  const error = bannersError || categoriesError;

  // ============== UI COMPONENTS ==============

  // Banner Card Component
  const BannerCard = ({ banner }) => {
    const videoUrl = banner.videoUrl;
    const fullVideoUrl = videoUrl ? `${API_BASE_URL}${videoUrl}` : null;

    const createdAt = banner.createdAt ? new Date(banner.createdAt) : null;
    const updatedAt = banner.updatedAt ? new Date(banner.updatedAt) : null;

    // Find category label
    const getCategoryLabel = () => {
      if (!banner.category) return "General";

      const foundCategory = categories.find(
        (cat) => cat.value === banner.category
      );
      if (foundCategory) return foundCategory.label;

      // Format category string if not found
      return banner.category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

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
          {getCategoryLabel()}
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
            {bannersLoading && categoriesLoading
              ? "Loading Banners and Categories..."
              : bannersLoading
              ? "Loading Banners..."
              : "Loading Categories..."}
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
                onClick={() => {
                  refetchBanners();
                  refetchCategories();
                }}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                Retry Connection
              </button>
              {categoriesError && (
                <button
                  onClick={() => refetchCategories()}
                  className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} />
                  Retry Categories Only
                </button>
              )}
            </div>
            <div className="mt-6 p-3 bg-gray-100 rounded-lg">
              <p className="text-xs text-gray-600 font-mono break-all">
                API Endpoint: {API_BASE_URL}/banner
              </p>
              {categoriesError && (
                <p className="text-xs text-gray-600 font-mono break-all mt-2">
                  Categories Endpoint: {API_BASE_URL}/banner/?category
                </p>
              )}
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
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {categories.length}
                  </div>
                  <div className="text-xs text-gray-600">Categories</div>
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
              {categoriesError && (
                <button
                  onClick={() => refetchCategories()}
                  className="px-3 py-1.5 bg-yellow-100 text-yellow-700 text-xs rounded-lg hover:bg-yellow-200 transition flex items-center gap-2"
                  title="Retry loading categories"
                >
                  <RefreshCw size={14} />
                  <span className="hidden sm:inline">Retry Categories</span>
                </button>
              )}

              <button
                onClick={() => {
                  refetchBanners();
                  refetchCategories();
                }}
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-full sm:max-w-4xl mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-2xl p-4 sm:p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {editingBanner ? "Edit Banner" : "Create New Banner"}
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">
                  {editingBanner
                    ? `Editing: ${editingBanner.title}`
                    : "Fill in the form below to create a new banner"}
                </p>
              </div>
              <button
                onClick={resetForm}
                className="p-1 sm:p-2 hover:bg-gray-100 rounded-xl transition"
                disabled={createMutation.isLoading || updateMutation.isLoading}
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6">
              {/* Video Preview Section */}
              {videoPreview && (
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <Video className="text-purple-600" size={18} />
                    Video Preview
                  </h3>
                  <div className="relative rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-900 to-gray-800">
                    <video
                      src={videoPreview}
                      className="w-full h-40 sm:h-48 object-cover"
                      controls
                      muted
                      playsInline
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white bg-gradient-to-t from-black/60 to-transparent">
                      <h3 className="text-lg sm:text-xl font-bold mb-2">
                        {formData.title || "Banner Title"}
                      </h3>
                      <button className="px-4 sm:px-6 py-2 bg-white text-gray-900 rounded-lg font-bold hover:bg-gray-100 transition text-sm sm:text-base">
                        {formData.buttonText || "Shop Now"} →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Left Column */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                        Banner Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-sm sm:text-base ${
                          errors.title ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter banner title"
                        maxLength={100}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2">
                          {errors.title}
                        </p>
                      )}
                      <p className="text-gray-500 text-xs mt-1 sm:mt-2">
                        {formData.title.length}/100 characters
                      </p>
                    </div>

                    {/* Category - Fetched from API */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                        Category *
                      </label>

                      {categoriesLoading ? (
                        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-xl bg-gray-50">
                          <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm text-gray-600">
                            Loading categories...
                          </span>
                        </div>
                      ) : categoriesError ? (
                        <div className="space-y-2">
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center gap-2 text-yellow-700 text-sm">
                              <AlertCircle size={16} />
                              <span>Using fallback categories</span>
                            </div>
                          </div>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm sm:text-base"
                          >
                            <option value="">Select a category</option>
                            {categories.map((cat, index) => (
                              <option
                                key={`${cat.value}-${index}`}
                                value={cat.value}
                              >
                                {cat.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : categories.length === 0 ? (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-sm">
                          No categories available in API
                        </div>
                      ) : (
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm sm:text-base ${
                            errors.category
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          required
                        >
                          <option value="">Select a category *</option>
                          {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      )}

                      {errors.category && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2">
                          {errors.category}
                        </p>
                      )}
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-3 p-3 sm:p-4">
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
                          className={`block w-12 h-6 sm:w-14 sm:h-8 md:w-16 md:h-9 rounded-full cursor-pointer transition-all duration-300 ${
                            formData.isActive ? "bg-green-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 sm:top-1 sm:left-1 md:top-1 md:left-1 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 bg-white rounded-full shadow transition-all duration-300 transform ${
                              formData.isActive
                                ? "translate-x-6 sm:translate-x-7 md:translate-x-8"
                                : ""
                            }`}
                          ></span>
                        </label>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {formData.isActive ? "Active" : "Inactive"}
                        </p>
                        <p className="text-xs text-gray-600">
                          {formData.isActive
                            ? "Visible on site"
                            : "Hidden from site"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Button Text & Link */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                          Button Text *
                        </label>
                        <input
                          type="text"
                          name="buttonText"
                          value={formData.buttonText}
                          onChange={handleInputChange}
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm sm:text-base ${
                            errors.buttonText
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="e.g., Shop Now"
                          maxLength={30}
                        />
                        {errors.buttonText && (
                          <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2">
                            {errors.buttonText}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                          Button Link *
                        </label>
                        <input
                          type="url"
                          name="buttonLink"
                          value={formData.buttonLink}
                          onChange={handleInputChange}
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm sm:text-base ${
                            errors.buttonLink
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="https://example.com"
                        />
                        {errors.buttonLink && (
                          <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2">
                            {errors.buttonLink}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Video Upload */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1 sm:mb-2">
                        Upload Video
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-3 sm:p-4 md:p-6 text-center hover:border-purple-400 transition cursor-pointer bg-gradient-to-br from-gray-50 to-white">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="hidden"
                          id="videoUpload"
                        />
                        <label
                          htmlFor="videoUpload"
                          className="cursor-pointer flex flex-col items-center gap-2 sm:gap-3"
                        >
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
                            <Upload
                              size={20}
                              className="sm:w-7 sm:h-7 text-purple-600"
                            />
                          </div>
                          <div>
                            <p className="text-gray-700 font-semibold text-sm sm:text-base">
                              Click to upload video
                            </p>
                            <p className="text-gray-500 text-xs sm:text-sm mt-1">
                              MP4, WebM, OGG, MOV, AVI • Max 50MB
                            </p>
                          </div>
                          {editingBanner?.videoUrl && !formData.videoFile && (
                            <p className="text-green-600 text-xs sm:text-sm mt-1 sm:mt-2">
                              Current video will be kept
                            </p>
                          )}
                        </label>
                      </div>
                      {errors.video && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2">
                          {errors.video}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={
                        createMutation.isLoading || updateMutation.isLoading
                      }
                      className="w-full py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      {createMutation.isLoading || updateMutation.isLoading ? (
                        <>
                          <div className="w-4 h-4 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>
                            {editingBanner ? "Updating..." : "Creating..."}
                          </span>
                        </>
                      ) : editingBanner ? (
                        <>
                          <Save size={18} className="sm:w-5 sm:h-5" />
                          <span>Update Banner</span>
                        </>
                      ) : (
                        <>
                          <Plus size={18} className="sm:w-5 sm:h-5" />
                          <span>Create Banner</span>
                        </>
                      )}
                    </button>
                  </div>
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

      {/* Category Creation Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Create New Category
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Add a new category for banners
                </p>
              </div>
              <button
                onClick={resetCategoryForm}
                className="p-2 hover:bg-gray-100 rounded-xl transition"
                disabled={createCategoryMutation.isLoading}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={newCategory.name}
                  onChange={handleCategoryInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none ${
                    categoryErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., Men's Collection"
                />
                {categoryErrors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {categoryErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Category Value *
                </label>
                <input
                  type="text"
                  name="value"
                  value={newCategory.value}
                  onChange={handleCategoryInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none ${
                    categoryErrors.value ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., mens-collection"
                />
                {categoryErrors.value && (
                  <p className="text-red-500 text-sm mt-1">
                    {categoryErrors.value}
                  </p>
                )}
                <p className="text-gray-500 text-xs mt-2">
                  Used in URLs and API calls (lowercase, hyphens)
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={resetCategoryForm}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-bold"
                  disabled={createCategoryMutation.isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createCategoryMutation.isLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl transition font-bold shadow-lg disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {createCategoryMutation.isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Create Category
                    </>
                  )}
                </button>
              </div>
            </form>
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
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = bannerStyles;
  document.head.appendChild(styleSheet);
}
