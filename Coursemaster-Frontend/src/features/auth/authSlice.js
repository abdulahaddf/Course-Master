import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

const initialState = {
  user: user || null,
  token: token || null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await authService.register(userData);
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await authService.login(userData);
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      await authService.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await authService.getMe(token);
      return response;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(getMe.rejected, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
  }
});

export const { reset, clearUser } = authSlice.actions;
export default authSlice.reducer;