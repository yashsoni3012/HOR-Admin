import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, Image, Save, X, Video, RefreshCw } from 'lucide-react';

// API functions
const fetchBanners = async () => {
  try {
    const response = await fetch('https://api.houseofresha.com/banner');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch banners: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    
    // Handle different possible response structures
    if (Array.isArray(data)) {
      return { success: true, banners: data };
    } else if (data.data && Array.isArray(data.data)) {
      return { success: true, banners: data.data };
    } else if (data.banners && Array.isArray(data.banners)) {
      return { success: true, banners: data.banners };
    } else if (data.success && Array.isArray(data.banners)) {
      return data;
    } else {
      return { success: true, banners: [] };
    }
  } catch (error) {
    console.error('Error fetching banners:', error);
    throw error;
  }
};

const createBanner = async (bannerData) => {
  const formData = new FormData();
  
  // Append all fields to formData
  formData.append('title', bannerData.title);
  formData.append('buttonText', bannerData.buttonText);
  formData.append('buttonLink', bannerData.buttonLink);
  formData.append('category', bannerData.category);
  formData.append('description', bannerData.description);
  formData.append('isActive', bannerData.isActive);
  formData.append('position', parseInt(bannerData.position));
  
  // Append video file if exists
  if (bannerData.videoFile) {
    formData.append('video', bannerData.videoFile);
  }

  const response = await fetch('https://api.houseofresha.com/banner', {
    method: 'POST',
    body: formData,
  });

  const responseData = await response.json();
  
  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to create banner');
  }
  
  return responseData;
};

const updateBanner = async (bannerData) => {
  const formData = new FormData();
  
  // Append all fields to formData
  formData.append('title', bannerData.title);
  formData.append('buttonText', bannerData.buttonText);
  formData.append('buttonLink', bannerData.buttonLink);
  formData.append('category', bannerData.category);
  formData.append('description', bannerData.description);
  formData.append('isActive', bannerData.isActive);
  formData.append('position', parseInt(bannerData.position));
  
  // Append video file if exists
  if (bannerData.videoFile) {
    formData.append('video', bannerData.videoFile);
  }

  const response = await fetch(`https://api.houseofresha.com/banner/${bannerData._id}`, {
    method: 'PUT',
    body: formData,
  });

  const responseData = await response.json();
  
  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to update banner');
  }
  
  return responseData;
};

const deleteBanner = async (bannerId) => {
  const response = await fetch(`https://api.houseofresha.com/banner/${bannerId}`, {
    method: 'DELETE',
  });

  const responseData = await response.json();
  
  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to delete banner');
  }
  
  return responseData;
};

const toggleBannerStatus = async ({ bannerId, isActive }) => {
  const response = await fetch(`https://api.houseofresha.com/banner/${bannerId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isActive: !isActive }),
  });

  const responseData = await response.json();
  
  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to toggle banner status');
  }
  
  return responseData;
};

const BannerManager = () => {
  const queryClient = useQueryClient();
  const [editingBanner, setEditingBanner] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [videoPreview, setVideoPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Form state with default values
  const [formData, setFormData] = useState({
    title: '',
    category: 'men',
    description: '',
    buttonText: 'Shop Now',
    buttonLink: '#',
    isActive: true,
    position: '1',
    videoFile: null
  });

  // TanStack Query for banners
  const { 
    data: apiResponse = { success: false, banners: [] }, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['banners'],
    queryFn: fetchBanners,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Extract banners from response
  const banners = React.useMemo(() => {
    if (!apiResponse) return [];
    
    console.log('Processing API Response:', apiResponse);
    
    // Handle different response structures
    if (Array.isArray(apiResponse)) {
      return apiResponse;
    } else if (apiResponse.banners && Array.isArray(apiResponse.banners)) {
      return apiResponse.banners;
    } else if (apiResponse.data && Array.isArray(apiResponse.data)) {
      return apiResponse.data;
    } else if (apiResponse.success && apiResponse.banners) {
      return apiResponse.banners;
    }
    
    return [];
  }, [apiResponse]);

  // Show success message
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Toggle mutation
  const toggleMutation = useMutation({
    mutationFn: toggleBannerStatus,
    onMutate: async ({ bannerId, isActive }) => {
      await queryClient.cancelQueries(['banners']);
      const previousBanners = queryClient.getQueryData(['banners']);
      
      queryClient.setQueryData(['banners'], (old) => {
        const oldData = old || { success: false, banners: [] };
        return {
          ...oldData,
          banners: oldData.banners.map(banner => 
            banner._id === bannerId 
              ? { ...banner, isActive: !isActive }
              : banner
          )
        };
      });

      return { previousBanners };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['banners'], context.previousBanners);
      showSuccess(`Error: ${err.message}`);
    },
    onSuccess: () => {
      showSuccess('Banner status updated successfully!');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['banners']);
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createBanner,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['banners']);
      resetForm();
      showSuccess('Banner created successfully!');
    },
    onError: (error) => {
      showSuccess(`Error: ${error.message}`);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateBanner,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['banners']);
      resetForm();
      showSuccess('Banner updated successfully!');
    },
    onError: (error) => {
      showSuccess(`Error: ${error.message}`);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries(['banners']);
      setDeleteConfirm(null);
      showSuccess('Banner deleted successfully!');
    },
    onError: (error) => {
      showSuccess(`Error: ${error.message}`);
    },
  });

  // Categories data
  const categories = [
    { value: 'men', label: 'For Men' },
    { value: 'women', label: 'For Women' },
    { value: 'unisex', label: 'Unisex' },
    { value: 'glow-ritual', label: 'Glow Ritual' }
  ];

  // Handlers
  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      category: banner.category || 'men',
      description: banner.description || '',
      buttonText: banner.buttonText || 'Shop Now',
      buttonLink: banner.buttonLink || '#',
      isActive: banner.isActive !== undefined ? banner.isActive : true,
      position: banner.position?.toString() || '1',
      videoFile: null
    });
    
    if (banner.videoUrl) {
      setVideoPreview(`https://hor-server.onrender.com${banner.videoUrl}`);
    } else if (banner.video) {
      setVideoPreview(`https://hor-server.onrender.com${banner.video}`);
    } else {
      setVideoPreview('');
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
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setErrors(prev => ({ ...prev, video: 'Please select a valid video file' }));
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, video: 'Video size should be less than 50MB' }));
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);
    setFormData(prev => ({ ...prev, videoFile: file }));
    if (errors.video) setErrors(prev => ({ ...prev, video: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.buttonText.trim()) newErrors.buttonText = 'Button text is required';
    if (!formData.buttonLink.trim()) newErrors.buttonLink = 'Button link is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const bannerData = {
      ...formData,
      position: parseInt(formData.position)
    };

    if (editingBanner) {
      updateMutation.mutate({ ...bannerData, _id: editingBanner._id });
    } else {
      createMutation.mutate(bannerData);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', 
      category: 'men', 
      description: '',
      buttonText: 'Shop Now', 
      buttonLink: '#', 
      isActive: true, 
      position: '1',
      videoFile: null
    });
    
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    
    setVideoPreview('');
    setErrors({});
    setEditingBanner(null);
    setShowModal(false);
  };

  // Handle toggle active/inactive
  const handleToggleActive = (banner) => {
    toggleMutation.mutate({ 
      bannerId: banner._id, 
      isActive: banner.isActive 
    });
  };

  // Cleanup video preview URLs
  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  // Banner Card Component
  const BannerCard = ({ banner }) => {
    const videoUrl = banner.videoUrl || banner.video;
    
    return (
      <div className={`bg-white rounded-xl shadow-md border-2 overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 group ${
        banner.isActive ? 'border-green-400' : 'border-gray-200'
      }`}>
        <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
          {videoUrl ? (
            <video 
              src={`https://hor-server.onrender.com${videoUrl}`}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <Video size={48} className="text-gray-400" />
              <span className="absolute bottom-2 text-xs text-gray-500">No video</span>
            </div>
          )}
          
          <div className="absolute top-2 left-2 flex gap-2">
            <span className={`px-2.5 py-1 text-xs font-bold rounded-full shadow-lg ${
              banner.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
            }`}>
              {banner.isActive ? 'LIVE' : 'OFF'}
            </span>
            <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
              #{banner.position || 1}
            </span>
          </div>

          <span className="absolute top-2 right-2 px-2.5 py-1 bg-purple-500 text-white text-xs font-bold rounded-full shadow-lg capitalize">
            {banner.category || 'general'}
          </span>

          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleActive(banner);
                }} 
                disabled={toggleMutation.isLoading}
                className={`p-3 rounded-full shadow-lg transition ${
                  banner.isActive 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                } disabled:opacity-50`} 
                title={banner.isActive ? "Deactivate" : "Activate"}
              >
                {toggleMutation.isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : banner.isActive ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(banner);
                }} 
                className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition" 
                title="Edit"
              >
                <Edit size={18} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteConfirm(banner._id);
                }} 
                className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition" 
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
            {banner.title || 'Untitled Banner'}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {banner.description || 'No description provided'}
          </p>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">
              {banner.createdAt ? new Date(banner.createdAt).toLocaleDateString() : 'No date'}
            </span>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
              {banner.buttonText || 'Button'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">Loading banners...</p>
          <p className="text-gray-500 text-sm mt-2">Fetching data from API</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 flex flex-col items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw size={32} className="text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-red-800 mb-2">Failed to Load Banners</h3>
          <p className="text-red-600 mb-6">{error.message}</p>
          <div className="flex gap-3">
            <button 
              onClick={() => refetch()}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-bold"
            >
              <RefreshCw size={18} className="inline mr-2" />
              Retry
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-bold"
            >
              Reload Page
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            API: https://api.houseofresha.com/banner
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-3 sm:p-6">
      {/* Success Message Toast */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`px-6 py-4 rounded-xl shadow-2xl font-bold ${
            successMessage.includes('Error') 
              ? 'bg-red-500 text-white' 
              : 'bg-green-500 text-white'
          }`}>
            {successMessage}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Banner Manager</h1>
              <p className="text-gray-600">Manage promotional banners and videos</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{banners.length}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {banners.filter(b => b.isActive).length}
                </div>
                <div className="text-xs text-gray-600">Active</div>
              </div>
              <button 
                onClick={handleAddNew}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Add Banner</span>
              </button>
            </div>
          </div>
        </div>

        {/* Banners Grid */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">All Banners ({banners.length})</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-gray-600">{banners.filter(b => b.isActive).length} Live</span>
              </div>
              <button 
                onClick={() => refetch()}
                className="p-2 text-gray-600 hover:text-purple-600 transition"
                title="Refresh"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>

          {banners.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {banners.map(banner => (
                <BannerCard key={banner._id} banner={banner} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl mb-4">
                <Video size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Banners Found</h3>
              <p className="text-gray-600 mb-6">Create your first banner to get started</p>
              <button 
                onClick={handleAddNew}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Create First Banner
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Banner Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-3xl p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingBanner ? 'Edit Banner' : 'Create New Banner'}
              </h2>
              <button 
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-xl transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Video Preview */}
              {videoPreview && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Video className="text-purple-600" size={20} />
                    Video Preview
                  </h3>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800">
                    <video 
                      src={videoPreview} 
                      className="w-full h-48 object-cover"
                      controls
                      muted
                      playsInline
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-gradient-to-t from-black/60 to-transparent">
                      <h3 className="text-2xl font-bold mb-2">{formData.title || 'Banner Title'}</h3>
                      <p className="text-sm mb-4 opacity-90 line-clamp-2">{formData.description || 'Banner description...'}</p>
                      <button className="px-6 py-2 bg-white text-gray-900 rounded-lg font-bold hover:bg-gray-100 transition">
                        {formData.buttonText || 'Shop Now'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Title *</label>
                    <input 
                      type="text" 
                      name="title" 
                      value={formData.title} 
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`} 
                      placeholder="Enter banner title" 
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-2">{errors.title}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">Category</label>
                      <select 
                        name="category" 
                        value={formData.category} 
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">Position</label>
                      <select 
                        name="position" 
                        value={formData.position} 
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                      >
                        {[1,2,3,4,5,6].map(pos => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Description</label>
                    <textarea 
                      name="description" 
                      value={formData.description} 
                      onChange={handleInputChange} 
                      rows={4}
                      className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none" 
                      placeholder="Describe your banner..." 
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">Button Text *</label>
                      <input 
                        type="text" 
                        name="buttonText" 
                        value={formData.buttonText} 
                        onChange={handleInputChange}
                        className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none ${
                          errors.buttonText ? 'border-red-500' : 'border-gray-300'
                        }`} 
                        placeholder="e.g., Shop Now"
                      />
                      {errors.buttonText && <p className="text-red-500 text-sm mt-2">{errors.buttonText}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">Button Link *</label>
                      <input 
                        type="url" 
                        name="buttonLink" 
                        value={formData.buttonLink} 
                        onChange={handleInputChange}
                        className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none ${
                          errors.buttonLink ? 'border-red-500' : 'border-gray-300'
                        }`} 
                        placeholder="https://example.com"
                      />
                      {errors.buttonLink && <p className="text-red-500 text-sm mt-2">{errors.buttonLink}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Upload Video</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <input 
                        type="file" 
                        accept="video/*" 
                        onChange={handleVideoUpload} 
                        className="hidden" 
                        id="videoUpload" 
                      />
                      <label htmlFor="videoUpload" className="cursor-pointer flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
                          <Upload size={28} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-gray-700 font-semibold mb-1">Click to upload video</p>
                          <p className="text-gray-500 text-sm">MP4, MOV, AVI • Max 50MB</p>
                        </div>
                        {editingBanner?.videoUrl && (
                          <p className="text-green-600 text-sm mt-2">
                            Current video will be replaced
                          </p>
                        )}
                      </label>
                    </div>
                    {errors.video && <p className="text-red-500 text-sm mt-2">{errors.video}</p>}
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-100">
                    <input 
                      type="checkbox" 
                      name="isActive" 
                      checked={formData.isActive} 
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-6 h-6" 
                    />
                    <div>
                      <label className="text-sm font-bold text-gray-700 block">Set as Active</label>
                      <p className="text-gray-500 text-xs">Banner will be visible on the website</p>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={createMutation.isLoading || updateMutation.isLoading}
                    className="w-full px-4 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createMutation.isLoading || updateMutation.isLoading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
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
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex items-center gap-4 text-red-600 mb-6">
              <div className="p-4 bg-red-50 rounded-2xl">
                <Trash2 size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Delete Banner?</h3>
                <p className="text-red-500 text-sm">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete this banner? All associated data will be permanently removed.
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
                onClick={() => deleteMutation.mutate(deleteConfirm)}
                disabled={deleteMutation.isLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:shadow-xl transition font-bold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteMutation.isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete Permanently'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManager;

// Add CSS for animations
const styles = `
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

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
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
`;

// Add styles to document head
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);