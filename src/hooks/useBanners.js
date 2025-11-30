// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { bannerAPI } from '../services/api';

// export const useBanners = () => {
//   const queryClient = useQueryClient();

//   const { data: banners, isLoading, error } = useQuery({
//     queryKey: ['banners'],
//     queryFn: async () => {
//       const response = await bannerAPI.getAll();
//       return response.data;
//     },
//   });

//   const createMutation = useMutation({
//     mutationFn: bannerAPI.create,
//     onSuccess: () => {
//       queryClient.invalidateQueries(['banners']);
//     },
//   });

//   const updateMutation = useMutation({
//     mutationFn: ({ id, formData }) => bannerAPI.update(id, formData),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['banners']);
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: bannerAPI.delete,
//     onSuccess: () => {
//       queryClient.invalidateQueries(['banners']);
//     },
//   });

//   return {
//     banners,
//     isLoading,
//     error,
//     createBanner: createMutation.mutate,
//     updateBanner: updateMutation.mutate,
//     deleteBanner: deleteMutation.mutate,
//     isCreating: createMutation.isPending,
//     isUpdating: updateMutation.isPending,
//     isDeleting: deleteMutation.isPending,
//   };
// };