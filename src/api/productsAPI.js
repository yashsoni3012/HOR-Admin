import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE = 'https://api.houseofresha.com/clothing';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Failed to fetch products');
      const json = await res.json();
      return json.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productData) => {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (!res.ok) throw new Error('Failed to create product');
      return res.json();
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
};
