import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {Mail, LockKeyhole, Eye, EyeClosed } from "lucide-react"
import { useAuthStore } from "../store/AuthStore";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

export default function LoginPage () {
    const navigate = useNavigate()

    const {login, isSigningIn} = useAuthStore()

    const googleLogin = useAuthStore((state) => state.googleLogin)

    const [ showPassword, setShowPassword ] = useState(false)

    const [payload, setPayload] = useState ({
            email: "",
            password: "",
        })

    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const result = await login(payload)
            if (result?.success) navigate ("/")
        } catch (error) {
            toast.error(error)
        }
    }
    return (
        <div className="overflow-x-hidden dark:bg-black datrk:text-white w-full flex flex-col items-center justify-center bg-white px-8 mt-20 mb-10">
            <div className="flex flex-col gap-2 mb-6 justify-center items-center ">
                <h2 className="text-stone-800 dark:text-white font-bold text-3xl tracking-wide mb-2">Welcome Back </h2>
                <p className="text-stone-600 dark:text-stone-300 font-medium text-sm">Don't have an account?  <NavLink to="/signup" className="text-blue-700 hover:underline py-1 border-stone-500 rounded-sm px-2">Signup for free</NavLink></p>
            </div>
            <form className="md:w-1/3 w-9/10 mb-2 flex flex-col items-center justify-center" onSubmit={handleSubmit}>
                <div className="border-b border-stone-400 my-6 relative pb-2 flex items-center">
                    <Mail className="dark:text-white size-5 text-stone-600"/>
                    <input
                        className="dark:text-white focus:outline-none focus:ring-0 bg-none px-1 ml-2 text-black focus:border-none tracking-wider font-bold text-lg placeholder:font-normal w-full"
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={ payload.email }
                        onChange={ (e) => {setPayload({ ...payload, email: e.target.value })} }
                        required
                    />
                </div>
                <div className="dark:text-white border-b border-stone-400 my-6 relative pb-2 flex items-center">
                    <LockKeyhole className="dark:text-white size-5 text-stone-600"/>
                    <div className="flex justify-between w-full">
                        <input
                        className="dark:text-white focus:outline-none focus:ring-0 bg-none px-1 ml-2 text-black focus:border-none tracking-widest font-bold text-lg placeholder:font-normal placeholder:tracking-wider w-full"
                        id="password"
                        type= {showPassword? "text" : "password" }
                        placeholder="Password"
                        value={ payload.password }
                        onChange={ (e) => {
                            setPayload({ ...payload, password: e.target.value })
                        } }
                        required
                    />
                    {payload.password.length>0 && <button onClick={ (e)=>{
                        e.preventDefault()
                        setShowPassword (!showPassword)
                    }}>
                        {!showPassword? <Eye /> : <EyeClosed/>}
                    </button>}
                    </div>
                </div> 
                <button className="bg-blue-700 py-2 rounded-2xl shadow-md dark:shadow-none shadow-stone-500 text-stone-50 font-semibold w-1/2">Sign in</button>               
            </form>
            <div className="flex flex-col gap-4 items-center justify-center">
                <p className="dark:text-white">Or</p>
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            const result = await googleLogin(credentialResponse.credential);
                            if(result?.success) navigate("/")
                        }}
                        onError={() => {
                            toast.error("Google Sign-In failed");
                        }}
                        theme="filled_blue"
                        size="large"
                        shape="pill"
                        text="sign_in_with"
                        width="200"
                    />
                <NavLink to="/forgot-password" className="ml-auto font-semibold my-4 text-white">Forgot password</NavLink>

            </div> 
        </div>
    )
}