import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  X,
  Plus,
  Trash2,
  AlertCircle,
  RefreshCw,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Package,
  Info,
  Target,
  Upload as UploadIcon,
} from "lucide-react";

const API_BASE_URL = "https://api.houseofresha.com";

const ProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  refetchProducts,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    sizes: ["S", "M", "L"],
    details: [], // Changed from [""] to [] for better array handling
    commitment: [], // Changed from [""] to []
    images: [""],
  });

  // image upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [newDetail, setNewDetail] = useState("");
  const [newCommitment, setNewCommitment] = useState("");
  const [newSize, setNewSize] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // CHANGED: Fetch categories directly from /category endpoint
  const {
    data: categories = [],
    isLoading: isLoadingCategories, // Changed variable name
    error: categoriesError, // Changed variable name
  } = useQuery({
    queryKey: ["categories"], // Changed query key
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/category`);
      if (!response.ok) {
        throw new Error(
          `Category API Error: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();
      // Adjust this based on your API response structure
      // Common patterns:
      if (Array.isArray(data)) return data; // Direct array
      if (data.data && Array.isArray(data.data)) return data.data; // { data: [...] }
      if (data.success && Array.isArray(data.data)) return data.data; // { success: true, data: [...] }
      return [];
    },
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: isOpen,
  });

  // CHANGED: Removed the entire useMemo block for deriving categories
  // We now use categories directly from the API

  // fill form when editing
  useEffect(() => {
    if (product && isOpen) {
      const imgPath = Array.isArray(product.images)
        ? product.images[0]
        : product.images;

      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        categoryId: product.categoryId?._id || "",
        sizes: product.sizes || ["S", "M", "L"],
        details: product.details?.length
          ? product.details.filter((d) => d && d.trim() !== "")
          : [], // Filter empty strings
        commitment: product.commitment?.length
          ? product.commitment.filter((c) => c && c.trim() !== "")
          : [], // Filter empty strings
        images: imgPath ? [imgPath] : [""],
      });

      setImageFile(null);
      setImagePreview(imgPath ? `${API_BASE_URL}${imgPath}` : "");
      setServerError("");
    } else if (isOpen) {
      resetForm();
    }
  }, [product, isOpen]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      sizes: ["S", "M", "L"],
      details: [], // Changed from [""]
      commitment: [], // Changed from [""]
      images: [""],
    });
    setImageFile(null);
    setImagePreview("");
    setNewDetail("");
    setNewCommitment("");
    setNewSize("");
    setErrors({});
    setServerError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setServerError("");
  };

  // file upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        images: "Only image files are allowed",
      }));
      return;
    }
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        images: "Image size must be less than 5MB",
      }));
      return;
    }

    setImageFile(file);
    setErrors((prev) => ({ ...prev, images: "" }));
    setServerError("");

    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData((prev) => ({ ...prev, images: [""] }));
  };

  const addSize = () => {
    const s = newSize.trim().toUpperCase();
    if (!s || formData.sizes.includes(s)) return;
    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, s],
    }));
    setNewSize("");
    setServerError("");
  };

  const removeSize = (s) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((x) => x !== s),
    }));
  };

  // CHANGED: Updated addDetail to prevent empty entries
  const addDetail = () => {
    const trimmedDetail = newDetail.trim();
    if (!trimmedDetail) return;

    setFormData((prev) => ({
      ...prev,
      details: [...prev.details, trimmedDetail],
    }));
    setNewDetail("");
    setServerError("");
  };

  const removeDetail = (index) => {
    setFormData((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }));
  };

  const addCommitment = () => {
    const trimmedCommitment = newCommitment.trim();
    if (!trimmedCommitment) return;

    setFormData((prev) => ({
      ...prev,
      commitment: [...prev.commitment, trimmedCommitment],
    }));
    setNewCommitment("");
    setServerError("");
  };

  const removeCommitment = (index) => {
    setFormData((prev) => ({
      ...prev,
      commitment: prev.commitment.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.categoryId) newErrors.categoryId = "Category is required";
    if (!imageFile && !formData.images[0]?.trim())
      newErrors.images = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      // Build FormData for multipart/form-data
      const fd = new FormData();

      fd.append("name", formData.name.trim());
      fd.append("description", formData.description.trim());
      fd.append("price", String(Number(formData.price)));
      fd.append("categoryId", formData.categoryId);

      // CHANGED: Send arrays directly (no need to filter empty strings since we don't have them)
      fd.append("sizes", JSON.stringify(formData.sizes));
      fd.append("details", JSON.stringify(formData.details)); // Already filtered
      fd.append("commitment", JSON.stringify(formData.commitment)); // Already filtered

      if (imageFile) {
        fd.append("image", imageFile);
      } else if (formData.images[0]) {
        fd.append("images", formData.images[0]);
      }

      let url = `${API_BASE_URL}/clothing`;
      let method = "POST";

      if (product && product._id) {
        url = `${API_BASE_URL}/clothing/${product._id}`;
        method = "PUT";
      }

      // Debug: Log what's being sent
      console.log("📤 Sending data:");
      for (let [key, value] of fd.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await fetch(url, {
        method,
        body: fd,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message ||
            `API request failed with status ${response.status}`
        );
      }

      if (onSubmit) {
        await onSubmit(responseData);
      }
      if (refetchProducts) {
        await refetchProducts();
      }

      resetForm();
      onClose();
    } catch (err) {
      setServerError(
        err.message || "Failed to submit product. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                <strong>Error:</strong> {serverError}
              </p>
            </div>
          )}

          {/* Basic info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Basic Information
              </h3>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Tag size={16} className="text-purple-600" />
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter product description"
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Price + Category */}
              <div className="grid grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign size={16} className="text-purple-600" />
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0"
                  />
                  {errors.price && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.price}
                    </p>
                  )}
                </div>

                {/* Category - CHANGED: Now uses categories from /category API */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  {isLoadingCategories ? (
                    <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                      <RefreshCw
                        className="animate-spin text-purple-600"
                        size={16}
                      />
                      <span className="text-sm text-gray-600">
                        Loading categories...
                      </span>
                    </div>
                  ) : categories.length > 0 ? (
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.categoryId ? "border-red-500" : "border-gray-300" // Fixed error check
                      }`}
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-2 border border-yellow-300 rounded-lg bg-yellow-50">
                      <p className="text-sm text-yellow-700">
                        No categories found.
                      </p>
                    </div>
                  )}
                  {errors.categoryId && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.categoryId}
                    </p>
                  )}
                  {categoriesError && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {categoriesError.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Image + Sizes */}
            <div className="space-y-4">
              {/* Image upload */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <ImageIcon size={18} className="text-purple-600" />
                  Product Image *
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  Upload a product image (JPG, PNG, or WebP, max 5MB)
                </p>

                <div className="flex flex-col items-center justify-center">
                  {imagePreview ? (
                    <div className="relative mb-3">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-48 h-48 object-contain border border-gray-300 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full">
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadIcon
                            size={32}
                            className="text-gray-400 mb-2"
                          />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, WebP (MAX. 5MB)
                          </p>
                        </div>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {errors.images && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.images}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Note: One main image per product is used by this form.
                </p>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Sizes
                </h3>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder="Add size (e.g., XS)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={addSize}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.sizes.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-1 bg-gray-100 rounded-full text-xs flex items-center gap-1"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => removeSize(s)}
                        className="hover:text-red-500"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Info size={18} className="text-purple-600" />
              Details
            </h3>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newDetail}
                onChange={(e) => setNewDetail(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addDetail())
                }
                placeholder="Good quality"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={addDetail}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.details.length === 0 ? (
                <p className="text-gray-500 text-sm italic">
                  No details added yet
                </p>
              ) : (
                formData.details.map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-700">{d}</span>
                    <button
                      type="button"
                      onClick={() => removeDetail(i)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Commitments */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Target size={18} className="text-purple-600" />
              Commitments
            </h3>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newCommitment}
                onChange={(e) => setNewCommitment(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addCommitment())
                }
                placeholder="This is our commitments"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={addCommitment}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.commitment.length === 0 ? (
                <p className="text-gray-500 text-sm italic">
                  No commitments added yet
                </p>
              ) : (
                formData.commitment.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-700">{c}</span>
                    <button
                      type="button"
                      onClick={() => removeCommitment(i)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoadingCategories} // Changed to isLoadingCategories
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  {product ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{product ? "Update Product" : "Create Product"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
