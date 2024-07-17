import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import {
  AllProductsResponse,
  CategoriesResponse,
  MessageResponse,
  NewProductRequest,
  ProductDetailsResponse,
  SearchProductsQueryArguments,
  SearchProductsResponse,
  deleteProductRequest,
  updateProductRequest,
} from '../../types/api-types';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
  }),
  tagTypes: ['product'],
  endpoints: (builder) => ({
    latestProducts: builder.query<AllProductsResponse, string>({
      query: () => 'latest',
      providesTags: ['product'],
    }),
    allProducts: builder.query<AllProductsResponse, string>({
      query: (id) => `admin-products?id=${id}`,
      providesTags: ['product'],
    }),
    categories: builder.query<CategoriesResponse, string>({
      query: () => `categories`,
      providesTags: ['product'],
    }),
    searchProducts: builder.query<
      SearchProductsResponse,
      SearchProductsQueryArguments
    >({
      query: ({ price, search, sort, page, category }) => {
        let base = `all?search=${search}&page=${page}`;

        if (price) base += `&price=${price}`;
        if (sort) base += `&sort=${sort}`;
        if (category) base += `&category=${category}`;

        return base;
      },
      providesTags: ['product'],
    }),
    productDetails: builder.query<ProductDetailsResponse, string>({
      query: (id) => id,
      providesTags: ['product'],
    }),
    createProduct: builder.mutation<MessageResponse, NewProductRequest>({
      query: ({ formData, id }) => ({
        url: `new?id=${id}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['product'],
    }),
    updateProduct: builder.mutation<MessageResponse, updateProductRequest>({
      query: ({ formData, userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['product'],
    }),
    deleteProduct: builder.mutation<MessageResponse, deleteProductRequest>({
      query: ({ userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['product'],
    }),
  }),
});

export const {
  useLatestProductsQuery,
  useAllProductsQuery,
  useCategoriesQuery,
  useSearchProductsQuery,
  useCreateProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;