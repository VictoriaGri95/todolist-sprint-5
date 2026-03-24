import { LoginInputs } from "@/features/auth/lib/schemas"
import { createAppSlice, handleServerAppError, handleServerNetworkError } from "@/common/utils"
import { setAppStatusAC } from "@/app/app-slice.ts"
import { authApi } from "@/features/auth/api/authApi.ts"
import { ResultCode } from "@/common/enums"
import { authToken } from "@/common/constants"
import { clearDataAC } from "@/common/actions"


export const authSlice = createAppSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    login: null as string | null,
  },
  selectors: {
    selectIsLoggedIn: (state) => state.isLoggedIn,
    selectLogin: (state) => state.login
  },
  reducers: (create) => ({
    loginTC: create.asyncThunk(
      async (data: LoginInputs, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await authApi.login(data)
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            const token = res.data.data.token
            localStorage.setItem(authToken, token)
            const meRes = await authApi.me()
            const login = meRes.data.data.login
            return { isLoggedIn: true, login }
          } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleServerNetworkError(dispatch, error)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
          state.login = action.payload.login
        },
      },
    ),
    logoutTC: create.asyncThunk(
      async (_arg, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await authApi.logout()
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            dispatch(clearDataAC())
            localStorage.removeItem(authToken)
            return { isLoggedIn: false }
          } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleServerNetworkError(dispatch, error)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
          state.login = null
        },
      },
    ),
    meTC: create.asyncThunk(
      async (_arg, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await authApi.me()
          const login = res.data.data.login
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return { isLoggedIn: true, login }
          } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (error: any) {
          handleServerNetworkError(error, dispatch)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
          state.login = action.payload.login
        },
      },
    ),
  }),
})

export const { selectIsLoggedIn,  selectLogin } = authSlice.selectors
export const { loginTC, logoutTC, meTC } = authSlice.actions
export const authReducer = authSlice.reducer
