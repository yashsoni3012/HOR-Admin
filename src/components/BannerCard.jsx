// components/BannerCard.jsx
import React, { useState } from 'react';
import { Edit, Trash2, Eye, EyeOff, MoreVertical } from 'lucide-react';

const BannerCard = ({ banner, onEdit, onDelete, onToggleActive }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleEdit = () => {
    onEdit(banner);
    setShowMenu(false);
  };

  const handleDelete = () => {
    onDelete(banner.id);
    setShowMenu(false);
  };

  const handleToggleActive = () => {
    onToggleActive(banner.id);
    setShowMenu(false);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden transition-all duration-200 hover:shadow-md group ${
      banner.isActive 
        ? 'border-green-500 border-opacity-50' 
        : 'border-gray-200'
    }`}>
      {/* Banner Image */}
      <div className="relative aspect-video bg-gray-100">
        <img
          src={banner.image}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          alt={banner.title}
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            banner.isActive 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-500 text-white'
          }`}>
            {banner.isActive ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>

        {/* Position Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
            Pos: {banner.position}
          </span>
        </div>

        {/* Mobile Menu */}
        <div className="absolute top-12 right-3 sm:hidden">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition"
            >
              <MoreVertical size={16} />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10 min-w-[120px]">
                <button
                  onClick={handleToggleActive}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  {banner.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                  <span>{banner.isActive ? "Deactivate" : "Activate"}</span>
                </button>
                <button
                  onClick={handleEdit}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 transition"
                >
                  <Edit size={14} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Overlay Actions - Desktop */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <button
              onClick={handleToggleActive}
              className={`p-2 rounded-full backdrop-blur-sm transition ${
                banner.isActive 
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
              title={banner.isActive ? "Deactivate" : "Activate"}
            >
              {banner.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button
              onClick={handleEdit}
              className="p-2 bg-blue-500 text-white rounded-full backdrop-blur-sm hover:bg-blue-600 transition"
              title="Edit Banner"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 bg-red-500 text-white rounded-full backdrop-blur-sm hover:bg-red-600 transition"
              title="Delete Banner"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Banner Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1 flex-1 pr-2">
            {banner.title}
          </h3>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span className="font-medium">Category:</span>
            <span className="capitalize">{banner.category}</span>
          </div>
          {banner.subcategory && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Subcategory:</span>
              <span className="capitalize">{banner.subcategory}</span>
            </div>
          )}
          <p className="text-gray-700 line-clamp-2 text-xs">
            {banner.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-medium">Button:</span>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
              {banner.buttonText}
            </span>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden sm:flex gap-2 mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={handleToggleActive}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition ${
              banner.isActive 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {banner.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>{banner.isActive ? "Active" : "Inactive"}</span>
          </button>
          
          <button
            onClick={handleEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerCard;