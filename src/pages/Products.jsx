// pages/Products.jsx
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
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'

  const queryClient = useQueryClient();

  // Fetch all products from clothing API
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
      // API: { success: true, data: [...] }
      return json.data || [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Delete mutation
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

  // Derive categories from categoryId in products
  // ...

  const categories = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      if (p.categoryId?._id && !map.has(p.categoryId._id)) {
        map.set(p.categoryId._id, p.categoryId.name || "Unnamed");
      }
    });
    return Array.from(map.values());
  }, [products]);

  // Derive stock status from your data (if you have a stock field; if not, treat all as In Stock)
  const getStatus = (product) => {
    const stock = product.stock ?? 10; // fallback if no stock
    if (stock === 0) return "Out of Stock";
    if (stock < 5) return "Low Stock";
    return "In Stock";
  };

  // Filter products for UI
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

  // Stats
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="text-purple-600" size={32} />
            Fashion Management
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

      {/* Loading / Error */}
      {isLoading && (
        <div className="text-center text-gray-600">Loading products...</div>
      )}
      {error && (
        <div className="text-center text-red-600">
          Failed to load products: {error.message}
        </div>
      )}

      {/* Stats and filters only when data loaded */}
      {!isLoading && !error && (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 lg:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-blue-800">
                  Total Products
                </h3>
                <Package className="text-blue-600" size={20} />
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-blue-900">
                {totalProducts}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 lg:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-green-800">In Stock</h3>
                <TrendingUp className="text-green-600" size={20} />
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-green-900">
                {inStockProducts}
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4 lg:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-yellow-800">
                  Low Stock
                </h3>
                <TrendingDown className="text-yellow-600" size={20} />
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-yellow-900">
                {lowStockProducts}
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4 lg:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-red-800">
                  Out of Stock
                </h3>
                <AlertCircle className="text-red-600" size={20} />
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-red-900">
                {outOfStockProducts}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-md p-4 lg:p-6 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Category filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
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
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="All">All Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>

              {/* View */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${
                    viewMode === "grid"
                      ? "bg-white text-purple-600 shadow"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-lg ${
                    viewMode === "table"
                      ? "bg-white text-purple-600 shadow"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Display products (grid only, to keep answer shorter) */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4">
                <Filter size={40} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No Products Found
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((p) => {
                const imgPath = Array.isArray(p.images)
                  ? p.images[0]
                  : p.images;
                const fullImg = imgPath ? `${API_BASE_URL}${imgPath}` : "";
                const status = getStatus(p);

                return (
                  <div
                    key={p._id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-gray-100"
                  >
                    <div className="relative h-48 bg-gray-100 overflow-hidden group">
                      {fullImg ? (
                        <img
                          src={fullImg}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="text-gray-400" size={48} />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full border flex items-center gap-1 backdrop-blur-sm ${getStatusColor(
                            status
                          )}`}
                        >
                          {getStatusIcon(status)}
                          {status}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="mb-1">
                        <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                          {p.categoryId?.name}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">
                        {p.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {p.description}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-gray-900">
                          ₹{p.price?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(p._id)}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
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

      {/* Product Modal (create / edit) */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={async () => {
          // ProductModal already does POST/PUT; just refetch list
          await refetch();
        }}
        product={selectedProduct}
        refetchProducts={refetch}
      />

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle size={24} />
              <h3 className="text-lg font-bold">Delete Product?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? This cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
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

export default Products;
