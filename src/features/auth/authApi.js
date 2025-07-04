import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../constant';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}api/user/`,
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: 'signup',
        method: 'POST',
        body: userData,
      }),
    }),
    ForgotPassword: builder.mutation({
      query: (email) => ({
        url: 'forgot-password',
        method: 'POST',
        body: email,
      }),
    }),
    verifyOTP: builder.mutation({
      query: (otp) => ({
        url: 'verify-token',
        method: 'POST',
        body: otp,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useForgotPasswordMutation,
  useVerifyOTPMutation,
} = authApi;
