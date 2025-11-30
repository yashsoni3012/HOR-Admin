// import React, { useState } from "react";
// import BannerModel from "../components/BannerModel";
// import { Plus, Eye, EyeOff, Trash2, Edit, AlertCircle } from "lucide-react";

// const Banners = () => {
//   const [banners, setBanners] = useState([
//     {
//       id: 1,
//       image: "https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
//       active: true,
//       title: "Summer Collection",
//       description: "New arrivals for summer season"
//     },
//     {
//       id: 2,
//       image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
//       active: false,
//       title: "Winter Sale",
//       description: "Up to 50% off on winter collection"
//     },
//     {
//       id: 3,
//       image: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
//       active: true,
//       title: "Festive Special",
//       description: "Special discounts for festive season"
//     }
//   ]);

//   const [openModal, setOpenModal] = useState(false);
//   const [deleteConfirm, setDeleteConfirm] = useState(null);
//   const [viewMode, setViewMode] = useState('all'); // 'all' or 'active'

//   // Filter banners based on view mode
//   const filteredBanners = viewMode === 'active' 
//     ? banners.filter(banner => banner.active)
//     : banners;

//   const activeBanners = banners.filter(banner => banner.active);

//   const toggleActive = (id) => {
//     setBanners((prev) =>
//       prev.map((b) =>
//         b.id === id ? { ...b, active: !b.active } : b
//       )
//     );
//   };

//   const deleteBanner = (id) => {
//     setBanners(banners.filter((b) => b.id !== id));
//     setDeleteConfirm(null);
//   };

//   const updateBanner = (id, updatedData) => {
//     setBanners(prev => prev.map(banner => 
//       banner.id === id ? { ...banner, ...updatedData } : banner
//     ));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             <div className="flex-1">
//               <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//                 Banner Management
//               </h1>
//               <p className="text-gray-600 text-sm mt-2">
//                 Manage your website banners and promotional content
//               </p>
//             </div>
//             <button
//               onClick={() => setOpenModal(true)}
//               className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
//             >
//               <Plus size={20} />
//               <span>Add New Banner</span>
//             </button>
//           </div>
//         </div>

//         {/* Stats and Filters */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {/* Active Banners Count */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Active Banners</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-1">{activeBanners.length}</p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-xl">
//                 <Eye className="text-green-600" size={24} />
//               </div>
//             </div>
//           </div>

//           {/* Total Banners Count */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Banners</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-1">{banners.length}</p>
//               </div>
//               <div className="p-3 bg-purple-100 rounded-xl">
//                 <Plus className="text-purple-600" size={24} />
//               </div>
//             </div>
//           </div>

//           {/* View Toggle */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">View Mode</p>
//                 <div className="flex gap-2 mt-2">
//                   <button
//                     onClick={() => setViewMode('all')}
//                     className={`px-3 py-1 text-sm rounded-lg font-medium transition ${
//                       viewMode === 'all' 
//                         ? 'bg-purple-600 text-white' 
//                         : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                     }`}
//                   >
//                     All
//                   </button>
//                   <button
//                     onClick={() => setViewMode('active')}
//                     className={`px-3 py-1 text-sm rounded-lg font-medium transition ${
//                       viewMode === 'active' 
//                         ? 'bg-green-600 text-white' 
//                         : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                     }`}
//                   >
//                     Active Only
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Banners Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {filteredBanners.map((banner) => (
//             <div
//               key={banner.id}
//               className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden transition-all duration-200 hover:shadow-md group ${
//                 banner.active 
//                   ? 'border-green-500 border-opacity-50' 
//                   : 'border-gray-200'
//               }`}
//             >
//               {/* Banner Image */}
//               <div className="relative aspect-video bg-gray-100">
//                 <img
//                   src={banner.image}
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
//                   alt={banner.title || "Banner"}
//                 />
                
//                 {/* Active Badge */}
//                 <div className="absolute top-3 left-3">
//                   <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                     banner.active 
//                       ? 'bg-green-500 text-white' 
//                       : 'bg-gray-500 text-white'
//                   }`}>
//                     {banner.active ? 'ACTIVE' : 'INACTIVE'}
//                   </span>
//                 </div>

//                 {/* Overlay Actions */}
//                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => toggleActive(banner.id)}
//                       className={`p-2 rounded-full backdrop-blur-sm transition ${
//                         banner.active 
//                           ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
//                           : 'bg-green-500 text-white hover:bg-green-600'
//                       }`}
//                       title={banner.active ? "Deactivate" : "Activate"}
//                     >
//                       {banner.active ? <EyeOff size={16} /> : <Eye size={16} />}
//                     </button>
//                     <button
//                       onClick={() => setDeleteConfirm(banner.id)}
//                       className="p-2 bg-red-500 text-white rounded-full backdrop-blur-sm hover:bg-red-600 transition"
//                       title="Delete Banner"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Banner Info */}
//               <div className="p-4">
//                 <h3 className="font-semibold text-gray-900 line-clamp-1">
//                   {banner.title || "Untitled Banner"}
//                 </h3>
//                 {banner.description && (
//                   <p className="text-sm text-gray-600 mt-1 line-clamp-2">
//                     {banner.description}
//                   </p>
//                 )}
                
//                 {/* Quick Actions */}
//                 <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
//                   <button
//                     onClick={() => toggleActive(banner.id)}
//                     className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition ${
//                       banner.active 
//                         ? 'bg-green-100 text-green-700 hover:bg-green-200' 
//                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                     }`}
//                   >
//                     {banner.active ? <Eye size={14} /> : <EyeOff size={14} />}
//                     <span>{banner.active ? "Active" : "Inactive"}</span>
//                   </button>
                  
//                   <button
//                     onClick={() => setDeleteConfirm(banner.id)}
//                     className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition"
//                     title="Delete"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Empty State */}
//         {filteredBanners.length === 0 && (
//           <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
//             <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl mb-6">
//               <Plus size={32} className="text-purple-600" />
//             </div>
//             <h3 className="text-xl font-bold text-gray-900 mb-3">
//               {banners.length === 0 ? 'No Banners Yet' : 'No Banners Found'}
//             </h3>
//             <p className="text-gray-600 mb-8 max-w-md mx-auto">
//               {banners.length === 0 
//                 ? "Get started by adding your first banner to showcase on your website"
//                 : `No ${viewMode === 'active' ? 'active' : ''} banners match your current view`
//               }
//             </p>
//             {banners.length === 0 && (
//               <button
//                 onClick={() => setOpenModal(true)}
//                 className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
//               >
//                 <Plus size={20} />
//                 <span>Add Your First Banner</span>
//               </button>
//             )}
//           </div>
//         )}

//         {/* Add Banner Modal */}
//         {openModal && (
//           <BannerModel
//             close={() => setOpenModal(false)}
//             addBanner={(bannerData) => {
//               const newBanner = {
//                 id: Date.now(),
//                 image: bannerData.image,
//                 title: bannerData.title,
//                 description: bannerData.description,
//                 active: false,
//               };
//               setBanners([...banners, newBanner]);
//             }}
//           />
//         )}

//         {/* Delete Confirmation Modal */}
//         {deleteConfirm && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
//               <div className="flex items-center gap-3 text-red-600 mb-4">
//                 <div className="p-2 bg-red-100 rounded-xl">
//                   <AlertCircle size={24} />
//                 </div>
//                 <h3 className="text-xl font-bold">Delete Banner?</h3>
//               </div>
//               <p className="text-gray-600 mb-6">
//                 Are you sure you want to delete this banner? This action cannot be undone.
//               </p>
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setDeleteConfirm(null)}
//                   className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => deleteBanner(deleteConfirm)}
//                   className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Banners;


import React from 'react'

const Banners = () => {
  return (
    <div>
      hello
    </div>
  )
}

export default Banners
