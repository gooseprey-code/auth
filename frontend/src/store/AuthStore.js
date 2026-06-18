import axiosInstance from "../lib/axios"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import toast from "react-hot-toast"
import { use } from "react"

export const useAuthStore = create (persist((set, get) => ({
    isSigningUp: false,
    isSigningIn: false,
    isVerifyingEmail: false,
    isAddingUsername: false,
    isCheckingUsername: false,
    authUser: null,
    isLoading: false,
    suggestedUsernames: [],
    isUsernameAvailable: null,
    isSendingToken: false,
    usernameStatus: null,

    signup: async (payload) => {
        set({ isSigningUp: true })
        try {
            const response = await axiosInstance.post("/auth/signup",payload)
            set({ authUser: response.data.user, message: response.data.message, isSigningUp: false})
            return {success: true}
        } catch (error) {
            toast.error(error?.response?.data?.message || "something went wrong during signup")
            set({ authUser: null, isSigningUp: false })
            return {success: false}
        }
    },

    forgotPassword: async (payload) => {
        set({ isSigningIn: true })
        try {
            const response = await axiosInstance.post("/auth/forgot-password",payload)
            set({ authUser: response.data.user, message: response.data.message})
            return {success: true}
        } catch (error) {
            toast.error(error?.response?.data?.message || "email sending failed try again")
            return {success: false}
        }
    },

    login: async (payload) => {
        set({ isSigningIn: true })
        try {
            const response = await axiosInstance.post("/auth/login",payload)
            set({ authUser: response.data.user, message: response.data.message, isSigningIn: false})
            return {success: true}
        } catch (error) {
            toast.error(error?.response?.data?.message || "something went wrong during login")
            set({ authUser: null, isSigningIn: false })
            return {success: false}
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout")
            set({ authUser:null})
            return {success: true}
        } catch (error) {
            set({ authUser: null})
            return {success: false}
        }
    },
    
    verifyEmail: async(code) => {
        set ({ isVerifyingEmail: true })
        try {
            const response = await axiosInstance.post("/auth/verify-email", {code})
            set({ authUser: response.data.user, isVerifyingEmail: false})
            return { success: true }
        } catch (error) {
            toast.error(error?.response?.data?.message || "error here")
            set({ isVerifyingEmail: false })
            return { success: false }
        }
    },

    resendVerificationToken: async(email) => {
    set ({ isSendingToken: true })
    try {
        const response = await axiosInstance.post("/auth/resend-verification-token", {email})
        set({ authUser: response.data.user, isSendingToken: false})
        return { success: true }
    } catch (error) {
        toast.error(error?.response?.data?.message || "error resending token")
        set({ isSendingToken: false })
        return { success: false }
    }
    },

    addUsername: async (username) => {
        set({
            isAddingUsername: true,
            usernameStatus: ""
        })

        try {
            const response = await axiosInstance.post(
                "/auth/add-username",
                { username }
            )

            
            set({
                authUser: response.data.user,
                isAddingUsername: false,
                usernameStatus: ""
            })
            console.log(isAddingUsername);
            return { success: true }

        } catch (error) {

            const message =
                error?.response?.data?.message ||
                "Error adding username"

            set({
                usernameStatus: message,
                isAddingUsername: false
            })

            return {
                success: false,
                message
            }
        }
    },

    usernameAvailabilityCheck: async(username) => {
        console.log("Before check:", get().authUser);
        set ({ isCheckingUsername: true })
        console.log("After set true:", get().authUser); 
        try {
            const response = await axiosInstance.post("/auth/username-availability/", {username})
            set({ isUsernameAvailable: response?.data?.success, usernameStatus: response?.data?.message})
            
            return response?.data?.success
        } catch (error) {
            set({ isUsernameAvailable: false, usernameStatus: error?.response?.data?.message || "Error checking username availability" })
            console.log("After set false:", get().authUser);
        }finally {
            set({ isCheckingUsername: false })
        }
    },

    suggestedUsername: async (firstName) => {
        set({ isLoading: true });

        try {
            const response = await axiosInstance.post(
            "/auth/suggested-usernames/",
            { firstName }
            );

            set({
            suggestedUsernames: response?.data?.suggestedNames ?? [],
            });

        } catch (error) {
            toast.error(
            error?.response?.data?.message || "Failed to fetch usernames"
            );

            set({
            suggestedUsernames: [],
            });

        } finally {
            set({ isLoading: false });
        }
    },

    uploadAvatar: async (formData) => {
        set({ isLoading: true })
        try {
            const response = await axiosInstance.post("/auth/upload-avatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            set({ authUser: response.data.user })
            toast.success("Avatar uploaded successfully")
            return { success: true }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error uploading avatar")
            return { success: false }
        } finally {
            set({ isLoading: false })
        }
    },
    googleLogin: async (credential) => {
        set({ isSigningIn: true });

        try {
            const response = await axiosInstance.post(
                "/auth/google",
                { credential }
            );

            set({
                authUser: response.data.user
            });
            return { success: true };
        } catch (error) {
            console.error("Google Login Error:", error);
            return { success: false };
        } finally {
            set({
                isSigningIn: false
            });
        }
    }
})),
{
    name: "auth-storage",
}
)