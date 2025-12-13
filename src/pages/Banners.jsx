// Banner.jsx
import React, { useState, useMemo } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Video,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "../lib/api"; // adjust path
import BannerFormModel from "../components/BannerFormModal";

const API_BASE_URL = "https://api.houseofresha.com";

// simple toast (same as in model)
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

// fetch banners
const fetchBanners = async () => {
  const res = await fetch(`${API_BASE_URL}/banner`);
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();

  if (Array.isArray(data)) return { success: true, banners: data };
  if (Array.isArray(data?.data)) return { success: true, banners: data.data };
  if (Array.isArray(data?.banners))
    return { success: true, banners: data.banners };
  if (data?.success && Array.isArray(data.banners)) return data;

  return { success: true, banners: [] };
};

const deleteBanner = async (id) => {
  const res = await fetch(`${API_BASE_URL}/banner/${id}`, {
    method: "DELETE",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      data.message || data.error || `HTTP ${res.status}: Failed to delete`
    );
  }
  return data;
};

const toggleBannerStatus = async ({ bannerId, isActive }) => {
  const res = await fetch(`${API_BASE_URL}/banner/${bannerId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isActive: !isActive }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      data.message || data.error || `HTTP ${res.status}: Failed to toggle`
    );
  }
  return data;
};

const Banner = () => {
  const [sortOrder, setSortOrder] = useState("position");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [togglingBannerId, setTogglingBannerId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

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

  const deleteMutation = useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      setDeleteConfirm(null);
      showToast("Banner deleted successfully!", "success");
    },
    onError: (error) => {
      showToast(`Failed to delete banner: ${error.message}`, "error");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleBannerStatus,
    onMutate: async ({ bannerId, isActive }) => {
      setTogglingBannerId(bannerId);
      await queryClient.cancelQueries({ queryKey: ["banners"] });

      const previous = queryClient.getQueryData(["banners"]);

      queryClient.setQueryData(["banners"], (old) => {
        const oldData = old || { success: false, banners: [] };
        return {
          ...oldData,
          banners: oldData.banners.map((b) =>
            b._id === bannerId ? { ...b, isActive: !isActive } : b
          ),
        };
      });

      return { previous };
    },
    onError: (err, { bannerId, isActive }, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["banners"], ctx.previous);
      }
      showToast(`Failed to update status: ${err.message}`, "error");
    },
    onSuccess: (data, { bannerId, isActive }) => {
      showToast(
        `Banner ${!isActive ? "activated" : "deactivated"} successfully!`,
        "success"
      );
    },
    onSettled: () => {
      setTogglingBannerId(null);
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });

  const banners = useMemo(() => {
    if (!apiResponse) return [];
    let arr = [];
    if (Array.isArray(apiResponse)) arr = apiResponse;
    else if (Array.isArray(apiResponse.banners)) arr = apiResponse.banners;
    else if (Array.isArray(apiResponse.data)) arr = apiResponse.data;
    else if (apiResponse.success && apiResponse.banners)
      arr = apiResponse.banners;

    return [...arr].sort((a, b) => {
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

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingBanner(null);
    setShowModal(true);
  };

  const handleToggleActive = async (banner) => {
    setTogglingBannerId(banner._id);
    try {
      await toggleMutation.mutateAsync({
        bannerId: banner._id,
        isActive: banner.isActive,
      });
    } catch (e) {
      // error handled in mutation
    } finally {
      setTogglingBannerId(null);
    }
  };

  const handleDelete = () => {
    if (deleteConfirm) deleteMutation.mutate(deleteConfirm._id);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    showToast(`Sorted by ${order}`, "success");
  };

  const activeCount = banners.filter((b) => b.isActive).length;

  const BannerCard = ({ banner }) => {
    const videoUrl = banner.videoUrl || banner.video;
    const fullVideoUrl = videoUrl
      ? videoUrl.startsWith("http")
        ? videoUrl
        : `${API_BASE_URL}${videoUrl}`
      : null;

    const createdAt = banner.createdAt ? new Date(banner.createdAt) : null;
    const updatedAt = banner.updatedAt ? new Date(banner.updatedAt) : null;

    return (
      <div
        className={`group relative bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
          banner.isActive ? "border-green-400" : "border-gray-300"
        }`}
      >
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
        </div>

        <span className="absolute top-3 right-3 px-3 py-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-semibold rounded-full shadow-lg capitalize z-10 border border-white/20">
          {banner.category || "General"}
        </span>

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
        </div>

        <div className="p-5">
          <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-1">
            {banner.title || "Untitled Banner"}
          </h3>

          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {banner.description || "No description provided"}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-full">
              <span>{banner.buttonText || "Button Text"}</span>
              <ExternalLink size={12} className="text-slate-500" />
            </div>

            <button
              onClick={() => handleEdit(banner)}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              Quick Edit →
            </button>
          </div>

          <div className="pt-3 mb-4 border-t border-gray-100 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>
                Created: {createdAt ? createdAt.toLocaleDateString() : "N/A"}
              </span>
              {updatedAt && (
                <span>Updated: {updatedAt.toLocaleDateString()}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <button
              onClick={() => handleToggleActive(banner)}
              disabled={togglingBannerId === banner._id}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                banner.isActive
                  ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                  : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={banner.isActive ? "Hide banner" : "Show banner"}
            >
              {togglingBannerId === banner._id ? (
                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : banner.isActive ? (
                <>
                  <EyeOff size={12} />
                  <span>Hide</span>
                </>
              ) : (
                <>
                  <Eye size={12} />
                  <span>Show</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleEdit(banner)}
              className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-xs sm:text-sm font-semibold transition-all"
              title="Edit"
            >
              <Edit size={16} className="sm:w-4 sm:h-4" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => setDeleteConfirm(banner)}
              className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs sm:text-sm font-semibold transition-all"
              title="Delete"
            >
              <Trash2 size={16} className="sm:w-4 sm:h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (bannersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Loading Banners...
          </h2>
        </div>
      </div>
    );
  }

  if (bannersError) {
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
            <p className="text-red-600 mb-4">{bannersError.message}</p>
            <button
              onClick={() => {
                refetchBanners();
              }}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} />
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Banner Management
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Manage your promotional banners
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">
                    {banners.length}
                  </div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    {activeCount}
                  </div>
                  <div className="text-xs text-gray-600">Active</div>
                </div>
              </div>

              <button
                onClick={handleAddNew}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm sm:text-base"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Create Banner</span>
                <span className="sm:hidden">Create</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Sort by:
              </span>
              {["date", "title"].map((sortType) => (
                <button
                  key={sortType}
                  onClick={() => handleSortChange(sortType)}
                  className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg transition ${
                    sortOrder === sortType
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {sortType.charAt(0).toUpperCase() + sortType.slice(1)}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                refetchBanners();
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 text-sm"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {banners.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <BannerCard key={banner._id} banner={banner} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl mb-6">
              <Video size={40} className="text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Banners Found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create your first promotional banner
            </p>
            <button
              onClick={handleAddNew}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all"
            >
              Create Your First Banner
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <BannerFormModel
          open={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingBanner(null);
            queryClient.invalidateQueries({ queryKey: ["banners"] });
          }}
          initialBanner={editingBanner}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Delete Banner?
              </h3>
              <p className="text-gray-600 mt-2">This action cannot be undone</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="font-semibold text-gray-800">
                "{deleteConfirm.title || "Untitled Banner"}"
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:shadow-xl transition font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {deleteMutation.isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;
