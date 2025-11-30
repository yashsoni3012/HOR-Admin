// import React, { useState } from "react";
// import { X } from "lucide-react";

// const BannerModel = ({ close, addBanner }) => {
//   const [preview, setPreview] = useState(null);

//   const handleUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setPreview(URL.createObjectURL(file));
//   };

//   const handleSave = () => {
//     if (!preview) return;
//     addBanner(preview);
//     close();
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
//       <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">

//         {/* Close Button */}
//         <button
//           onClick={close}
//           className="absolute right-4 top-4 text-gray-600 hover:text-black"
//         >
//           <X size={22} />
//         </button>

//         <h2 className="text-xl font-semibold mb-4 text-purple-900">Add Banner</h2>

//         {/* Upload */}
//         <div className="space-y-4">
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleUpload}
//             className="border border-gray-300 p-2 w-full rounded-lg"
//           />

//           {preview && (
//             <img
//               src={preview}
//               alt="banner"
//               className="w-full h-40 object-cover rounded-lg shadow"
//             />
//           )}
//         </div>

//         {/* Save Button */}
//         <button
//           onClick={handleSave}
//           className="mt-5 w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-lg font-medium"
//         >
//           Save Banner
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BannerModel;


import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, Image, Save, X } from 'lucide-react';

const BannerModel = () => {
  const [banners, setBanners] = useState([
    {
      id: 1,
      title: "Summer Collection 2024",
      category: "men",
      subcategory: "casual",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=300&fit=crop",
      description: "Discover the latest summer fashion trends for men with exclusive discounts",
      buttonText: "Shop Now",
      buttonLink: "/men/summer-collection",
      isActive: true,
      position: 1,
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      title: "Winter Essentials",
      category: "women",
      subcategory: "winter",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=300&fit=crop",
      description: "Stay warm and stylish with our premium winter collection",
      buttonText: "Explore",
      buttonLink: "/women/winter-essentials",
      isActive: true,
      position: 2,
      createdAt: "2024-01-10"
    },
    {
      id: 3,
      title: "Glow Ritual Premium",
      category: "glow-ritual",
      subcategory: "skincare",
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=300&fit=crop",
      description: "Transform your skincare routine with our premium products",
      buttonText: "Discover",
      buttonLink: "/glow-ritual",
      isActive: false,
      position: 3,
      createdAt: "2024-01-08"
    },
    {
      id: 4,
      title: "Festive Special Offers",
      category: "unisex",
      subcategory: "festive",
      image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&h=300&fit=crop",
      description: "Special discounts and offers for the festive season",
      buttonText: "View Offers",
      buttonLink: "/festive-sale",
      isActive: true,
      position: 4,
      createdAt: "2024-01-05"
    },
    {
      id: 5,
      title: "New Arrivals",
      category: "women",
      subcategory: "new",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=300&fit=crop",
      description: "Check out our latest arrivals in women's fashion",
      buttonText: "Shop New",
      buttonLink: "/women/new-arrivals",
      isActive: true,
      position: 5,
      createdAt: "2024-01-03"
    },
    {
      id: 6,
      title: "Men's Formal Wear",
      category: "men",
      subcategory: "formal",
      image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&h=300&fit=crop",
      description: "Premium formal wear collection for men",
      buttonText: "Browse",
      buttonLink: "/men/formal",
      isActive: false,
      position: 6,
      createdAt: "2024-01-01"
    }
  ]);

  const [editingBanner, setEditingBanner] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'men',
    subcategory: '',
    image: '',
    description: '',
    buttonText: 'Shop Now',
    buttonLink: '#',
    isActive: true,
    position: 1
  });
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'men', label: 'For Men' },
    { value: 'women', label: 'For Women' },
    { value: 'unisex', label: 'Unisex' },
    { value: 'glow-ritual', label: 'Glow Ritual' }
  ];

  const positions = [1, 2, 3, 4, 5, 6];

  const toggleActive = (id) => {
    setBanners(prev =>
      prev.map(banner =>
        banner.id === id ? { ...banner, isActive: !banner.isActive } : banner
      )
    );
  };

  const handleDelete = (id) => {
    setBanners(prev => prev.filter(banner => banner.id !== id));
    setDeleteConfirm(null);
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData(banner);
    setImagePreview(banner.image);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setFormData(prev => ({ ...prev, image: previewUrl }));
    
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const handleImageUrlChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, image: value }));
    setImagePreview(value);
    
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.image.trim()) {
      newErrors.image = 'Image is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (editingBanner) {
      // Update existing banner
      setBanners(prev => prev.map(banner => 
        banner.id === editingBanner.id ? { ...banner, ...formData } : banner
      ));
      setEditingBanner(null);
    } else {
      // Add new banner
      const newBanner = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setBanners(prev => [newBanner, ...prev]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'men',
      subcategory: '',
      image: '',
      description: '',
      buttonText: 'Shop Now',
      buttonLink: '#',
      isActive: true,
      position: 1
    });
    setImagePreview('');
    setErrors({});
    setEditingBanner(null);
  };

  const BannerCard = ({ banner }) => (
    <div className={`bg-white rounded-xl shadow-lg border-2 overflow-hidden transition-all duration-300 hover:shadow-xl group ${
      banner.isActive 
        ? 'border-green-500 border-opacity-50' 
        : 'border-gray-200'
    }`}>
      {/* Banner Image */}
      <div className="relative aspect-video bg-gray-100">
        <img
          src={banner.image}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          alt={banner.title}
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
            banner.isActive 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-500 text-white'
          }`}>
            {banner.isActive ? 'ACTIVE' : 'INACTIVE'}
          </span>
          <span className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
            Pos: {banner.position}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full capitalize">
            {banner.category}
          </span>
        </div>

        {/* Hover Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <button
              onClick={() => toggleActive(banner.id)}
              className={`p-3 rounded-full backdrop-blur-sm transition-all duration-200 ${
                banner.isActive 
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
              title={banner.isActive ? "Deactivate" : "Activate"}
            >
              {banner.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <button
              onClick={() => handleEdit(banner)}
              className="p-3 bg-blue-500 text-white rounded-full backdrop-blur-sm hover:bg-blue-600 transition-all duration-200"
              title="Edit Banner"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => setDeleteConfirm(banner.id)}
              className="p-3 bg-red-500 text-white rounded-full backdrop-blur-sm hover:bg-red-600 transition-all duration-200"
              title="Delete Banner"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Banner Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-lg line-clamp-1 flex-1 pr-2">
            {banner.title}
          </h3>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600 mb-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Category:</span>
            <span className="capitalize text-gray-800">{banner.category}</span>
          </div>
          {banner.subcategory && (
            <div className="flex items-center justify-between">
              <span className="font-semibold">Subcategory:</span>
              <span className="capitalize text-gray-800">{banner.subcategory}</span>
            </div>
          )}
          <p className="text-gray-700 line-clamp-2 text-sm leading-relaxed">
            {banner.description}
          </p>
          <div className="flex items-center justify-between pt-2">
            <span className="font-semibold">Button:</span>
            <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
              {banner.buttonText}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            Created: {banner.createdAt}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => toggleActive(banner.id)}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                banner.isActive 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {banner.isActive ? <EyeOff size={12} /> : <Eye size={12} />}
              <span>{banner.isActive ? "Active" : "Inactive"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Banner Management
              </h1>
              <p className="text-gray-600 text-lg mt-2">
                Create and manage promotional banners for your website
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{banners.length}</div>
                <div className="text-sm text-gray-600">Total Banners</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {banners.filter(b => b.isActive).length}
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Side - Banners Grid */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">All Banners</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>{banners.filter(b => b.isActive).length} Active</span>
                  <span className="mx-2">•</span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  <span>{banners.filter(b => !b.isActive).length} Inactive</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((banner) => (
                  <BannerCard key={banner.id} banner={banner} />
                ))}
              </div>

              {banners.length === 0 && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl mb-4">
                    <Image size={32} className="text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Banners Yet</h3>
                  <p className="text-gray-600 mb-4">Get started by creating your first banner</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Add/Edit Banner Form */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {editingBanner ? 'Edit Banner' : 'Add New Banner'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Banner Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter banner title"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Category and Position */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition text-sm"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Position *
                    </label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition text-sm"
                    >
                      {positions.map(pos => (
                        <option key={pos} value={pos}>
                          {pos}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subcategory */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    placeholder="Enter subcategory"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter banner description"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </div>

                {/* Button Text and Link */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Button Text
                    </label>
                    <input
                      type="text"
                      name="buttonText"
                      value={formData.buttonText}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition text-sm"
                      placeholder="Shop Now"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Button Link
                    </label>
                    <input
                      type="url"
                      name="buttonLink"
                      value={formData.buttonLink}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition text-sm"
                      placeholder="#"
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={handleImageUrlChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                      errors.image ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://example.com/image.jpg"
                  />
                  {errors.image && (
                    <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                  )}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Or Upload Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-gray-400 transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="banner-upload"
                    />
                    <label
                      htmlFor="banner-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload size={24} className="text-gray-400" />
                      <span className="text-sm text-gray-600">Click to upload</span>
                      <span className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</span>
                    </label>
                  </div>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="border rounded-xl p-3">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Image Preview
                    </label>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Active Toggle */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-5 h-5"
                  />
                  <label className="text-sm font-semibold text-gray-700">
                    Active Banner
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {editingBanner && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold text-sm"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className={`flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 ${
                      editingBanner
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {editingBanner ? <Save size={18} /> : <Plus size={18} />}
                    {editingBanner ? 'Update' : 'Add'} Banner
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="p-2 bg-red-100 rounded-xl">
                <Trash2 size={24} />
              </div>
              <h3 className="text-xl font-bold">Delete Banner?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this banner? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerModel;
