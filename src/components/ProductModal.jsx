// // components/ProductModal.jsx
// import React, { useState, useEffect } from 'react';
// import { X, Plus, Trash2 } from 'lucide-react';

// const ProductModal = ({ isOpen, onClose, onSubmit, product, categories, onAddCategory }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     category: '',
//     stock: '',
//     images: [],
//     hasCustomSizes: false,
//     measurements: {
//       chest: '',
//       waist: '',
//       shoulders: '',
//       length: '',
//       sleeves: '',
//       hips: ''
//     },
//     status: 'In Stock'
//   });

//   const [newCategory, setNewCategory] = useState('');
//   const [imageUrls, setImageUrls] = useState(['']);

//   useEffect(() => {
//     if (product) {
//       setFormData({
//         name: product.name || '',
//         description: product.description || '',
//         price: product.price || '',
//         category: product.category || '',
//         stock: product.stock || '',
//         images: product.images || [],
//         hasCustomSizes: product.hasCustomSizes || false,
//         measurements: product.measurements || {
//           chest: '', waist: '', shoulders: '', length: '', sleeves: '', hips: ''
//         },
//         status: product.status || 'In Stock'
//       });
//       setImageUrls(product.images?.length ? product.images : ['']);
//     } else {
//       resetForm();
//     }
//   }, [product, isOpen]);

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       description: '',
//       price: '',
//       category: '',
//       stock: '',
//       images: [],
//       hasCustomSizes: false,
//       measurements: {
//         chest: '', waist: '', shoulders: '', length: '', sleeves: '', hips: ''
//       },
//       status: 'In Stock'
//     });
//     setImageUrls(['']);
//     setNewCategory('');
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleMeasurementChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       measurements: {
//         ...prev.measurements,
//         [field]: value
//       }
//     }));
//   };

//   const handleImageUrlChange = (index, value) => {
//     const newImageUrls = [...imageUrls];
//     newImageUrls[index] = value;
//     setImageUrls(newImageUrls);
    
//     // Update form data with non-empty URLs
//     setFormData(prev => ({
//       ...prev,
//       images: newImageUrls.filter(url => url.trim() !== '')
//     }));
//   };

//   const addImageField = () => {
//     setImageUrls(prev => [...prev, '']);
//   };

//   const removeImageField = (index) => {
//     if (imageUrls.length > 1) {
//       const newImageUrls = imageUrls.filter((_, i) => i !== index);
//       setImageUrls(newImageUrls);
//       setFormData(prev => ({
//         ...prev,
//         images: newImageUrls.filter(url => url.trim() !== '')
//       }));
//     }
//   };

//   const handleAddCategory = () => {
//     if (newCategory.trim() && !categories.includes(newCategory)) {
//       onAddCategory(newCategory.trim());
//       setFormData(prev => ({ ...prev, category: newCategory.trim() }));
//       setNewCategory('');
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     // Calculate status based on stock
//     const stock = parseInt(formData.stock);
//     let status = 'In Stock';
//     if (stock === 0) status = 'Out of Stock';
//     else if (stock < 5) status = 'Low Stock';

//     const submitData = {
//       ...formData,
//       stock: stock,
//       status: status,
//       price: `₹${parseInt(formData.price).toLocaleString()}`,
//       images: formData.images.filter(url => url.trim() !== '')
//     };

//     onSubmit(submitData);
//     resetForm();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b">
//           <h2 className="text-xl font-bold text-gray-800">
//             {product ? 'Edit Product' : 'Add New Product'}
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-lg transition"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {/* Basic Information */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Product Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Enter product name"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Description
//                 </label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Enter product description"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Price (₹) *
//                   </label>
//                   <input
//                     type="number"
//                     name="price"
//                     value={formData.price}
//                     onChange={handleInputChange}
//                     required
//                     min="0"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                     placeholder="0"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Stock *
//                   </label>
//                   <input
//                     type="number"
//                     name="stock"
//                     value={formData.stock}
//                     onChange={handleInputChange}
//                     required
//                     min="0"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                     placeholder="0"
//                   />
//                 </div>
//               </div>

//               {/* Category */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Category *
//                 </label>
//                 <div className="flex gap-2 mb-2">
//                   <select
//                     name="category"
//                     value={formData.category}
//                     onChange={handleInputChange}
//                     required
//                     className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   >
//                     <option value="">Select Category</option>
//                     {categories.map(cat => (
//                       <option key={cat} value={cat}>{cat}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     value={newCategory}
//                     onChange={(e) => setNewCategory(e.target.value)}
//                     placeholder="Add new category"
//                     className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   />
//                   <button
//                     type="button"
//                     onClick={handleAddCategory}
//                     className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
//                   >
//                     <Plus size={16} />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Images */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-gray-800">Product Images</h3>
              
//               {imageUrls.map((url, index) => (
//                 <div key={index} className="flex gap-2">
//                   <input
//                     type="url"
//                     value={url}
//                     onChange={(e) => handleImageUrlChange(index, e.target.value)}
//                     placeholder="Enter image URL"
//                     className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   />
//                   {imageUrls.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removeImageField(index)}
//                       className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   )}
//                 </div>
//               ))}
              
//               <button
//                 type="button"
//                 onClick={addImageField}
//                 className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 transition"
//               >
//                 <Plus size={16} />
//                 <span>Add Another Image</span>
//               </button>

//               {/* Image Previews */}
//               {formData.images.length > 0 && (
//                 <div className="grid grid-cols-2 gap-2 mt-4">
//                   {formData.images.map((img, index) => (
//                     <img
//                       key={index}
//                       src={img}
//                       alt={`Preview ${index + 1}`}
//                       className="w-full h-24 object-cover rounded-lg border"
//                       onError={(e) => {
//                         e.target.style.display = 'none';
//                       }}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Custom Sizes */}
//           <div className="border-t pt-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-800">Custom Measurements</h3>
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   name="hasCustomSizes"
//                   checked={formData.hasCustomSizes}
//                   onChange={handleInputChange}
//                   className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
//                 />
//                 <span className="ml-2 text-sm text-gray-700">Enable custom measurements</span>
//               </label>
//             </div>

//             {formData.hasCustomSizes && (
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
//                 {Object.entries(formData.measurements).map(([key, value]) => (
//                   <div key={key}>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
//                       {key} (cm)
//                     </label>
//                     <input
//                       type="number"
//                       value={value}
//                       onChange={(e) => handleMeasurementChange(key, e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                       placeholder="0"
//                       min="0"
//                     />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Actions */}
//           <div className="flex gap-3 pt-6 border-t">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
//             >
//               {product ? 'Update Product' : 'Create Product'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProductModal;

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload, Image as ImageIcon, Tag, DollarSign, Package, Ruler, AlertCircle, Check } from 'lucide-react';

const ProductModal = ({ isOpen, onClose, onSubmit, product, categories, onAddCategory }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: [],
    hasCustomSizes: false,
    measurements: {
      chest: '',
      waist: '',
      shoulders: '',
      length: '',
      sleeves: '',
      hips: ''
    },
    status: 'In Stock'
  });

  const [newCategory, setNewCategory] = useState('');
  const [imageUrls, setImageUrls] = useState(['']);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'images', 'measurements'
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        stock: product.stock || '',
        images: product.images || [],
        hasCustomSizes: product.hasCustomSizes || false,
        measurements: product.measurements || {
          chest: '', waist: '', shoulders: '', length: '', sleeves: '', hips: ''
        },
        status: product.status || 'In Stock'
      });
      setImageUrls(product.images?.length ? product.images : ['']);
    } else {
      resetForm();
    }
  }, [product, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      images: [],
      hasCustomSizes: false,
      measurements: {
        chest: '', waist: '', shoulders: '', length: '', sleeves: '', hips: ''
      },
      status: 'In Stock'
    });
    setImageUrls(['']);
    setNewCategory('');
    setErrors({});
    setActiveTab('basic');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleMeasurementChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [field]: value
      }
    }));
  };

  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
    
    setFormData(prev => ({
      ...prev,
      images: newImageUrls.filter(url => url.trim() !== '')
    }));
  };

  const addImageField = () => {
    setImageUrls(prev => [...prev, '']);
  };

  const removeImageField = (index) => {
    if (imageUrls.length > 1) {
      const newImageUrls = imageUrls.filter((_, i) => i !== index);
      setImageUrls(newImageUrls);
      setFormData(prev => ({
        ...prev,
        images: newImageUrls.filter(url => url.trim() !== '')
      }));
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      onAddCategory(newCategory.trim());
      setFormData(prev => ({ ...prev, category: newCategory.trim() }));
      setNewCategory('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.stock === '' || formData.stock < 0) newErrors.stock = 'Valid stock quantity is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setActiveTab('basic');
      return;
    }

    const stock = parseInt(formData.stock);
    let status = 'In Stock';
    if (stock === 0) status = 'Out of Stock';
    else if (stock < 5) status = 'Low Stock';

    const submitData = {
      ...formData,
      stock: stock,
      status: status,
      price: `₹${parseInt(formData.price).toLocaleString()}`,
      images: formData.images.filter(url => url.trim() !== '')
    };

    onSubmit(submitData);
    resetForm();
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Package },
    { id: 'images', label: 'Images', icon: ImageIcon },
    { id: 'measurements', label: 'Measurements', icon: Ruler }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {product ? <Tag size={28} /> : <Plus size={28} />}
                {product ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-purple-100 text-sm mt-1">
                {product ? 'Update product information' : 'Fill in the details to add a new product'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                  {tab.id === 'images' && formData.images.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                      {formData.images.length}
                    </span>
                  )}
                  {tab.id === 'measurements' && formData.hasCustomSizes && (
                    <Check size={16} className="text-green-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="p-6 lg:p-8">
            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Product Name */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Tag size={16} className="text-purple-600" />
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter product name (e.g., Silk Saree, Designer Lehenga)"
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
                      placeholder="Describe the product features, material, style, etc."
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <DollarSign size={16} className="text-purple-600" />
                      Price (₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                        ₹
                      </span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                          errors.price ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0"
                      />
                    </div>
                    {errors.price && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.price}
                      </p>
                    )}
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Package size={16} className="text-purple-600" />
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                        errors.stock ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0"
                    />
                    {errors.stock && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.stock}
                      </p>
                    )}
                    {formData.stock && (
                      <p className="text-sm mt-2 text-gray-600">
                        Status: <span className={`font-semibold ${
                          parseInt(formData.stock) === 0 ? 'text-red-600' :
                          parseInt(formData.stock) < 5 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {parseInt(formData.stock) === 0 ? 'Out of Stock' :
                           parseInt(formData.stock) < 5 ? 'Low Stock' :
                           'In Stock'}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <div className="space-y-3">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                          errors.category ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="text-red-600 text-sm flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.category}
                        </p>
                      )}
                      
                      {/* Add New Category */}
                      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Add New Category</p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Enter category name"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <button
                            type="button"
                            onClick={handleAddCategory}
                            disabled={!newCategory.trim()}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            <Plus size={16} />
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Images Tab */}
            {activeTab === 'images' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Upload className="text-purple-600 mt-1" size={20} />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Add Product Images</h4>
                      <p className="text-sm text-gray-600">
                        Add image URLs for your product. First image will be the main display image.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <ImageIcon size={16} className="text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Image {index + 1} {index === 0 && <span className="text-purple-600">(Main)</span>}
                          </span>
                        </div>
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => handleImageUrlChange(index, e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                        />
                      </div>
                      {imageUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          className="mt-8 p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addImageField}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-400 hover:text-purple-600 transition"
                  >
                    <Plus size={20} />
                    <span className="font-medium">Add Another Image URL</span>
                  </button>
                </div>

                {/* Image Previews */}
                {formData.images.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Image Previews</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-purple-400 transition"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          {index === 0 && (
                            <span className="absolute top-2 left-2 px-2 py-1 bg-purple-600 text-white text-xs font-semibold rounded">
                              Main
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {formData.images.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <ImageIcon className="mx-auto text-gray-400 mb-3" size={48} />
                    <p className="text-gray-600">No images added yet</p>
                    <p className="text-sm text-gray-500 mt-1">Add image URLs above to preview them here</p>
                  </div>
                )}
              </div>
            )}

            {/* Measurements Tab */}
            {activeTab === 'measurements' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-start gap-3">
                      <Ruler className="text-blue-600 mt-1" size={24} />
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">Custom Measurements</h3>
                        <p className="text-sm text-gray-600">
                          Enable this to add custom size measurements for tailored products
                        </p>
                      </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer bg-white px-4 py-3 rounded-lg border-2 border-blue-300 hover:border-blue-400 transition">
                      <input
                        type="checkbox"
                        name="hasCustomSizes"
                        checked={formData.hasCustomSizes}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-semibold text-gray-700">
                        {formData.hasCustomSizes ? 'Enabled' : 'Disabled'}
                      </span>
                    </label>
                  </div>
                </div>

                {formData.hasCustomSizes ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(formData.measurements).map(([key, value]) => (
                      <div key={key} className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize flex items-center gap-2">
                          <Ruler size={14} className="text-purple-600" />
                          {key}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={value}
                            onChange={(e) => handleMeasurementChange(key, e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12 transition"
                            placeholder="0"
                            min="0"
                            step="0.1"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">
                            cm
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <Ruler className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600 font-medium">Custom measurements are disabled</p>
                    <p className="text-sm text-gray-500 mt-2">Enable the toggle above to add measurements</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t bg-gray-50 px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                {product ? (
                  <>
                    <Check size={20} />
                    Update Product
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Create Product
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProductModal;