/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { authAPI } from '@/api/auth'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
}

export const loginUserAPI = createAsyncThunk(
  'users/login',
  async (data: SignInFormData, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(data)
      return response
    } catch (error: any) {
      const message =
        error.response?.data?.message || error?.message || 'Login failed'
      return rejectWithValue(message)
    }
  }
)
export const registerUserAPI = createAsyncThunk(
  'users/register',
  async (data: SignInFormData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(data)
      return response
    } catch (error: any) {
      const message =
        error.response?.data?.message || error?.message || 'Register failed'
      return rejectWithValue(message)
    }
  }
)
export const verifyEmailAPI = createAsyncThunk(
  'users/verifyEmail',
  async (data: { email: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyEmail(data.email, data.token)
      return response
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Email verification failed'
      )
    }
  }
)
export const logoutUserAPI = createAsyncThunk(
  'users/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.logout()

      return response
    } catch (error: any) {
      return rejectWithValue('Logout failed')
    }
  }
)
export const getCurrentUserAPI = createAsyncThunk(
  'users/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getCurrentUser()
      return response
    } catch (error: any) {
      return rejectWithValue('Failed to fetch current user')
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null
    },
    // Manual logout (khi token expire)
    resetAuth: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
    },
    // Check auth
    checkAuth: (state, action: PayloadAction<User | null>) => {
      if (action.payload) {
        state.user = action.payload
        state.isAuthenticated = true
      } else {
        state.user = null
        state.isAuthenticated = false
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUserAPI.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUserAPI.fulfilled, (state, action) => {
        state.isLoading = false
        // Lưu user info (không cần lưu tokens vì đã có trong cookies)
        const userData = action.payload.data
        state.user = {
          _id: userData._id,
          email: userData.email,
          displayName: userData.displayName,
          role: userData.role,
          avatar: userData.avatar,
          gender: userData.gender,
          dob: userData.dob,
          heightCm: userData.heightCm,
          weightKg: userData.weightKg,
          verifyToken: null,
          token: '', // Không cần
          createAt: userData.createdAt,
          updateAt: userData.updatedAt
        }
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUserAPI.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })
      // Logout
      .addCase(logoutUserAPI.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logoutUserAPI.fulfilled, (state) => {
        state.isLoading = false
        state.user = null
        state.isAuthenticated = false
        state.error = null
      })
      .addCase(logoutUserAPI.rejected, (state) => {
        state.isLoading = false
        state.user = null
        state.isAuthenticated = false
      })
      // Register
      .addCase(registerUserAPI.pending, (state) => {
        state.isLoading = false

        state.error = null
      })
      .addCase(registerUserAPI.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(registerUserAPI.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Verify Email
      .addCase(verifyEmailAPI.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(verifyEmailAPI.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.data
        state.error = null
      })
      .addCase(verifyEmailAPI.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Get Current User
      .addCase(getCurrentUserAPI.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCurrentUserAPI.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.data
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(getCurrentUserAPI.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
        state.user = null
      })
  }
})

export const { resetAuth, clearError, checkAuth } = userSlice.actions
export const selectCurrentUser = (state: { user: AuthState }) => state.user.user
export const selectIsAuthenticated = (state: { user: AuthState }) =>
  state.user.isAuthenticated
export const selectIsLoading = (state: { user: AuthState }) =>
  state.user.isLoading

export const userReducer = userSlice.reducer
