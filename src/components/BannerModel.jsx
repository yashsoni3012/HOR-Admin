// import React, { useState, useEffect } from "react";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import {
//   Plus,
//   Edit,
//   Trash2,
//   Eye,
//   EyeOff,
//   Upload,
//   Save,
//   X,
//   Video,
//   RefreshCw,
//   AlertCircle,
//   ExternalLink,
//   ArrowUpDown,
// } from "lucide-react";
// import { queryClient } from "../lib/api"; // adjust path

// // Hard-coded API base for banners (your working API)
// const API_BASE_URL = "https://api.houseofresha.com";

// // ================== Toast ==================

// const showToast = (message, type = "success") => {
//   const toastContainer =
//     document.getElementById("toast-container") ||
//     (() => {
//       const container = document.createElement("div");
//       container.id = "toast-container";
//       container.className = "fixed top-4 right-4 z-50 flex flex-col gap-3";
//       document.body.appendChild(container);
//       return container;
//     })();

//   const toastId = `toast-${Date.now()}`;
//   const toast = document.createElement("div");
//   toast.id = toastId;
//   toast.className = `px-6 py-4 rounded-xl shadow-2xl font-bold text-white animate-slide-in ${
//     type === "success"
//       ? "bg-gradient-to-r from-green-500 to-emerald-600"
//       : "bg-gradient-to-r from-red-500 to-pink-600"
//   }`;

//   toast.innerHTML = `
//     <div class="flex items-center gap-3">
//       ${
//         type === "success"
//           ? '<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>'
//           : '<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>'
//       }
//       <span>${message}</span>
//     </div>
//   `;

//   toastContainer.appendChild(toast);

//   setTimeout(() => {
//     toast.style.opacity = "0";
//     toast.style.transform = "translateX(100%)";
//     setTimeout(() => {
//       if (toast.parentNode) toast.parentNode.removeChild(toast);
//     }, 300);
//   }, 4000);
// };

// // ================== API functions ==================

// // GET: /banner
// const fetchBanners = async () => {
//   const res = await fetch(`${API_BASE_URL}/banner`);
//   if (!res.ok) {
//     throw new Error(`API Error: ${res.status} ${res.statusText}`);
//   }
//   const data = await res.json();

//   if (Array.isArray(data)) return { success: true, banners: data };
//   if (Array.isArray(data?.data)) return { success: true, banners: data.data };
//   if (Array.isArray(data?.banners))
//     return { success: true, banners: data.banners };
//   if (data?.success && Array.isArray(data.banners)) return data;

//   return { success: true, banners: [] };
// };

// // POST: /banner
// const createBanner = async (bannerData) => {
//   const formData = new FormData();
//   formData.append("title", bannerData.title.trim());
//   formData.append("buttonText", bannerData.buttonText.trim());
//   formData.append("buttonLink", bannerData.buttonLink.trim());
//   formData.append("category", bannerData.category);
//   formData.append("description", bannerData.description?.trim() || "");
//   formData.append("isActive", bannerData.isActive ? "true" : "false");
//   formData.append("position", bannerData.position.toString());
//   if (bannerData.videoFile) formData.append("video", bannerData.videoFile);

//   const res = await fetch(`${API_BASE_URL}/banner`, {
//     method: "POST",
//     body: formData,
//   });
//   const data = await res.json().catch(() => ({}));
//   if (!res.ok) {
//     throw new Error(
//       data.message || data.error || `HTTP ${res.status}: Failed to create`
//     );
//   }
//   return data;
// };

// // PUT: /banner/:id
// const updateBanner = async (bannerData) => {
//   if (!bannerData._id) throw new Error("Missing banner _id");
//   const formData = new FormData();
//   formData.append("title", bannerData.title.trim());
//   formData.append("buttonText", bannerData.buttonText.trim());
//   formData.append("buttonLink", bannerData.buttonLink.trim());
//   formData.append("category", bannerData.category);
//   formData.append("description", bannerData.description?.trim() || "");
//   formData.append("isActive", bannerData.isActive ? "true" : "false");
//   formData.append("position", bannerData.position.toString());
//   if (bannerData.videoFile) formData.append("video", bannerData.videoFile);

//   const res = await fetch(`${API_BASE_URL}/clothing/${id}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });

//   const data = await res.json().catch(() => ({}));
//   if (!res.ok) {
//     throw new Error(
//       data.message || data.error || `HTTP ${res.status}: Failed to update`
//     );
//   }
//   return data;
// };

// // DELETE: /banner/:id
// const deleteBanner = async (id) => {
//   const res = await fetch(`${API_BASE_URL}/banner/${id}`, {
//     method: "DELETE",
//   });
//   const data = await res.json().catch(() => ({}));
//   if (!res.ok) {
//     throw new Error(
//       data.message || data.error || `HTTP ${res.status}: Failed to delete`
//     );
//   }
//   return data;
// };

// // PATCH: /banner/:id/status
// // In your api.js file
// const toggleBannerStatus = async ({ bannerId, isActive }) => {
//   console.log(
//     "🔄 Toggling banner status:",
//     bannerId,
//     isActive ? "→ inactive" : "→ active"
//   );

//   try {
//     const response = await fetch(`${BASE_URL}/banner/${bannerId}/status`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ isActive: !isActive }), // Send the opposite of current status
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(
//         errorData.message ||
//           errorData.error ||
//           `HTTP ${response.status}: Failed to toggle banner status`
//       );
//     }

//     return response.json();
//   } catch (error) {
//     console.error("❌ Toggle status error:", error);
//     throw error;
//   }
// };

// // GET: /banner/?category
// const fetchCategories = async () => {
//   const res = await fetch(`${API_BASE_URL}/banner/?category`);
//   if (!res.ok) {
//     throw new Error(
//       `Failed to fetch categories: ${res.status} ${res.statusText}`
//     );
//   }
//   const data = await res.json();

//   if (Array.isArray(data)) {
//     return data.map((item) =>
//       typeof item === "string"
//         ? item
//         : item.value || item.name || item.category || JSON.stringify(item)
//     );
//   }
//   if (data && typeof data === "object") {
//     const arr =
//       data.categories || data.data || data.values || Object.values(data);
//     if (Array.isArray(arr)) {
//       return arr.map((item) =>
//         typeof item === "string"
//           ? item
//           : item.value || item.name || item.category || JSON.stringify(item)
//       );
//     }
//   }
//   return ["men", "women", "unisex", "glow-ritual", "home"];
// };

// // ================== Component ==================

// const BannerManager = () => {
//   const [editingBanner, setEditingBanner] = useState(null);
//   const [deleteConfirm, setDeleteConfirm] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [videoPreview, setVideoPreview] = useState("");
//   const [errors, setErrors] = useState({});
//   const [sortOrder, setSortOrder] = useState("position");

//   const [showCategoryModal, setShowCategoryModal] = useState(false);
//   const [newCategory, setNewCategory] = useState({ name: "", value: "" });
//   const [categoryErrors, setCategoryErrors] = useState({});
//   const [togglingBannerId, setTogglingBannerId] = useState(null);

//   const [formData, setFormData] = useState({
//     title: "",
//     category: "",
//     description: "",
//     buttonText: "Shop Now",
//     buttonLink: "",
//     isActive: true,
//     position: "1",
//     videoFile: null,
//   });

//   // Queries
//   const {
//     data: apiResponse = { success: false, banners: [] },
//     isLoading: bannersLoading,
//     error: bannersError,
//     refetch: refetchBanners,
//   } = useQuery({
//     queryKey: ["banners"],
//     queryFn: fetchBanners,
//     retry: 2,
//     refetchOnWindowFocus: false,
//     staleTime: 30000,
//   });

//   const {
//     data: apiCategories = [],
//     isLoading: categoriesLoading,
//     error: categoriesError,
//     refetch: refetchCategories,
//   } = useQuery({
//     queryKey: ["categories"],
//     queryFn: fetchCategories,
//     retry: 2,
//     refetchOnWindowFocus: false,
//     staleTime: 60000,
//   });

//   // Mutations
//   const createMutation = useMutation({
//     mutationFn: createBanner,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["banners"] });
//       resetForm();
//       showToast("Banner created successfully!", "success");
//     },
//     onError: (error) => {
//       showToast(`Failed to create banner: ${error.message}`, "error");
//     },
//   });

//   const updateMutation = useMutation({
//     mutationFn: updateBanner,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["banners"] });
//       resetForm();
//       showToast("Banner updated successfully!", "success");
//     },
//     onError: (error) => {
//       showToast(`Failed to update banner: ${error.message}`, "error");
//     },
//   });

//   const toggleMutation = useMutation({
//     mutationFn: ({ bannerId, isActive }) => {
//       console.log("Calling toggleStatus with:", bannerId, isActive);
//       return api.banner.toggleStatus(bannerId, isActive);
//     },
//     onMutate: async ({ bannerId, isActive }) => {
//       setTogglingBannerId(bannerId); // Set loading for this specific banner
//       await queryClient.cancelQueries({ queryKey: ["banners"] });

//       const previous = queryClient.getQueryData(["banners"]);

//       // Optimistically update the UI
//       queryClient.setQueryData(["banners"], (old) => {
//         const oldData = old || { success: false, banners: [] };
//         return {
//           ...oldData,
//           banners: oldData.banners.map((b) =>
//             b._id === bannerId ? { ...b, isActive: !isActive } : b
//           ),
//         };
//       });

//       return { previous };
//     },
//     onError: (err, { bannerId, isActive }, ctx) => {
//       console.error("Toggle error:", err);

//       // Revert optimistic update
//       if (ctx?.previous) {
//         queryClient.setQueryData(["banners"], ctx.previous);
//       }

//       showToast(`Failed to update status: ${err.message}`, "error");
//     },
//     onSuccess: (data, { bannerId, isActive }) => {
//       console.log("Toggle success:", data);
//       showToast(
//         `Banner ${!isActive ? "activated" : "deactivated"} successfully!`,
//         "success"
//       );
//     },
//     onSettled: (data, error, { bannerId }) => {
//       // Clear loading state for this banner
//       setTogglingBannerId(null);

//       // Refetch to ensure UI is in sync with server
//       queryClient.invalidateQueries({ queryKey: ["banners"] });
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: deleteBanner,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["banners"] });
//       setDeleteConfirm(null);
//       showToast("Banner deleted successfully!", "success");
//     },
//     onError: (error) => {
//       showToast(`Failed to delete banner: ${error.message}`, "error");
//     },
//   });

//   const createCategoryMutation = useMutation({
//     mutationFn: async (categoryData) => {
//       const res = await fetch(`${API_BASE_URL}/banner`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(categoryData),
//       });
//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) {
//         throw new Error(
//           data.message ||
//             data.error ||
//             `HTTP ${res.status}: Failed to create category`
//         );
//       }
//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["categories"] });
//       setShowCategoryModal(false);
//       setNewCategory({ name: "", value: "" });
//       setCategoryErrors({});
//       showToast("Category created successfully!", "success");
//     },
//     onError: (error) => {
//       showToast(`Failed to create category: ${error.message}`, "error");
//     },
//   });

//   // Categories formatting
//   const categories = React.useMemo(() => {
//     if (!apiCategories || apiCategories.length === 0) {
//       return [
//         { value: "men", label: "Men" },
//         { value: "women", label: "Women" },
//         { value: "unisex", label: "Unisex" },
//       ];
//     }
//     const map = new Map();
//     apiCategories.forEach((cat, i) => {
//       let value, label;
//       if (typeof cat === "string") {
//         value = cat.toLowerCase().replace(/\s+/g, "-");
//         label = cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, " ");
//       } else if (cat && typeof cat === "object" && cat.value) {
//         value = cat.value;
//         label =
//           cat.label ||
//           cat.name ||
//           cat.value.charAt(0).toUpperCase() + cat.value.slice(1);
//       } else if (cat && typeof cat === "object" && cat.name) {
//         value = cat.name.toLowerCase().replace(/\s+/g, "-");
//         label = cat.name.charAt(0).toUpperCase() + cat.name.slice(1);
//       } else if (cat && typeof cat === "object") {
//         value = cat._id || `category-${i}`;
//         label = cat.label || cat.name || cat.title || `Category ${i + 1}`;
//       } else {
//         value = String(cat);
//         label = String(cat).charAt(0).toUpperCase() + String(cat).slice(1);
//       }
//       if (value && !map.has(value)) map.set(value, { value, label });
//     });
//     return Array.from(map.values());
//   }, [apiCategories]);

//   // Default category
//   useEffect(() => {
//     if (categories.length > 0 && !formData.category) {
//       setFormData((p) => ({ ...p, category: categories[0].value }));
//     }
//   }, [categories, formData.category]);

//   // Banners data
//   const banners = React.useMemo(() => {
//     if (!apiResponse) return [];
//     let arr = [];
//     if (Array.isArray(apiResponse)) arr = apiResponse;
//     else if (Array.isArray(apiResponse.banners)) arr = apiResponse.banners;
//     else if (Array.isArray(apiResponse.data)) arr = apiResponse.data;
//     else if (apiResponse.success && apiResponse.banners)
//       arr = apiResponse.banners;

//     return [...arr].sort((a, b) => {
//       switch (sortOrder) {
//         case "date":
//           return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
//         case "title":
//           return (a.title || "").localeCompare(b.title || "");
//         case "position":
//         default:
//           return (a.position || 99) - (b.position || 99);
//       }
//     });
//   }, [apiResponse, sortOrder]);

//   // Handlers
//   const handleEdit = (banner) => {
//     setEditingBanner(banner);
//     setFormData({
//       title: banner.title || "",
//       category:
//         banner.category || (categories.length > 0 ? categories[0].value : ""),
//       description: banner.description || "",
//       buttonText: banner.buttonText || "Shop Now",
//       buttonLink: banner.buttonLink || "",
//       isActive: typeof banner.isActive === "boolean" ? banner.isActive : true,
//       position: banner.position?.toString() || "1",
//       videoFile: null,
//     });

//     const videoUrl = banner.videoUrl || banner.video;
//     if (videoUrl) {
//       const full = videoUrl.startsWith("http")
//         ? videoUrl
//         : `${API_BASE_URL}${videoUrl}`;
//       setVideoPreview(full);
//     } else {
//       setVideoPreview("");
//     }

//     setShowModal(true);
//   };

//   const handleAddNew = () => {
//     setEditingBanner(null);
//     resetForm();
//     setShowModal(true);
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((p) => ({
//       ...p,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const handleVideoUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const validTypes = [
//       "video/mp4",
//       "video/webm",
//       "video/ogg",
//       "video/quicktime",
//       "video/x-msvideo",
//     ];
//     if (!validTypes.includes(file.type)) {
//       setErrors((p) => ({
//         ...p,
//         video: "Please select a valid video file (MP4, WebM, OGG, MOV, AVI)",
//       }));
//       return;
//     }
//     if (file.size > 50 * 1024 * 1024) {
//       setErrors((p) => ({
//         ...p,
//         video: "Video size should be less than 50MB",
//       }));
//       return;
//     }

//     const preview = URL.createObjectURL(file);
//     setVideoPreview(preview);
//     setFormData((p) => ({ ...p, videoFile: file }));
//     if (errors.video) setErrors((prev) => ({ ...prev, video: "" }));
//     showToast("Video uploaded successfully!", "success");
//   };

//   const validateForm = () => {
//     const e = {};
//     if (!formData.title.trim()) e.title = "Title is required";
//     if (formData.title.length > 100)
//       e.title = "Title should be less than 100 characters";
//     if (!formData.buttonText.trim()) e.buttonText = "Button text is required";
//     if (formData.buttonText.length > 30)
//       e.buttonText = "Button text should be less than 30 characters";
//     if (!formData.buttonLink.trim()) e.buttonLink = "Button link is required";
//     if (!formData.buttonLink.startsWith("http")) {
//       e.buttonLink =
//         "Please enter a valid URL starting with http:// or https://";
//     }
//     if (!formData.category.trim()) e.category = "Category is required";
//     if (formData.description.length > 500)
//       e.description = "Description should be less than 500 characters";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validateForm()) {
//       showToast("Please fix the form errors", "error");
//       return;
//     }
//     const bannerData = {
//       ...formData,
//       position: parseInt(formData.position || "1", 10),
//       _id: editingBanner?._id,
//     };

//     if (editingBanner) {
//       updateMutation.mutate(bannerData);
//     } else {
//       createMutation.mutate(bannerData);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       title: "",
//       category: categories.length > 0 ? categories[0].value : "",
//       description: "",
//       buttonText: "Shop Now",
//       buttonLink: "",
//       isActive: true,
//       position: "1",
//       videoFile: null,
//     });
//     if (videoPreview) URL.revokeObjectURL(videoPreview);
//     setVideoPreview("");
//     setErrors({});
//     setEditingBanner(null);
//     setShowModal(false);
//   };

//   const handleToggleActive = async (banner) => {
//     setTogglingBannerId(banner._id);

//     try {
//       await toggleMutation.mutateAsync({
//         bannerId: banner._id,
//         isActive: banner.isActive,
//       });
//     } catch (error) {
//       console.error("Toggle failed:", error);
//     } finally {
//       setTogglingBannerId(null);
//     }
//   };

//   const handleDeleteConfirm = (banner) => {
//     setDeleteConfirm(banner);
//   };

//   const handleDelete = () => {
//     if (deleteConfirm) deleteMutation.mutate(deleteConfirm._id);
//   };

//   const handleSortChange = (order) => {
//     setSortOrder(order);
//     showToast(`Sorted by ${order}`, "success");
//   };

//   // Category handlers
//   const handleCategoryInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewCategory((p) => ({
//       ...p,
//       [name]: value,
//       ...(name === "name" &&
//         !p.value && { value: value.toLowerCase().replace(/\s+/g, "-") }),
//     }));
//     if (categoryErrors[name])
//       setCategoryErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const validateCategoryForm = () => {
//     const e = {};
//     if (!newCategory.name.trim()) e.name = "Category name is required";
//     if (!newCategory.value.trim()) e.value = "Category value is required";
//     if (
//       categories.some((c) => c.value === newCategory.value.toLowerCase().trim())
//     ) {
//       e.value = "Category value already exists";
//     }
//     setCategoryErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleCategorySubmit = (e) => {
//     e.preventDefault();
//     if (!validateCategoryForm()) {
//       showToast("Please fix the category form errors", "error");
//       return;
//     }
//     const payload = {
//       name: newCategory.name.trim(),
//       value: newCategory.value.toLowerCase().trim(),
//       createdAt: new Date().toISOString(),
//       isActive: true,
//     };
//     createCategoryMutation.mutate(payload);
//   };

//   const resetCategoryForm = () => {
//     setNewCategory({ name: "", value: "" });
//     setCategoryErrors({});
//     setShowCategoryModal(false);
//   };

//   // Cleanup preview URL
//   useEffect(
//     () => () => {
//       if (videoPreview) URL.revokeObjectURL(videoPreview);
//     },
//     [videoPreview]
//   );

//   const isLoading = bannersLoading || categoriesLoading;
//   const error = bannersError || categoriesError;

//   // Card component (same UI)
//   const BannerCard = ({ banner }) => {
//     const videoUrl = banner.videoUrl || banner.video;
//     const fullVideoUrl = videoUrl
//       ? /**
//          * your API gives: "/uploads/banner_videos/...mp4"
//          */
//         videoUrl.startsWith("http")
//         ? videoUrl
//         : `${API_BASE_URL}${videoUrl}`
//       : null;

//     const createdAt = banner.createdAt ? new Date(banner.createdAt) : null;
//     const updatedAt = banner.updatedAt ? new Date(banner.updatedAt) : null;

//     const getCategoryLabel = () => {
//       if (!banner.category) return "General";
//       const found = categories.find((c) => c.value === banner.category);
//       if (found) return found.label;
//       return banner.category
//         .split("-")
//         .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
//         .join(" ");
//     };

//     return (
//       <div
//         className={`group relative bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
//           banner.isActive ? "border-green-400" : "border-gray-300"
//         }`}
//       >
//         {/* Status badge */}
//         <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
//           <span
//             className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-lg ${
//               banner.isActive
//                 ? "bg-green-500 text-white"
//                 : "bg-gray-500 text-white"
//             }`}
//           >
//             {banner.isActive ? "ACTIVE" : "INACTIVE"}
//           </span>
//         </div>

//         {/* Category badge */}
//         <span className="absolute top-3 right-3 px-3 py-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-semibold rounded-full shadow-lg capitalize z-10 border border-white/20">
//           {getCategoryLabel()}
//         </span>

//         {/* Video */}
//         <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
//           {fullVideoUrl ? (
//             <>
//               <video
//                 src={fullVideoUrl}
//                 className="w-full h-full object-cover"
//                 muted
//                 loop
//                 playsInline
//                 preload="metadata"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
//             </>
//           ) : (
//             <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
//               <Video size={48} className="text-gray-400 mb-3" />
//               <span className="text-sm text-gray-500">No video uploaded</span>
//             </div>
//           )}
//         </div>

//         {/* Content */}
//         <div className="p-5">
//           <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-1">
//             {banner.title || "Untitled Banner"}
//           </h3>

//           <p className="text-sm text-gray-600 line-clamp-2 mb-4">
//             {banner.description || "No description provided"}
//           </p>

//           <div className="flex items-center justify-between mb-3">
//             <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-full">
//               <span>{banner.buttonText || "Button Text"}</span>
//               <ExternalLink size={12} className="text-slate-500" />
//             </div>

//             <button
//               onClick={() => handleEdit(banner)}
//               className="text-sm text-purple-600 hover:text-purple-800 font-medium"
//             >
//               Quick Edit →
//             </button>
//           </div>

//           <div className="pt-3 mb-4 border-t border-gray-100 text-xs text-gray-500">
//             <div className="flex justify-between">
//               <span>
//                 Created: {createdAt ? createdAt.toLocaleDateString() : "N/A"}
//               </span>
//               {updatedAt && (
//                 <span>Updated: {updatedAt.toLocaleDateString()}</span>
//               )}
//             </div>
//           </div>

//           {/* Action Buttons - All Below Card Content */}
//           <div className="grid grid-cols-3 gap-2 mt-4">
//             <button
//               onClick={() => handleToggleActive(banner)}
//               disabled={togglingBannerId === banner._id}
//               className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
//                 banner.isActive
//                   ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
//                   : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
//               } disabled:opacity-50 disabled:cursor-not-allowed`}
//               title={banner.isActive ? "Hide banner" : "Show banner"}
//             >
//               {togglingBannerId === banner._id ? (
//                 <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
//               ) : banner.isActive ? (
//                 <>
//                   <EyeOff size={12} />
//                   <span>Hide</span>
//                 </>
//               ) : (
//                 <>
//                   <Eye size={12} />
//                   <span>Show</span>
//                 </>
//               )}
//             </button>

//             <button
//               onClick={() => handleEdit(banner)}
//               className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-xs sm:text-sm font-semibold transition-all"
//               title="Edit"
//             >
//               <Edit size={16} className="sm:w-4 sm:h-4" />
//               <span>Edit</span>
//             </button>

//             <button
//               onClick={() => handleDeleteConfirm(banner)}
//               className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs sm:text-sm font-semibold transition-all"
//               title="Delete"
//             >
//               <Trash2 size={16} className="sm:w-4 sm:h-4" />
//               <span>Delete</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Loading & error
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-6" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">
//             Loading Banners...
//           </h2>
//           {/* <p className="text-gray-600">Fetching data from your API...</p> */}
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
//         <div className="max-w-md w-full">
//           <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border border-red-200">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <AlertCircle size={32} className="text-red-600" />
//             </div>
//             <h2 className="text-2xl font-bold text-red-800 mb-3">
//               API Connection Error
//             </h2>
//             <p className="text-red-600 mb-4">{error.message}</p>
//             <button
//               onClick={() => {
//                 refetchBanners();
//                 refetchCategories();
//               }}
//               className="w-full py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
//             >
//               <RefreshCw size={18} />
//               Retry Connection
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Main UI (header, controls, grid, modals)
//   const activeCount = banners.filter((b) => b.isActive).length;

//   return (
//     <div className="">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
//           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//                 Banner Management
//               </h1>
//               <p className="text-gray-600 mt-2 text-sm sm:text-base">
//                 Manage your promotional banners
//               </p>
//             </div>

//             <div className="flex flex-wrap items-center gap-4">
//               <div className="flex items-center gap-4">
//                 <div className="text-center">
//                   <div className="text-xl sm:text-2xl font-bold text-gray-900">
//                     {banners.length}
//                   </div>
//                   <div className="text-xs text-gray-600">Total</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-xl sm:text-2xl font-bold text-green-600">
//                     {activeCount}
//                   </div>
//                   <div className="text-xs text-gray-600">Active</div>
//                 </div>
//               </div>

//               <button
//                 onClick={handleAddNew}
//                 className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm sm:text-base"
//               >
//                 <Plus size={18} />
//                 <span className="hidden sm:inline">Create Banner</span>
//                 <span className="sm:hidden">Create</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Controls */}
//         <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <div className="flex flex-wrap items-center gap-2">
//               <span className="text-sm font-medium text-gray-700">
//                 Sort by:
//               </span>
//               {["date", "title"].map((sortType) => (
//                 <button
//                   key={sortType}
//                   onClick={() => handleSortChange(sortType)}
//                   className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg transition ${
//                     sortOrder === sortType
//                       ? "bg-purple-600 text-white"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   {sortType.charAt(0).toUpperCase() + sortType.slice(1)}
//                 </button>
//               ))}
//             </div>

//             <button
//               onClick={() => {
//                 refetchBanners();
//                 refetchCategories();
//               }}
//               className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 text-sm"
//             >
//               <RefreshCw size={16} />
//               Refresh
//             </button>
//           </div>
//         </div>

//         {/* Grid */}
//         {banners.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {banners.map((banner) => (
//               <BannerCard key={banner._id} banner={banner} />
//             ))}
//           </div>
//         ) : (
//           <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
//             <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl mb-6">
//               <Video size={40} className="text-purple-600" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900 mb-3">
//               No Banners Found
//             </h3>
//             <p className="text-gray-600 mb-8 max-w-md mx-auto">
//               Create your first promotional banner
//             </p>
//             <button
//               onClick={handleAddNew}
//               className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all"
//             >
//               Create Your First Banner
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
//           <div className="bg-white rounded-2xl w-full max-w-4xl my-8 shadow-2xl">
//             <div className="sticky top-0 bg-white border-b rounded-t-2xl p-6 flex items-center justify-between z-10">
//               <div>
//                 <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
//                   {editingBanner ? "Edit Banner" : "Create New Banner"}
//                 </h2>
//               </div>
//               <button
//                 onClick={resetForm}
//                 className="p-2 hover:bg-gray-100 rounded-xl"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             <div className="p-6 max-h-[calc(90vh-100px)] overflow-y-auto">
//               {videoPreview && (
//                 <div className="mb-6">
//                   <h3 className="text-lg font-bold text-gray-900 mb-4">
//                     Video Preview
//                   </h3>
//                   <video
//                     src={videoPreview}
//                     className="w-full rounded-xl"
//                     controls
//                     muted
//                   />
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   <div className="space-y-6">
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">
//                         Title *
//                       </label>
//                       <input
//                         type="text"
//                         name="title"
//                         value={formData.title}
//                         onChange={handleInputChange}
//                         className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none ${
//                           errors.title ? "border-red-500" : "border-gray-300"
//                         }`}
//                         placeholder="Enter title"
//                         maxLength={100}
//                       />
//                       {errors.title && (
//                         <p className="text-red-500 text-sm mt-2">
//                           {errors.title}
//                         </p>
//                       )}
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">
//                         Category *
//                       </label>
//                       <select
//                         name="category"
//                         value={formData.category}
//                         onChange={handleInputChange}
//                         className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none ${
//                           errors.category ? "border-red-500" : "border-gray-300"
//                         }`}
//                       >
//                         <option value="">Select category</option>
//                         {categories.map((cat) => (
//                           <option key={cat.value} value={cat.value}>
//                             {cat.label}
//                           </option>
//                         ))}
//                       </select>
//                       {errors.category && (
//                         <p className="text-red-500 text-sm mt-2">
//                           {errors.category}
//                         </p>
//                       )}
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">
//                         Description
//                       </label>
//                       <textarea
//                         name="description"
//                         value={formData.description}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
//                         rows={4}
//                         placeholder="Enter description"
//                         maxLength={500}
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-6">
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-bold text-gray-700 mb-2">
//                           Button Text *
//                         </label>
//                         <input
//                           type="text"
//                           name="buttonText"
//                           value={formData.buttonText}
//                           onChange={handleInputChange}
//                           className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none ${
//                             errors.buttonText
//                               ? "border-red-500"
//                               : "border-gray-300"
//                           }`}
//                           placeholder="Shop Now"
//                         />
//                       </div>
//                       {/* <div>
//                         <label className="block text-sm font-bold text-gray-700 mb-2">
//                           Position
//                         </label>
//                         <input
//                           type="number"
//                           name="position"
//                           value={formData.position}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
//                           min="1"
//                         />
//                       </div> */}
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">
//                         Button Link *
//                       </label>
//                       <input
//                         type="url"
//                         name="buttonLink"
//                         value={formData.buttonLink}
//                         onChange={handleInputChange}
//                         className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none ${
//                           errors.buttonLink
//                             ? "border-red-500"
//                             : "border-gray-300"
//                         }`}
//                         placeholder="https://example.com"
//                       />
//                       {errors.buttonLink && (
//                         <p className="text-red-500 text-sm mt-2">
//                           {errors.buttonLink}
//                         </p>
//                       )}
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">
//                         Upload Video
//                       </label>
//                       <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition cursor-pointer">
//                         <input
//                           type="file"
//                           accept="video/*"
//                           onChange={handleVideoUpload}
//                           className="hidden"
//                           id="videoUpload"
//                         />
//                         <label htmlFor="videoUpload" className="cursor-pointer">
//                           <Upload
//                             size={32}
//                             className="mx-auto mb-2 text-purple-600"
//                           />
//                           <p className="text-sm text-gray-700 font-semibold">
//                             Upload Video
//                           </p>
//                           <p className="text-xs text-gray-500 mt-1">
//                             MP4, WebM, Max 50MB
//                           </p>
//                         </label>
//                       </div>
//                       {errors.video && (
//                         <p className="text-red-500 text-sm mt-2">
//                           {errors.video}
//                         </p>
//                       )}
//                     </div>

//                     <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
//                       <input
//                         type="checkbox"
//                         name="isActive"
//                         checked={formData.isActive}
//                         onChange={handleInputChange}
//                         className="w-5 h-5 text-purple-600"
//                         id="isActive"
//                       />
//                       <label
//                         htmlFor="isActive"
//                         className="text-sm font-medium text-gray-800"
//                       >
//                         Active (visible on site)
//                       </label>
//                     </div>

//                     <button
//                       type="submit"
//                       disabled={
//                         createMutation.isLoading || updateMutation.isLoading
//                       }
//                       className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
//                     >
//                       {createMutation.isLoading || updateMutation.isLoading ? (
//                         <>
//                           <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                           {editingBanner ? "Updating..." : "Creating..."}
//                         </>
//                       ) : (
//                         <>
//                           <Save size={20} />
//                           {editingBanner ? "Update Banner" : "Create Banner"}
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Modal */}
//       {deleteConfirm && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
//             <div className="text-center mb-6">
//               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Trash2 size={32} className="text-red-600" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900">
//                 Delete Banner?
//               </h3>
//               <p className="text-gray-600 mt-2">This action cannot be undone</p>
//             </div>

//             <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
//               <p className="font-semibold text-gray-800">
//                 "{deleteConfirm.title || "Untitled Banner"}"
//               </p>
//             </div>

//             <div className="flex gap-4">
//               <button
//                 onClick={() => setDeleteConfirm(null)}
//                 className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-bold"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 disabled={deleteMutation.isLoading}
//                 className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:shadow-xl transition font-bold flex items-center justify-center gap-2 disabled:opacity-50"
//               >
//                 {deleteMutation.isLoading ? (
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 ) : (
//                   <>
//                     <Trash2 size={18} />
//                     Delete
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BannerManager;

// // CSS for animations/scrollbar (same as before)
// // Styles
// const styles = `
// @keyframes slide-in {
//   from { transform: translateX(100%); opacity: 0; }
//   to { transform: translateX(0); opacity: 1; }
// }
// .animate-slide-in { animation: slide-in 0.3s ease-out; }
// .line-clamp-2 {
//   overflow: hidden;
//   display: -webkit-box;
//   -webkit-box-orient: vertical;
//   -webkit-line-clamp: 2;
// }
// ::-webkit-scrollbar { width: 8px; height: 8px; }
// ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
// ::-webkit-scrollbar-thumb {
//   background: linear-gradient(to bottom, #9333ea, #ec4899);
//   border-radius: 4px;
// }
// `;

// if (typeof document !== "undefined") {
//   const styleSheet = document.createElement("style");
//   styleSheet.textContent = styles;
//   document.head.appendChild(styleSheet);
// }
