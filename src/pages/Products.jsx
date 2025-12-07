// // import React from 'react';

// // const Products = () => {
// //   const products = [
// //     { id: 1, name: 'Silk Saree', price: '₹15,999', stock: 12, status: 'In Stock' },
// //     { id: 2, name: 'Designer Lehenga', price: '₹45,999', stock: 5, status: 'Low Stock' },
// //     { id: 3, name: 'Cotton Kurta', price: '₹2,499', stock: 0, status: 'Out of Stock' },
// //     { id: 4, name: 'Embroidered Dupatta', price: '₹3,999', stock: 25, status: 'In Stock' },
// //   ];

// //   return (
// //     <div className="bg-white rounded-lg shadow-md overflow-hidden">
// //       <div className="p-4 lg:p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// //         <h3 className="text-lg font-semibold">Product List</h3>
// //         <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
// //           Add Product
// //         </button>
// //       </div>
// //       <div className="overflow-x-auto">
// //         <table className="w-full">
// //           <thead className="bg-gray-50">
// //             <tr>
// //               <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
// //               <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
// //               <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Stock</th>
// //               <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
// //             </tr>
// //           </thead>
// //           <tbody className="divide-y divide-gray-200">
// //             {products.map((product) => (
// //               <tr key={product.id} className="hover:bg-gray-50">
// //                 <td className="px-4 lg:px-6 py-4 text-sm font-medium text-gray-800">{product.name}</td>
// //                 <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">{product.price}</td>
// //                 <td className="px-4 lg:px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">{product.stock}</td>
// //                 <td className="px-4 lg:px-6 py-4">
// //                   <span className={`px-2 py-1 text-xs rounded-full ${
// //                     product.status === 'In Stock' ? 'bg-green-100 text-green-800' :
// //                     product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
// //                     'bg-red-100 text-red-800'
// //                   }`}>
// //                     {product.status}
// //                   </span>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Products;

// // pages/Products.jsx
// import React, { useState } from 'react';
// import { Plus, Edit, Trash2, Filter, Search, AlertCircle } from 'lucide-react';
// import { useProducts } from '../hooks/useProducts';
// import ProductModal from '../components/ProductModal';

// const Products = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [deleteConfirm, setDeleteConfirm] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [selectedStatus, setSelectedStatus] = useState('All');

//   const {
//     products,
//     categories,
//     addProduct,
//     updateProduct,
//     deleteProduct,
//     addCategory,
//   } = useProducts();

//   // Filter products
//   const filteredProducts = products.filter(product => {
//     const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          product.description?.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
//     const matchesStatus = selectedStatus === 'All' || product.status === selectedStatus;
    
//     return matchesSearch && matchesCategory && matchesStatus;
//   });

//   const handleCreate = (productData) => {
//     addProduct(productData);
//     setIsModalOpen(false);
//   };

//   const handleUpdate = (productData) => {
//     updateProduct(selectedProduct.id, productData);
//     setIsModalOpen(false);
//     setSelectedProduct(null);
//   };

//   const handleDelete = (id) => {
//     deleteProduct(id);
//     setDeleteConfirm(null);
//   };

//   const openEditModal = (product) => {
//     setSelectedProduct(product);
//     setIsModalOpen(true);
//   };

//   const openCreateModal = () => {
//     setSelectedProduct(null);
//     setIsModalOpen(true);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'In Stock': return 'bg-green-100 text-green-800';
//       case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
//       case 'Out of Stock': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
//           <p className="text-gray-600 text-sm mt-1">
//             Manage your products, inventory, and categories
//           </p>
//         </div>
//         <button
//           onClick={openCreateModal}
//           className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
//         >
//           <Plus size={20} />
//           <span>Add Product</span>
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow-md p-4">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           {/* Search */}
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search products..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//             />
//           </div>

//           {/* Category Filter */}
//           <select
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//           >
//             <option value="All">All Categories</option>
//             {categories.map(category => (
//               <option key={category} value={category}>{category}</option>
//             ))}
//           </select>

//           {/* Status Filter */}
//           <select
//             value={selectedStatus}
//             onChange={(e) => setSelectedStatus(e.target.value)}
//             className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//           >
//             <option value="All">All Status</option>
//             <option value="In Stock">In Stock</option>
//             <option value="Low Stock">Low Stock</option>
//             <option value="Out of Stock">Out of Stock</option>
//           </select>

//           {/* Results Count */}
//           <div className="flex items-center justify-end text-sm text-gray-600">
//             {filteredProducts.length} products found
//           </div>
//         </div>
//       </div>

//       {/* Products Table */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Product
//                 </th>
//                 <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
//                   Category
//                 </th>
//                 <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Price
//                 </th>
//                 <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
//                   Stock
//                 </th>
//                 <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Status
//                 </th>
//                 <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {filteredProducts.map((product) => (
//                 <tr key={product.id} className="hover:bg-gray-50">
//                   <td className="px-4 lg:px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       {product.images && product.images.length > 0 ? (
//                         <img
//                           src={product.images[0]}
//                           alt={product.name}
//                           className="w-10 h-10 rounded-lg object-cover"
//                         />
//                       ) : (
//                         <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
//                           <span className="text-xs text-gray-500">No Image</span>
//                         </div>
//                       )}
//                       <div>
//                         <div className="text-sm font-medium text-gray-800">
//                           {product.name}
//                         </div>
//                         {product.hasCustomSizes && (
//                           <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
//                             Custom Sizes
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-4 lg:px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">
//                     {product.category}
//                   </td>
//                   <td className="px-4 lg:px-6 py-4 text-sm font-medium text-gray-800">
//                     {product.price}
//                   </td>
//                   <td className="px-4 lg:px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
//                     {product.stock}
//                   </td>
//                   <td className="px-4 lg:px-6 py-4">
//                     <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(product.status)}`}>
//                       {product.status}
//                     </span>
//                   </td>
//                   <td className="px-4 lg:px-6 py-4">
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => openEditModal(product)}
//                         className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
//                       >
//                         <Edit size={16} />
//                       </button>
//                       <button
//                         onClick={() => setDeleteConfirm(product.id)}
//                         className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {filteredProducts.length === 0 && (
//             <div className="text-center py-12">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
//                 <Filter size={32} className="text-purple-600" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-800 mb-2">
//                 No Products Found
//               </h3>
//               <p className="text-gray-600 mb-4">
//                 {products.length === 0 
//                   ? "Get started by adding your first product"
//                   : "Try adjusting your search or filters"
//                 }
//               </p>
//               {products.length === 0 && (
//                 <button
//                   onClick={openCreateModal}
//                   className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
//                 >
//                   <Plus size={20} />
//                   <span>Add Your First Product</span>
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Product Modal */}
//       <ProductModal
//         isOpen={isModalOpen}
//         onClose={() => {
//           setIsModalOpen(false);
//           setSelectedProduct(null);
//         }}
//         onSubmit={selectedProduct ? handleUpdate : handleCreate}
//         product={selectedProduct}
//         categories={categories}
//         onAddCategory={addCategory}
//       />

//       {/* Delete Confirmation Modal */}
//       {deleteConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg max-w-md w-full p-6">
//             <div className="flex items-center gap-3 text-red-600 mb-4">
//               <AlertCircle size={24} />
//               <h3 className="text-lg font-bold">Delete Product?</h3>
//             </div>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to delete this product? This action cannot be undone.
//             </p>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setDeleteConfirm(null)}
//                 className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleDelete(deleteConfirm)}
//                 className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
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

// export default Products;


import React, { useState } from 'react';
import { Plus, Edit, Trash2, Filter, Search, AlertCircle, X, Grid, List, Package, TrendingUp, TrendingDown } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import ProductModal from '../components/ProductModal';

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
  } = useProducts();

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate stats
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.status === 'In Stock').length;
  const lowStockProducts = products.filter(p => p.status === 'Low Stock').length;
  const outOfStockProducts = products.filter(p => p.status === 'Out of Stock').length;

  const handleCreate = (productData) => {
    addProduct(productData);
    setIsModalOpen(false);
  };

  const handleUpdate = (productData) => {
    updateProduct(selectedProduct.id, productData);
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDelete = (id) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800 border-green-200';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Out of Stock': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'In Stock': return <TrendingUp size={14} />;
      case 'Low Stock': return <TrendingDown size={14} />;
      case 'Out of Stock': return <AlertCircle size={14} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="text-purple-600" size={32} />
            Fassion Management
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage your products, inventory, and categories
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus size={20} />
          <span className="font-semibold">Add Product</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 lg:p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-blue-800">Total Products</h3>
            <Package className="text-blue-600" size={20} />
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-blue-900">{totalProducts}</p>
          <p className="text-xs text-blue-600 mt-1">All categories</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 lg:p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-green-800">In Stock</h3>
            <TrendingUp className="text-green-600" size={20} />
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-green-900">{inStockProducts}</p>
          <p className="text-xs text-green-600 mt-1">Available items</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4 lg:p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-yellow-800">Low Stock</h3>
            <TrendingDown className="text-yellow-600" size={20} />
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-yellow-900">{lowStockProducts}</p>
          <p className="text-xs text-yellow-600 mt-1">Needs restock</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4 lg:p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-red-800">Out of Stock</h3>
            <AlertCircle className="text-red-600" size={20} />
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-red-900">{outOfStockProducts}</p>
          <p className="text-xs text-red-600 mt-1">Unavailable</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 lg:p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer transition"
          >
            <option value="All">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer transition"
          >
            <option value="All">All Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'grid' 
                  ? 'bg-white text-purple-600 shadow' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'table' 
                  ? 'bg-white text-purple-600 shadow' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Showing <span className="font-semibold text-gray-800">{filteredProducts.length}</span> of <span className="font-semibold text-gray-800">{totalProducts}</span> products
          </span>
          {(searchTerm || selectedCategory !== 'All' || selectedStatus !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedStatus('All');
              }}
              className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
            >
              <X size={16} />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Products Display */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4">
            <Filter size={40} className="text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No Products Found
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {products.length === 0 
              ? "Get started by adding your first product to your inventory"
              : "Try adjusting your search or filters to find what you're looking for"
            }
          </p>
          {products.length === 0 && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus size={20} />
              <span className="font-semibold">Add Your First Product</span>
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-gray-100 overflow-hidden group">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="text-gray-400" size={48} />
                  </div>
                )}
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border flex items-center gap-1 backdrop-blur-sm bg-opacity-90 ${getStatusColor(product.status)}`}>
                    {getStatusIcon(product.status)}
                    {product.status}
                  </span>
                </div>
                {/* Custom Size Badge */}
                {product.hasCustomSizes && (
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-600 text-white backdrop-blur-sm bg-opacity-90">
                      Custom Sizes
                    </span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 mb-1 line-clamp-1 text-lg">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      {product.price}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">Stock</span>
                    <p className="text-sm font-semibold text-gray-700">{product.stock} units</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium"
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(product.id)}
                    className="flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Table View
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden sm:table-cell">
                    Category
                  </th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                    Stock
                  </th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-purple-50 transition-colors">
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                            <Package className="text-gray-400" size={20} />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-semibold text-gray-800">
                            {product.name}
                          </div>
                          {product.hasCustomSizes && (
                            <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded mt-1 inline-block">
                              Custom Sizes
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-700 font-medium hidden sm:table-cell">
                      <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-sm font-bold text-gray-900">
                      {product.price}
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-700 font-medium hidden md:table-cell">
                      {product.stock} units
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border flex items-center gap-1 w-fit ${getStatusColor(product.status)}`}>
                        {getStatusIcon(product.status)}
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Product"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Product"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={selectedProduct ? handleUpdate : handleCreate}
        product={selectedProduct}
        categories={categories}
        onAddCategory={addCategory}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl transform transition-all">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-xl font-bold">Delete Product?</h3>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Are you sure you want to delete this product? This action cannot be undone and will permanently remove the product from your inventory.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium shadow-lg hover:shadow-xl"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;