// // components/ProductForm.jsx - NEW CREATE/UPDATE FORM
// import { useState, useEffect } from 'react';
// import { X, Plus, Trash2 } from 'lucide-react';

// const ProductForm = ({ 
//   isOpen, 
//   onClose, 
//   onSubmit, 
//   product = null, 
//   categories = [] 
// }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     images: [''],
//     sizes: ['S', 'M', 'L'],
//     price: '',
//     description: '',
//     details: [''],
//     commitment: [''],
//     categoryId: ''
//   });
//   const [newSize, setNewSize] = useState('');
//   const [newDetail, setNewDetail] = useState('');
//   const [newCommitment, setNewCommitment] = useState('');

//   useEffect(() => {
//     if (product && isOpen) {
//       setFormData({
//         name: product.name || '',
//         images: product.images || [''],
//         sizes: product.sizes || ['S', 'M', 'L'],
//         price: product.price || '',
//         description: product.description || '',
//         details: product.details || [''],
//         commitment: product.commitment || [''],
//         categoryId: product.categoryId?._id || ''
//       });
//     } else if (isOpen) {
//       setFormData({
//         name: '',
//         images: [''],
//         sizes: ['S', 'M', 'L'],
//         price: '',
//         description: '',
//         details: [''],
//         commitment: [''],
//         categoryId: ''
//       });
//     }
//   }, [product, isOpen]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const addSize = () => {
//     if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
//       setFormData(prev => ({ ...prev, sizes: [...prev.sizes, newSize.trim()] }));
//       setNewSize('');
//     }
//   };

//   const removeSize = (sizeToRemove) => {
//     setFormData(prev => ({
//       ...prev,
//       sizes: prev.sizes.filter(size => size !== sizeToRemove)
//     }));
//   };

//   const addDetail = () => {
//     if (newDetail.trim()) {
//       setFormData(prev => ({ ...prev, details: [...prev.details, newDetail.trim()] }));
//       setNewDetail('');
//     }
//   };

//   const removeDetail = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       details: prev.details.filter((_, i) => i !== index)
//     }));
//   };

//   const addCommitment = () => {
//     if (newCommitment.trim()) {
//       setFormData(prev => ({ ...prev, commitment: [...prev.commitment, newCommitment.trim()] }));
//       setNewCommitment('');
//     }
//   };

//   const removeCommitment = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       commitment: prev.commitment.filter((_, i) => i !== index)
//     }));
//   };

//   const addImageField = () => {
//     setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
//   };

//   const updateImageField = (index, value) => {
//     const newImages = [...formData.images];
//     newImages[index] = value;
//     setFormData(prev => ({ ...prev, images: newImages }));
//   };

//   const removeImageField = (index) => {
//     if (formData.images.length > 1) {
//       const newImages = formData.images.filter((_, i) => i !== index);
//       setFormData(prev => ({ ...prev, images: newImages }));
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const submitData = {
//       ...formData,
//       price: parseInt(formData.price),
//       images: formData.images.filter(url => url.trim()),
//       sizes: formData.sizes.filter(size => size.trim()),
//       details: formData.details.filter(detail => detail.trim()),
//       commitment: formData.commitment.filter(commit => commit.trim())
//     };
//     onSubmit(submitData);
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//         {/* Header */}
//         <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-3xl font-bold text-gray-900">
//                 {product ? 'Edit Product' : 'Add New Product'}
//               </h2>
//               <p className="text-gray-600 mt-1">
//                 {product ? 'Update product details' : 'Fill in all product information'}
//               </p>
//             </div>
//             <button onClick={onClose} className="p-3 hover:bg-gray-200 rounded-xl transition">
//               <X size={24} />
//             </button>
//           </div>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-8 space-y-8">
//           {/* Basic Info */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
//               <input
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Enter product name"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
//               <input
//                 type="number"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleInputChange}
//                 required
//                 min="0"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               rows={4}
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
//               placeholder="Describe the product..."
//             />
//           </div>

//           {/* Category */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-4">Category</label>
//             <select
//               name="categoryId"
//               value={formData.categoryId}
//               onChange={handleInputChange}
//               required
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Select Category</option>
//               {categories.map(cat => (
//                 <option key={cat._id} value={cat._id}>
//                   {cat.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Images */}
//           <div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Images</h3>
//             <div className="space-y-3">
//               {formData.images.map((image, index) => (
//                 <div key={index} className="flex gap-3 items-start">
//                   <input
//                     type="url"
//                     value={image}
//                     onChange={(e) => updateImageField(index, e.target.value)}
//                     placeholder="https://api.houseofresha.com/uploads/clothing_img/image.png"
//                     className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   {formData.images.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removeImageField(index)}
//                       className="p-3 bg-red-100 text-red-600 hover:bg-red-200 rounded-xl transition"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={addImageField}
//                 className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition"
//               >
//                 <Plus size={20} />
//                 Add Another Image
//               </button>
//             </div>
//           </div>

//           {/* Sizes */}
//           <div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-4">Sizes</h3>
//             <div className="flex gap-3 mb-4">
//               <input
//                 type="text"
//                 value={newSize}
//                 onChange={(e) => setNewSize(e.target.value)}
//                 placeholder="Add size (e.g., XS)"
//                 className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
//               />
//               <button
//                 type="button"
//                 onClick={addSize}
//                 className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
//               >
//                 Add Size
//               </button>
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {formData.sizes.map((size) => (
//                 <span key={size} className="px-3 py-2 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
//                   {size}
//                   <button
//                     onClick={() => removeSize(size)}
//                     className="ml-1 hover:text-blue-600"
//                   >
//                     <X size={14} />
//                   </button>
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Details */}
//           <div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-4">Details</h3>
//             <div className="flex gap-3 mb-4">
//               <input
//                 type="text"
//                 value={newDetail}
//                 onChange={(e) => setNewDetail(e.target.value)}
//                 placeholder="Add detail"
//                 className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
//               />
//               <button
//                 type="button"
//                 onClick={addDetail}
//                 className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
//               >
//                 Add Detail
//               </button>
//             </div>
//             <div className="space-y-2">
//               {formData.details.map((detail, index) => (
//                 <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
//                   <span>{detail}</span>
//                   <button
//                     onClick={() => removeDetail(index)}
//                     className="p-1 text-red-500 hover:text-red-700"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Commitments */}
//           <div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-4">Commitments</h3>
//             <div className="flex gap-3 mb-4">
//               <input
//                 type="text"
//                 value={newCommitment}
//                 onChange={(e) => setNewCommitment(e.target.value)}
//                 placeholder="Add commitment"
//                 className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
//               />
//               <button
//                 type="button"
//                 onClick={addCommitment}
//                 className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
//               >
//                 Add Commitment
//               </button>
//             </div>
//             <div className="space-y-2">
//               {formData.commitment.map((commit, index) => (
//                 <div key={index} className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl">
//                   <span>{commit}</span>
//                   <button
//                     onClick={() => removeCommitment(index)}
//                     className="p-1 text-red-500 hover:text-red-700"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex gap-4 pt-8 border-t">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-semibold shadow-lg transition"
//             >
//               {product ? 'Update Product' : 'Create Product'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProductForm;
