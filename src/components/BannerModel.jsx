// import React, { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { Plus, Edit, Trash2, Eye, EyeOff, Upload, Image, Save, X } from 'lucide-react';

// // Mock API functions
// const fetchBanners = async () => {
//   // Simulate API call
//   return [
//     {
//       id: 1,
//       title: "Summer Collection 2024",
//       category: "men",
//       image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=300&fit=crop",
//       description: "Discover the latest summer fashion trends for men with exclusive discounts",
//       buttonText: "Shop Now",
//       buttonLink: "/men/summer-collection",
//       isActive: true,
//       position: 1,
//       createdAt: "2024-01-15"
//     },
//     {
//       id: 2,
//       title: "Winter Essentials",
//       category: "women",
//       image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=300&fit=crop",
//       description: "Stay warm and stylish with our premium winter collection",
//       buttonText: "Explore",
//       buttonLink: "/women/winter-essentials",
//       isActive: true,
//       position: 2,
//       createdAt: "2024-01-10"
//     },
//     {
//       id: 3,
//       title: "Glow Ritual Premium",
//       category: "glow-ritual",
//       image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=300&fit=crop",
//       description: "Transform your skincare routine with our premium products",
//       buttonText: "Discover",
//       buttonLink: "/glow-ritual",
//       isActive: false,
//       position: 3,
//       createdAt: "2024-01-08"
//     }
//   ];
// };

// const BannerManager = () => {
//   const queryClient = useQueryClient();
//   const [editingBanner, setEditingBanner] = useState(null);
//   const [deleteConfirm, setDeleteConfirm] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [imagePreview, setImagePreview] = useState('');
//   const [errors, setErrors] = useState({});

//   // Form state with default values
//   const [formData, setFormData] = useState({
//     title: '',
//     category: 'men',
//     image: '',
//     description: '',
//     buttonText: 'Shop Now',
//     buttonLink: '#',
//     isActive: true,
//     position: 1
//   });

//   // TanStack Query for banners
//   const { data: banners = [], isLoading } = useQuery({
//     queryKey: ['banners'],
//     queryFn: fetchBanners,
//   });

//   // Toggle mutation - Fixed implementation
//   const toggleMutation = useMutation({
//     mutationFn: async ({ id, currentStatus }) => {
//       // Simulate API call to toggle banner status
//       console.log(`Toggling banner ${id} from ${currentStatus} to ${!currentStatus}`);
//       return { id, isActive: !currentStatus };
//     },
//     onMutate: async ({ id, currentStatus }) => {
//       // Cancel any outgoing refetches
//       await queryClient.cancelQueries(['banners']);

//       // Snapshot the previous value
//       const previousBanners = queryClient.getQueryData(['banners']);

//       // Optimistically update to the new value
//       queryClient.setQueryData(['banners'], (old) => 
//         old.map(banner => 
//           banner.id === id 
//             ? { ...banner, isActive: !currentStatus }
//             : banner
//         )
//       );

//       return { previousBanners };
//     },
//     onError: (err, variables, context) => {
//       // Rollback on error
//       queryClient.setQueryData(['banners'], context.previousBanners);
//     },
//     onSettled: () => {
//       // Refetch to ensure sync with server
//       queryClient.invalidateQueries(['banners']);
//     },
//   });

//   // Create mutation
//   const createMutation = useMutation({
//     mutationFn: async (newBanner) => {
//       // Simulate API call
//       return { id: Date.now(), ...newBanner };
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(['banners']);
//       resetForm();
//     },
//   });

//   // Update mutation
//   const updateMutation = useMutation({
//     mutationFn: async (updatedBanner) => {
//       // Simulate API call
//       return updatedBanner;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(['banners']);
//       resetForm();
//     },
//   });

//   // Delete mutation
//   const deleteMutation = useMutation({
//     mutationFn: async (bannerId) => {
//       // Simulate API call
//       return bannerId;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(['banners']);
//       setDeleteConfirm(null);
//     },
//   });

//   // Categories data
//   const categories = [
//     { value: 'men', label: 'For Men' },
//     { value: 'women', label: 'For Women' },
//     { value: 'unisex', label: 'Unisex' },
//     { value: 'glow-ritual', label: 'Glow Ritual' }
//   ];

//   // Handlers
//   const handleEdit = (banner) => {
//     setEditingBanner(banner);
//     setFormData(banner);
//     setImagePreview(banner.image);
//     setShowModal(true);
//   };

//   const handleAddNew = () => {
//     setEditingBanner(null);
//     resetForm();
//     setShowModal(true);
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({ 
//       ...prev, 
//       [name]: type === 'checkbox' ? checked : value 
//     }));
//     if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!file.type.startsWith('image/')) {
//       setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
//       return;
//     }

//     const previewUrl = URL.createObjectURL(file);
//     setImagePreview(previewUrl);
//     setFormData(prev => ({ ...prev, image: previewUrl }));
//     if (errors.image) setErrors(prev => ({ ...prev, image: '' }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.title.trim()) newErrors.title = 'Title is required';
//     if (!formData.image.trim()) newErrors.image = 'Image is required';
//     if (!formData.description.trim()) newErrors.description = 'Description is required';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     const bannerData = {
//       ...formData,
//       createdAt: editingBanner ? formData.createdAt : new Date().toISOString().split('T')[0]
//     };

//     if (editingBanner) {
//       updateMutation.mutate({ ...bannerData, id: editingBanner.id });
//     } else {
//       createMutation.mutate(bannerData);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       title: '', category: 'men', image: '', description: '',
//       buttonText: 'Shop Now', buttonLink: '#', isActive: true, position: 1
//     });
//     setImagePreview('');
//     setErrors({});
//     setEditingBanner(null);
//     setShowModal(false);
//   };

//   // Handle toggle active/inactive
//   const handleToggleActive = (banner) => {
//     toggleMutation.mutate({ 
//       id: banner.id, 
//       currentStatus: banner.isActive 
//     });
//   };

//   // Banner Card Component
//   const BannerCard = ({ banner }) => (
//     <div className={`bg-white rounded-xl shadow-md border-2 overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 group ${
//       banner.isActive ? 'border-green-400' : 'border-gray-200'
//     }`}>
//       <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
//         <img src={banner.image} className="w-full h-full object-cover" alt={banner.title} />
        
//         <div className="absolute top-2 left-2 flex gap-2">
//           <span className={`px-2.5 py-1 text-xs font-bold rounded-full shadow-lg ${
//             banner.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
//           }`}>
//             {banner.isActive ? 'LIVE' : 'OFF'}
//           </span>
//           <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
//             #{banner.position}
//           </span>
//         </div>

//         <span className="absolute top-2 right-2 px-2.5 py-1 bg-purple-500 text-white text-xs font-bold rounded-full shadow-lg capitalize">
//           {banner.category}
//         </span>

//         <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
//           <div className="flex gap-2">
//             <button 
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleToggleActive(banner);
//               }} 
//               disabled={toggleMutation.isLoading}
//               className={`p-3 rounded-full shadow-lg transition ${
//                 banner.isActive 
//                   ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
//                   : 'bg-green-500 hover:bg-green-600 text-white'
//               } disabled:opacity-50`} 
//               title={banner.isActive ? "Deactivate" : "Activate"}
//             >
//               {toggleMutation.isLoading ? (
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//               ) : banner.isActive ? (
//                 <EyeOff size={18} />
//               ) : (
//                 <Eye size={18} />
//               )}
//             </button>
//             <button 
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleEdit(banner);
//               }} 
//               className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition" 
//               title="Edit"
//             >
//               <Edit size={18} />
//             </button>
//             <button 
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setDeleteConfirm(banner.id);
//               }} 
//               className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition" 
//               title="Delete"
//             >
//               <Trash2 size={18} />
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="p-4">
//         <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">{banner.title}</h3>
//         <p className="text-sm text-gray-600 line-clamp-2 mb-3">{banner.description}</p>
        
//         <div className="flex items-center justify-between text-xs">
//           <span className="text-gray-500">{banner.createdAt}</span>
//           <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
//             {banner.buttonText}
//           </span>
//         </div>
//       </div>
//     </div>
//   );

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
//           <p className="text-gray-600 mt-4">Loading banners...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-3 sm:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-4 sm:p-6 mb-6">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <div>
//               <p className="text-gray-600">Create stunning promotional banners</p>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-gray-900">{banners.length}</div>
//                 <div className="text-xs text-gray-600">Total</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-green-600">{banners.filter(b => b.isActive).length}</div>
//                 <div className="text-xs text-gray-600">Active</div>
//               </div>
//               <button 
//                 onClick={handleAddNew}
//                 className="px-4 py-3 bg-[#9333EA] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
//               >
//                 <Plus size={20} />
//                 <span className="hidden sm:inline">Add Banner</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Banners Grid - Full width now */}
//         <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-4 sm:p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-bold text-gray-900">All Banners</h2>
//             <div className="flex items-center gap-2 text-sm">
//               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//               <span className="text-gray-600">{banners.filter(b => b.isActive).length} Live</span>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//             {banners.map(banner => (
//               <BannerCard key={banner.id} banner={banner} />
//             ))}
//           </div>

//           {banners.length === 0 && (
//             <div className="text-center py-16">
//               <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl mb-4">
//                 <Image size={32} className="text-purple-600" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-2">No Banners Yet</h3>
//               <p className="text-gray-600">Create your first banner to get started</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Add/Edit Banner Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-3xl p-6 flex items-center justify-between">
//               <h2 className="text-2xl font-bold text-gray-900">
//                 {editingBanner ? 'Edit Banner' : 'Create New Banner'}
//               </h2>
//               <button 
//                 onClick={resetForm}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             <div className="p-6">
//               {/* Live Preview */}
//               {imagePreview && (
//                 <div className="mb-6">
//                   <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
//                     <Eye className="text-purple-600" size={20} />
//                     Live Preview
//                   </h3>
//                   <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800">
//                     <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
//                     <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
//                       <h3 className="text-2xl font-bold mb-2">{formData.title || 'Banner Title'}</h3>
//                       <p className="text-sm mb-4 opacity-90">{formData.description || 'Banner description...'}</p>
//                       <button className="px-6 py-2 bg-white text-gray-900 rounded-lg font-bold hover:bg-gray-100 transition">
//                         {formData.buttonText || 'Shop Now'}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Left Column */}
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
//                     <input 
//                       type="text" 
//                       name="title" 
//                       value={formData.title} 
//                       onChange={handleInputChange}
//                       className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition ${
//                         errors.title ? 'border-red-500' : 'border-gray-300'
//                       }`} 
//                       placeholder="Summer Sale 2024" 
//                     />
//                     {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
//                   </div>

//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
//                       <select 
//                         name="category" 
//                         value={formData.category} 
//                         onChange={handleInputChange}
//                         className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
//                       >
//                         {categories.map(cat => (
//                           <option key={cat.value} value={cat.value}>{cat.label}</option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Position</label>
//                       <select 
//                         name="position" 
//                         value={formData.position} 
//                         onChange={handleInputChange}
//                         className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
//                       >
//                         {[1,2,3,4,5,6].map(pos => (
//                           <option key={pos} value={pos}>{pos}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
//                     <textarea 
//                       name="description" 
//                       value={formData.description} 
//                       onChange={handleInputChange} 
//                       rows={4}
//                       className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none ${
//                         errors.description ? 'border-red-500' : 'border-gray-300'
//                       }`} 
//                       placeholder="Describe your banner..." 
//                     />
//                     {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
//                   </div>
//                 </div>

//                 {/* Right Column */}
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Button Text</label>
//                       <input 
//                         type="text" 
//                         name="buttonText" 
//                         value={formData.buttonText} 
//                         onChange={handleInputChange}
//                         className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm" 
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-bold text-gray-700 mb-2">Link</label>
//                       <input 
//                         type="url" 
//                         name="buttonLink" 
//                         value={formData.buttonLink} 
//                         onChange={handleInputChange}
//                         className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm" 
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-2">Image URL *</label>
//                     <input 
//                       type="url" 
//                       value={formData.image} 
//                       onChange={(e) => { 
//                         setFormData(prev => ({ ...prev, image: e.target.value })); 
//                         setImagePreview(e.target.value); 
//                       }}
//                       className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none ${
//                         errors.image ? 'border-red-500' : 'border-gray-300'
//                       }`} 
//                       placeholder="https://..." 
//                     />
//                     {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
//                   </div>

//                   <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-purple-400 transition">
//                     <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="upload" />
//                     <label htmlFor="upload" className="cursor-pointer flex flex-col items-center gap-2">
//                       <Upload size={24} className="text-gray-400" />
//                       <span className="text-sm text-gray-600 font-semibold">Upload Image</span>
//                       <span className="text-xs text-gray-500">Max 5MB</span>
//                     </label>
//                   </div>

//                   <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
//                     <input 
//                       type="checkbox" 
//                       name="isActive" 
//                       checked={formData.isActive} 
//                       onChange={handleInputChange}
//                       className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-5 h-5" 
//                     />
//                     <label className="text-sm font-bold text-gray-700">Set as Active</label>
//                   </div>

//                   <button 
//                     type="submit" 
//                     disabled={createMutation.isLoading || updateMutation.isLoading}
//                     className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
//                   >
//                     {editingBanner ? <Save size={18} /> : <Plus size={18} />}
//                     {editingBanner ? 'Update Banner' : 'Create Banner'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Modal */}
//       {deleteConfirm && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
//             <div className="flex items-center gap-3 text-red-600 mb-4">
//               <div className="p-3 bg-red-100 rounded-2xl">
//                 <Trash2 size={24} />
//               </div>
//               <h3 className="text-xl font-bold">Delete Banner?</h3>
//             </div>
//             <p className="text-gray-600 mb-6">This action cannot be undone.</p>
//             <div className="flex gap-3">
//               <button 
//                 onClick={() => setDeleteConfirm(null)}
//                 className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-bold"
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={() => deleteMutation.mutate(deleteConfirm)}
//                 className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-bold shadow-lg"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BannerManager;

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, Image, Save, X, Video } from 'lucide-react';

// API functions
const fetchBanners = async () => {
  const response = await fetch('https://hor-server.onrender.com/banner');
  if (!response.ok) {
    throw new Error('Failed to fetch banners');
  }
  const data = await response.json();
  return data;
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
  formData.append('position', bannerData.position);
  
  // Append video file if exists
  if (bannerData.videoFile) {
    formData.append('video', bannerData.videoFile);
  }

  const response = await fetch('https://hor-server.onrender.com/banner', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to create banner');
  }
  return response.json();
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
  formData.append('position', bannerData.position);
  
  // Append video file if exists
  if (bannerData.videoFile) {
    formData.append('video', bannerData.videoFile);
  }

  const response = await fetch(`https://hor-server.onrender.com/banner/${bannerData._id}`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to update banner');
  }
  return response.json();
};

const deleteBanner = async (bannerId) => {
  const response = await fetch(`https://hor-server.onrender.com/banner/${bannerId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete banner');
  }
  return response.json();
};

const toggleBannerStatus = async ({ bannerId, isActive }) => {
  const response = await fetch(`https://hor-server.onrender.com/banner/${bannerId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isActive: !isActive }),
  });

  if (!response.ok) {
    throw new Error('Failed to toggle banner status');
  }
  return response.json();
};

const BannerManager = () => {
  const queryClient = useQueryClient();
  const [editingBanner, setEditingBanner] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [videoPreview, setVideoPreview] = useState('');
  const [errors, setErrors] = useState({});

  // Form state with default values
  const [formData, setFormData] = useState({
    title: '',
    category: 'men',
    description: '',
    buttonText: 'Shop Now',
    buttonLink: '#',
    isActive: true,
    position: 1,
    videoFile: null
  });

  // TanStack Query for banners
  const { data: apiResponse = { success: false, banners: [] }, isLoading, error } = useQuery({
    queryKey: ['banners'],
    queryFn: fetchBanners,
  });

  const banners = apiResponse.banners || [];

  // Toggle mutation
  const toggleMutation = useMutation({
    mutationFn: toggleBannerStatus,
    onMutate: async ({ bannerId, isActive }) => {
      await queryClient.cancelQueries(['banners']);
      const previousBanners = queryClient.getQueryData(['banners']);
      
      queryClient.setQueryData(['banners'], (old) => ({
        ...old,
        banners: old.banners.map(banner => 
          banner._id === bannerId 
            ? { ...banner, isActive: !isActive }
            : banner
        )
      }));

      return { previousBanners };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['banners'], context.previousBanners);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['banners']);
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries(['banners']);
      resetForm();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateBanner,
    onSuccess: () => {
      queryClient.invalidateQueries(['banners']);
      resetForm();
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries(['banners']);
      setDeleteConfirm(null);
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
      position: banner.position || 1,
      videoFile: null
    });
    if (banner.videoUrl) {
      setVideoPreview(`https://hor-server.onrender.com${banner.videoUrl}`);
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
      createdAt: editingBanner ? formData.createdAt : new Date().toISOString()
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
      position: 1,
      videoFile: null
    });
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

  // Banner Card Component
  const BannerCard = ({ banner }) => (
    <div className={`bg-white rounded-xl shadow-md border-2 overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 group ${
      banner.isActive ? 'border-green-400' : 'border-gray-200'
    }`}>
      <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
        {banner.videoUrl ? (
          <video 
            src={`https://hor-server.onrender.com${banner.videoUrl}`}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <Video size={48} className="text-gray-400" />
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
        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">{banner.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{banner.description || 'No description'}</p>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">
            {new Date(banner.createdAt).toLocaleDateString()}
          </span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
            {banner.buttonText}
          </span>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-gray-600 mt-4">Loading banners...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 text-red-600 p-4 rounded-xl">
            <p>Error loading banners: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
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
                className="px-4 py-3 bg-[#9333EA] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
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
            <h2 className="text-xl font-bold text-gray-900">All Banners</h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-gray-600">{banners.filter(b => b.isActive).length} Live</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {banners.map(banner => (
              <BannerCard key={banner._id} banner={banner} />
            ))}
          </div>

          {banners.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl mb-4">
                <Video size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Banners Yet</h3>
              <p className="text-gray-600">Create your first banner to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Banner Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-3xl p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingBanner ? 'Edit Banner' : 'Create New Banner'}
              </h2>
              <button 
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Video Preview */}
              {videoPreview && (
                <div className="mb-6">
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
                      <p className="text-sm mb-4 opacity-90">{formData.description || 'Banner description...'}</p>
                      <button className="px-6 py-2 bg-white text-gray-900 rounded-lg font-bold hover:bg-gray-100 transition">
                        {formData.buttonText || 'Shop Now'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
                    <input 
                      type="text" 
                      name="title" 
                      value={formData.title} 
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`} 
                      placeholder="Enter banner title" 
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                      <select 
                        name="category" 
                        value={formData.category} 
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Position</label>
                      <select 
                        name="position" 
                        value={formData.position} 
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                      >
                        {[1,2,3,4,5,6].map(pos => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                    <textarea 
                      name="description" 
                      value={formData.description} 
                      onChange={handleInputChange} 
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none" 
                      placeholder="Describe your banner..." 
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Button Text *</label>
                      <input 
                        type="text" 
                        name="buttonText" 
                        value={formData.buttonText} 
                        onChange={handleInputChange}
                        className={`w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm ${
                          errors.buttonText ? 'border-red-500' : 'border-gray-300'
                        }`} 
                      />
                      {errors.buttonText && <p className="text-red-500 text-sm mt-1">{errors.buttonText}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Button Link *</label>
                      <input 
                        type="url" 
                        name="buttonLink" 
                        value={formData.buttonLink} 
                        onChange={handleInputChange}
                        className={`w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm ${
                          errors.buttonLink ? 'border-red-500' : 'border-gray-300'
                        }`} 
                      />
                      {errors.buttonLink && <p className="text-red-500 text-sm mt-1">{errors.buttonLink}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Upload Video</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-purple-400 transition">
                      <input 
                        type="file" 
                        accept="video/*" 
                        onChange={handleVideoUpload} 
                        className="hidden" 
                        id="videoUpload" 
                      />
                      <label htmlFor="videoUpload" className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload size={24} className="text-gray-400" />
                        <span className="text-sm text-gray-600 font-semibold">Upload Video</span>
                        <span className="text-xs text-gray-500">Max 50MB</span>
                      </label>
                    </div>
                    {errors.video && <p className="text-red-500 text-sm mt-1">{errors.video}</p>}
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <input 
                      type="checkbox" 
                      name="isActive" 
                      checked={formData.isActive} 
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-5 h-5" 
                    />
                    <label className="text-sm font-bold text-gray-700">Set as Active</label>
                  </div>

                  <button 
                    type="submit" 
                    disabled={createMutation.isLoading || updateMutation.isLoading}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {createMutation.isLoading || updateMutation.isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : editingBanner ? (
                      <Save size={18} />
                    ) : (
                      <Plus size={18} />
                    )}
                    {editingBanner ? 'Update Banner' : 'Create Banner'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="p-3 bg-red-100 rounded-2xl">
                <Trash2 size={24} />
              </div>
              <h3 className="text-xl font-bold">Delete Banner?</h3>
            </div>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={() => deleteMutation.mutate(deleteConfirm)}
                disabled={deleteMutation.isLoading}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-bold shadow-lg disabled:opacity-50"
              >
                {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManager;