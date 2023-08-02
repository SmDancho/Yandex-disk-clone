import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios'
import type {user} from "../../types/types"
import {useCookie} from "../../hooks/getToken"
import type {files} from "../../types/types"

export interface DataState {
  user: user | null,
  filesData: files | null
  isLoading: boolean
  token: string | null
  urlForUpload: string 
  status:string 
}

const initialState: DataState = {
  user:null,
  isLoading: false,
  token: null ,
  filesData: null,
  urlForUpload:'',
  status:''
};

export const getUserToken = createAsyncThunk(
  'user/getToken',
  async (code:string) => {
    const data =  axios
    .post(
      `https://oauth.yandex.ru/token`,
     {
        code:code,
        client_id: import.meta.env.VITE_CLIENT_ID,
        client_secret:"335f255fc14b48fabbcc679f8ab32003",
        grant_type: "authorization_code"
      },
      { headers: { 'Content-type': 'application/x-www-form-urlencoded' } }
    )
    .then((response) => {
      document.cookie =
      encodeURIComponent('token') +
      '=' +
      encodeURIComponent(response.data.access_token);
      
      return response.data.access_token});
    return data
  }
)

export const getUserData = createAsyncThunk(
  'user/getUserData',
  async () => {
    const data =  axios.get(`https://login.yandex.ru/info`, {
      params: {
        oauth_token:useCookie('token')
      }
    }).then((response) => response.data)
    return data
  }
)


export const getUserDisk = createAsyncThunk(
  'user/getUserDisk',
  async () => {
    const data =  axios.get(`https://cloud-api.yandex.net/v1/disk`, {
      headers: {
        Accept: 'application/json',
        Authorization: `OAuth ${useCookie('token')}`
      },
      params: {
        oauth_token:useCookie('token')
      }
    }).then((response) => response.data)
    return data
  }
)

export const uploadFileRequest = createAsyncThunk(
  'user/getUrlUpload',
  async (fileData:File) => {
 
    const data = axios.get(`https://cloud-api.yandex.net/v1/disk/resources/upload?path=${fileData.name}`,{ headers : {
      Authorization: `OAuth ${useCookie('token')}`,
      Accept: 'application/json' 
      
    }}).then(response => axios.put(response.data.href ,fileData) )
  
    return await data
  }
)

export const getFiles = createAsyncThunk(
  'user/getFiles',
  async () => {
    const data =  axios.get(`https://cloud-api.yandex.net/v1/disk/resources/last-uploaded`,{ headers : {
      Authorization: `OAuth ${useCookie('token')}`,
      Accept: 'application/json' 
      
    }}).then(response => response.data)
    return data
  }
)


export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(getUserToken.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getUserToken.fulfilled, (state, action) => {
      state.isLoading = false
      state.token = action.payload
      state.status = ''
    })
    builder.addCase(getUserToken.rejected, (state) => {
      state.isLoading = false
    })

    //user data

    builder.addCase(getUserData.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getUserData.fulfilled, (state, action) => {
      state.isLoading = false
      state.user = action.payload
      state.status = ''
    })
    builder.addCase(getUserData.rejected, (state) => {
      state.isLoading = false
    })
    //upload file 
    builder.addCase(uploadFileRequest.pending, (state) => {
      state.isLoading = true
    })  
    builder.addCase(uploadFileRequest.fulfilled, (state) => {
      state.isLoading = false
      state.status = 'succes'
     
     
    })  
    builder.addCase(uploadFileRequest.rejected, (state) => {
      state.isLoading = false
    })
    //  get files name
     builder.addCase(getFiles.pending, (state) => {
      state.isLoading = true
    })  
    builder.addCase(getFiles.fulfilled, (state,action) => {
      state.isLoading = false
      state.filesData = action.payload
    })  
    builder.addCase(getFiles.rejected, (state) => {
      state.isLoading = false
    })
  },
})


// export const { } = counterSlice.actions;

export default dataSlice.reducer;
