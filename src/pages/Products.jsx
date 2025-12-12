// // pages/Products.jsx
// import React, { useMemo, useState } from "react";
// import {
//   Plus,
//   Edit,
//   Trash2,
//   Filter,
//   Search,
//   AlertCircle,
//   X,
//   Grid,
//   List,
//   Package,
//   TrendingUp,
//   TrendingDown,
// } from "lucide-react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import ProductModal from "../components/ProductModal";

// const API_BASE_URL = "https://api.houseofresha.com";

// const Products = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [deleteConfirm, setDeleteConfirm] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [selectedStatus, setSelectedStatus] = useState("All");
//   const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'

//   const queryClient = useQueryClient();

//   // Fetch all products from clothing API
//   const {
//     data: products = [],
//     isLoading,
//     error,
//     refetch,
//   } = useQuery({
//     queryKey: ["products"],
//     queryFn: async () => {
//       const res = await fetch(`${API_BASE_URL}/clothing`);
//       if (!res.ok) throw new Error("Failed to fetch products");
//       const json = await res.json();
//       // API: { success: true, data: [...] }
//       return json.data || [];
//     },
//     staleTime: 5 * 60 * 1000,
//     refetchOnWindowFocus: false,
//   });

//   // Delete mutation
//   const deleteMutation = useMutation({
//     mutationFn: async (id) => {
//       const res = await fetch(`${API_BASE_URL}/clothing/${id}`, {
//         method: "DELETE",
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.message || "Failed to delete product");
//       }
//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["products"] });
//     },
//   });

//   // Derive categories from categoryId in products
//   // ...

//   const categories = useMemo(() => {
//     const map = new Map();
//     products.forEach((p) => {
//       if (p.categoryId?._id && !map.has(p.categoryId._id)) {
//         map.set(p.categoryId._id, p.categoryId.name || "Unnamed");
//       }
//     });
//     return Array.from(map.values());
//   }, [products]);

//   // Derive stock status from your data (if you have a stock field; if not, treat all as In Stock)
//   const getStatus = (product) => {
//     const stock = product.stock ?? 10; // fallback if no stock
//     if (stock === 0) return "Out of Stock";
//     if (stock < 5) return "Low Stock";
//     return "In Stock";
//   };

//   // Filter products for UI
//   const filteredProducts = useMemo(() => {
//     return products.filter((p) => {
//       const name = p.name?.toLowerCase() || "";
//       const desc = p.description?.toLowerCase() || "";
//       const matchesSearch =
//         name.includes(searchTerm.toLowerCase()) ||
//         desc.includes(searchTerm.toLowerCase());

//       const categoryName = p.categoryId?.name || "";
//       const matchesCategory =
//         selectedCategory === "All" || categoryName === selectedCategory;

//       const status = getStatus(p);
//       const matchesStatus =
//         selectedStatus === "All" || status === selectedStatus;

//       return matchesSearch && matchesCategory && matchesStatus;
//     });
//   }, [products, searchTerm, selectedCategory, selectedStatus]);

//   // Stats
//   const totalProducts = products.length;
//   const inStockProducts = products.filter(
//     (p) => getStatus(p) === "In Stock"
//   ).length;
//   const lowStockProducts = products.filter(
//     (p) => getStatus(p) === "Low Stock"
//   ).length;
//   const outOfStockProducts = products.filter(
//     (p) => getStatus(p) === "Out of Stock"
//   ).length;

//   const openCreateModal = () => {
//     setSelectedProduct(null);
//     setIsModalOpen(true);
//   };

//   const openEditModal = (product) => {
//     setSelectedProduct(product);
//     setIsModalOpen(true);
//   };

//   const handleDelete = (id) => {
//     deleteMutation.mutate(id, {
//       onSuccess: () => setDeleteConfirm(null),
//     });
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "In Stock":
//         return "bg-green-100 text-green-800 border-green-200";
//       case "Low Stock":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200";
//       case "Out of Stock":
//         return "bg-red-100 text-red-800 border-red-200";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "In Stock":
//         return <TrendingUp size={14} />;
//       case "Low Stock":
//         return <TrendingDown size={14} />;
//       case "Out of Stock":
//         return <AlertCircle size={14} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-2">
//             <Package className="text-purple-600" size={32} />
//             Fashion Management
//           </h1>
//           <p className="text-gray-600 text-sm mt-1">
//             Manage your products, inventory, and categories
//           </p>
//         </div>
//         <button
//           onClick={openCreateModal}
//           className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//         >
//           <Plus size={20} />
//           <span className="font-semibold">Add Product</span>
//         </button>
//       </div>

//       {/* Loading / Error */}
//       {isLoading && (
//         <div className="text-center text-gray-600">Loading products...</div>
//       )}
//       {error && (
//         <div className="text-center text-red-600">
//           Failed to load products: {error.message}
//         </div>
//       )}

//       {/* Stats and filters only when data loaded */}
//       {!isLoading && !error && (
//         <>
//           {/* Stats cards */}
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//             <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 lg:p-6">
//               <div className="flex items-center justify-between mb-2">
//                 <h3 className="text-sm font-medium text-blue-800">
//                   Total Products
//                 </h3>
//                 <Package className="text-blue-600" size={20} />
//               </div>
//               <p className="text-2xl lg:text-3xl font-bold text-blue-900">
//                 {totalProducts}
//               </p>
//             </div>

//             <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 lg:p-6">
//               <div className="flex items-center justify-between mb-2">
//                 <h3 className="text-sm font-medium text-green-800">In Stock</h3>
//                 <TrendingUp className="text-green-600" size={20} />
//               </div>
//               <p className="text-2xl lg:text-3xl font-bold text-green-900">
//                 {inStockProducts}
//               </p>
//             </div>

//             <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4 lg:p-6">
//               <div className="flex items-center justify-between mb-2">
//                 <h3 className="text-sm font-medium text-yellow-800">
//                   Low Stock
//                 </h3>
//                 <TrendingDown className="text-yellow-600" size={20} />
//               </div>
//               <p className="text-2xl lg:text-3xl font-bold text-yellow-900">
//                 {lowStockProducts}
//               </p>
//             </div>

//             <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4 lg:p-6">
//               <div className="flex items-center justify-between mb-2">
//                 <h3 className="text-sm font-medium text-red-800">
//                   Out of Stock
//                 </h3>
//                 <AlertCircle className="text-red-600" size={20} />
//               </div>
//               <p className="text-2xl lg:text-3xl font-bold text-red-900">
//                 {outOfStockProducts}
//               </p>
//             </div>
//           </div>

//           {/* Filters */}
//           <div className="bg-white rounded-xl shadow-md p-4 lg:p-6 border border-gray-100">
//             <div className="flex flex-col lg:flex-row gap-4">
//               {/* Search */}
//               <div className="flex-1 relative">
//                 <Search
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                   size={20}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search products..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 />
//                 {searchTerm && (
//                   <button
//                     onClick={() => setSearchTerm("")}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     <X size={20} />
//                   </button>
//                 )}
//               </div>

//               {/* Category filter */}
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
//               >
//                 <option value="All">All Categories</option>
//                 {categories.map((c) => (
//                   <option key={c} value={c}>
//                     {c}
//                   </option>
//                 ))}
//               </select>

//               {/* Status filter */}
//               <select
//                 value={selectedStatus}
//                 onChange={(e) => setSelectedStatus(e.target.value)}
//                 className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
//               >
//                 <option value="All">All Status</option>
//                 <option value="In Stock">In Stock</option>
//                 <option value="Low Stock">Low Stock</option>
//                 <option value="Out of Stock">Out of Stock</option>
//               </select>

//               {/* View */}
//               <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
//                 <button
//                   onClick={() => setViewMode("grid")}
//                   className={`p-2 rounded-lg ${
//                     viewMode === "grid"
//                       ? "bg-white text-purple-600 shadow"
//                       : "text-gray-600 hover:text-gray-800"
//                   }`}
//                 >
//                   <Grid size={20} />
//                 </button>
//                 <button
//                   onClick={() => setViewMode("table")}
//                   className={`p-2 rounded-lg ${
//                     viewMode === "table"
//                       ? "bg-white text-purple-600 shadow"
//                       : "text-gray-600 hover:text-gray-800"
//                   }`}
//                 >
//                   <List size={20} />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Display products (grid only, to keep answer shorter) */}
//           {filteredProducts.length === 0 ? (
//             <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
//               <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4">
//                 <Filter size={40} className="text-purple-600" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-800 mb-2">
//                 No Products Found
//               </h3>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {filteredProducts.map((p) => {
//                 const imgPath = Array.isArray(p.images)
//                   ? p.images[0]
//                   : p.images;
//                 const fullImg = imgPath ? `${API_BASE_URL}${imgPath}` : "";
//                 const status = getStatus(p);

//                 return (
//                   <div
//                     key={p._id}
//                     className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-gray-100"
//                   >
//                     <div className="relative h-48 bg-gray-100 overflow-hidden group">
//                       {fullImg ? (
//                         <img
//                           src={fullImg}
//                           alt={p.name}
//                           className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center">
//                           <Package className="text-gray-400" size={48} />
//                         </div>
//                       )}
//                       <div className="absolute top-3 right-3">
//                         <span
//                           className={`px-3 py-1 text-xs font-semibold rounded-full border flex items-center gap-1 backdrop-blur-sm ${getStatusColor(
//                             status
//                           )}`}
//                         >
//                           {getStatusIcon(status)}
//                           {status}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="p-4">
//                       <div className="mb-1">
//                         <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
//                           {p.categoryId?.name}
//                         </span>
//                       </div>
//                       <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">
//                         {p.name}
//                       </h3>
//                       <p className="text-sm text-gray-600 line-clamp-2 mb-3">
//                         {p.description}
//                       </p>
//                       <div className="flex items-center justify-between mb-3">
//                         <span className="text-xl font-bold text-gray-900">
//                           ₹{p.price?.toLocaleString()}
//                         </span>
//                       </div>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => openEditModal(p)}
//                           className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
//                         >
//                           <Edit size={16} />
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => setDeleteConfirm(p._id)}
//                           className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </>
//       )}

//       {/* Product Modal (create / edit) */}
//       <ProductModal
//         isOpen={isModalOpen}
//         onClose={() => {
//           setIsModalOpen(false);
//           setSelectedProduct(null);
//         }}
//         onSubmit={async () => {
//           // ProductModal already does POST/PUT; just refetch list
//           await refetch();
//         }}
//         product={selectedProduct}
//         refetchProducts={refetch}
//       />

//       {/* Delete confirmation */}
//       {deleteConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
//             <div className="flex items-center gap-3 text-red-600 mb-4">
//               <AlertCircle size={24} />
//               <h3 className="text-lg font-bold">Delete Product?</h3>
//             </div>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to delete this product? This cannot be
//               undone.
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

import React, { useMemo, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Filter,
  Search,
  AlertCircle,
  X,
  Grid,
  List,
  Package,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProductModal from "../components/ProductModal";

const API_BASE_URL = "https://api.houseofresha.com";

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [viewMode, setViewMode] = useState("grid");

  const queryClient = useQueryClient();

  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/clothing`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const json = await res.json();
      return json.data || [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API_BASE_URL}/clothing/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete product");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const categories = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      if (p.categoryId?._id && !map.has(p.categoryId._id)) {
        map.set(p.categoryId._id, p.categoryId.name || "Unnamed");
      }
    });
    return Array.from(map.values());
  }, [products]);

  const getStatus = (product) => {
    const stock = product.stock ?? 10;
    if (stock === 0) return "Out of Stock";
    if (stock < 5) return "Low Stock";
    return "In Stock";
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const name = p.name?.toLowerCase() || "";
      const desc = p.description?.toLowerCase() || "";
      const matchesSearch =
        name.includes(searchTerm.toLowerCase()) ||
        desc.includes(searchTerm.toLowerCase());

      const categoryName = p.categoryId?.name || "";
      const matchesCategory =
        selectedCategory === "All" || categoryName === selectedCategory;

      const status = getStatus(p);
      const matchesStatus =
        selectedStatus === "All" || status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  const totalProducts = products.length;
  const inStockProducts = products.filter(
    (p) => getStatus(p) === "In Stock"
  ).length;
  const lowStockProducts = products.filter(
    (p) => getStatus(p) === "Low Stock"
  ).length;
  const outOfStockProducts = products.filter(
    (p) => getStatus(p) === "Out of Stock"
  ).length;

  const openCreateModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id, {
      onSuccess: () => setDeleteConfirm(null),
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800 border-green-200";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Out of Stock":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "In Stock":
        return <TrendingUp size={14} />;
      case "Low Stock":
        return <TrendingDown size={14} />;
      case "Out of Stock":
        return <AlertCircle size={14} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-purple-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <Package className="text-white" size={24} />
                </div>
                Fashion Management
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-2 ml-0 sm:ml-14">
                Manage your products, inventory, and categories
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
            >
              <Plus size={20} />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-purple-100">
            <RefreshCw
              className="animate-spin mx-auto mb-4 text-purple-600"
              size={48}
            />
            <p className="text-gray-600 text-lg font-medium">
              Loading products...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl shadow-xl p-8 text-center border-2 border-red-200">
            <AlertCircle className="mx-auto mb-4 text-red-600" size={48} />
            <p className="text-red-600 text-lg font-semibold">
              Failed to load products: {error.message}
            </p>
          </div>
        )}

        {/* Stats and filters */}
        {!isLoading && !error && (
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs sm:text-sm font-semibold text-blue-800">
                    Total Products
                  </h3>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                    <Package className="text-blue-700" size={18} />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900">
                  {totalProducts}
                </p>
                <p className="text-xs text-blue-600 mt-1">All items</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs sm:text-sm font-semibold text-green-800">
                    In Stock
                  </h3>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-200 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-green-700" size={18} />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-900">
                  {inStockProducts}
                </p>
                <p className="text-xs text-green-600 mt-1">Available now</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs sm:text-sm font-semibold text-yellow-800">
                    Low Stock
                  </h3>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-200 rounded-lg flex items-center justify-center">
                    <TrendingDown className="text-yellow-700" size={18} />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-900">
                  {lowStockProducts}
                </p>
                <p className="text-xs text-yellow-600 mt-1">Needs restock</p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs sm:text-sm font-semibold text-red-800">
                    Out of Stock
                  </h3>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-200 rounded-lg flex items-center justify-center">
                    <AlertCircle className="text-red-700" size={18} />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-900">
                  {outOfStockProducts}
                </p>
                <p className="text-xs text-red-600 mt-1">Unavailable</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-5 lg:p-6 border border-purple-100">
              <div className="flex flex-col gap-4">
                {/* Search */}
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search products by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm sm:text-base"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>

                {/* Filters row */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Category filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all text-sm sm:text-base font-medium"
                  >
                    <option value="All">All Categories</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  {/* Status filter */}
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all text-sm sm:text-base font-medium"
                  >
                    <option value="All">All Status</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>

                  {/* View toggle */}
                  <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1.5 shadow-inner">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2.5 rounded-lg transition-all ${
                        viewMode === "grid"
                          ? "bg-white text-purple-600 shadow-md"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                      title="Grid View"
                    >
                      <Grid size={20} />
                    </button>
                    <button
                      onClick={() => setViewMode("table")}
                      className={`p-2.5 rounded-lg transition-all ${
                        viewMode === "table"
                          ? "bg-white text-purple-600 shadow-md"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                      title="List View"
                    >
                      <List size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products display */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 lg:p-16 text-center border border-purple-100">
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl mb-6">
                  <Filter size={40} className="text-purple-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                    setSelectedStatus("All");
                  }}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {filteredProducts.map((p) => {
                  const imgPath = Array.isArray(p.images)
                    ? p.images[0]
                    : p.images;
                  const fullImg = imgPath ? `${API_BASE_URL}${imgPath}` : "";
                  const status = getStatus(p);

                  return (
                    <div
                      key={p._id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border border-gray-100 transform hover:-translate-y-1 group"
                    >
                      <div className="relative h-48 sm:h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                        {fullImg ? (
                          <img
                            src={fullImg}
                            alt={p.name}
                            className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="text-gray-400" size={48} />
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-3 py-1.5 text-xs font-bold rounded-full border-2 flex items-center gap-1.5 backdrop-blur-md shadow-lg ${getStatusColor(
                              status
                            )}`}
                          >
                            {getStatusIcon(status)}
                            {status}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>

                      <div className="p-4 sm:p-5">
                        <div className="mb-2">
                          <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                            {p.categoryId?.name || "Uncategorized"}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2 line-clamp-1 text-base sm:text-lg">
                          {p.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4 min-h-[2.5rem]">
                          {p.description}
                        </p>
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            ₹{p.price?.toLocaleString()}
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 sm:gap-3">
                          <button
                            onClick={() => openEditModal(p)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all font-semibold shadow-sm hover:shadow-md border border-blue-200"
                          >
                            <Edit size={16} />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(p._id)}
                            className="px-3 sm:px-4 py-2.5 bg-gradient-to-r from-red-50 to-red-100 text-red-600 rounded-xl hover:from-red-100 hover:to-red-200 transition-all shadow-sm hover:shadow-md border border-red-200"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Product Modal */}
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
          onSubmit={async () => {
            await refetch();
          }}
          product={selectedProduct}
          refetchProducts={refetch}
        />

        {/* Delete confirmation */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl animate-slideUp">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="text-red-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Delete Product?
                </h3>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={deleteMutation.isLoading}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deleteMutation.isLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleteMutation.isLoading ? (
                    <>
                      <RefreshCw className="animate-spin" size={18} />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Products;
