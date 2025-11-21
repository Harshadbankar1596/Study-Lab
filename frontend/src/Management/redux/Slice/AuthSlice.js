import { createSlice } from "@reduxjs/toolkit";
import { AuthAPI } from "../Api/AuthApi";
import { encryptData } from "../../Utils/Encryption";

const AuthSlice = createSlice({
  name: "AuthSlice",
  initialState: {
    management: JSON.parse(localStorage.getItem("Management_Token")) || null,
    // management: {} || null,
  },
  reducers: {
    logout: (state) => {
      state.management = null;
      localStorage.removeItem("Management");
      localStorage.removeItem("Management_Token");
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      AuthAPI.endpoints.verifyOtp.matchFulfilled,
      (state, { payload }) => {
        state.management = payload.management;

        localStorage.setItem(
          "Management_Token",
          JSON.stringify(payload?.token)
        );

        // Encrypt before saving
        const encryptedManagement = encryptData(payload?.management);
        localStorage.setItem("Management", encryptedManagement);
      }
    );
  },
});

export const { logout } = AuthSlice.actions;
export default AuthSlice.reducer;
