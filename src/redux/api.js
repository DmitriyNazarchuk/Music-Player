import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'


export const api = createApi( {
  reducerPath: 'api',
  baseQuery: graphqlRequestBaseQuery({
    url: 'http://player.node.ed.asmer.org.ua/graphql',
    prepareHeaders: (headers, { getState }) => {
      const authState = getState().persistedReducer.auth;
      if (authState && authState.token) {
        headers.set('Authorization', `Bearer ${authState.token}`);
      }
      return headers;
    } 
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ login, password }) => ({
        document: 
                `query login ($login: String!, $password: String!) {
                    login(login: $login, password: $password) 
                }`,
        variables: { login, password },
      })
    }),
    registration: builder.mutation({
      query: ({ login, password }) => ({
        document: 
                `mutation reg ($login:String! ,$password:String!){
                    createUser(login:$login ,password:$password) { 
                      _id login}
                }`,
       
        variables: { login, password }, 
      })
    }),  
   })
  });

  export const {
    useLoginMutation,
    useRegistrationMutation} = api;