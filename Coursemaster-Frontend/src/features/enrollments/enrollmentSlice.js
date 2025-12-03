import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import enrollmentService from '../../services/enrollmentService';

const initialState = {
  enrollments: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

export const createEnrollment = createAsyncThunk(
  'enrollments/createEnrollment',
  async (enrollmentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await enrollmentService.createEnrollment(enrollmentData, token);
      return response;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getMyEnrollments = createAsyncThunk(
  'enrollments/getMyEnrollments',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await enrollmentService.getMyEnrollments(token);
      return response;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const completeLesson = createAsyncThunk(
  'enrollments/completeLesson',
  async ({ enrollmentId, lessonId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await enrollmentService.completeLesson(enrollmentId, lessonId, token);
      return response;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const enrollmentSlice = createSlice({
  name: 'enrollments',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEnrollment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createEnrollment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.enrollments.push(action.payload);
      })
      .addCase(createEnrollment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getMyEnrollments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyEnrollments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.enrollments = action.payload;
      })
      .addCase(getMyEnrollments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(completeLesson.fulfilled, (state, action) => {
        const index = state.enrollments.findIndex(
          enrollment => enrollment._id === action.payload._id
        );
        if (index !== -1) {
          state.enrollments[index] = action.payload;
        }
      });
  }
});

export const { reset } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;