import { useState } from "react"
import { Eye, EyeClosed } from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"
import PasswordStrengthMeter from "../Components/PasswordStrength"
import toast from "react-hot-toast"
import { useAuthStore } from "../store/AuthStore"
import {User, Mail, LockKeyhole, ArrowRight} from "lucide-react"
import { GoogleLogin } from "@react-oauth/google";


export default function SignupPage () {
    const [payload, setPayload] = useState ({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    })

    const [verifyPassword, setVerifyPassword] = useState("")

    const navigate = useNavigate ()
    
    const [ showPassword, setShowPassword ] = useState(false)

    const { signup, isSigningup, googleLogin } = useAuthStore()

    const getStrength = (pass) => {
		let strength = 0;
		if (pass.length >= 8) strength++;
		if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
		if (pass.match(/\d/)) strength++;
		if (pass.match(/[^a-zA-Z\d]/)) strength++;
		return strength;
	};

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(getStrength(payload.password) != 4) {
            toast.error("Password is not strong")
            return
        }
        if(payload.password != verifyPassword){
            toast.error("Passwords do not match")
            return
        }
        try {
            const result = await signup(payload)
            if (result?.success) navigate ("/verify-email")
        } catch (error) {
            toast.error(error)
        }
    }

    return (
        <div className="overflow-x-hidden dark:bg-black dark:text-white w-full flex flex-col justify-center items-center bg-white px-8 mt-15 mb-10">
            <div className="flex flex-col gap-2 mb-6 justify-center items-center ">
                <h2 className="text-stone-800 dark:text-white font-bold text-3xl tracking-wide mb-2">Create an Account</h2>
                <p className="text-stone-600 font-medium dark:text-white text-sm">Already have an account?  <NavLink to="/login" className="text-blue-700 hover:underline py-1 px-2">Sign In</NavLink></p>
            </div>
            <form className="md:w-1/3 w-9/10 flex flex-col gap-2 sm:gap-4 justify-content items-center" onSubmit={handleSubmit}>
                <div className="border-b dark:text-white border-stone-400 my-6 relative pb-2 flex items-center">
                    <User className="size-5 text-stone-600 dark:text-white"/>
                    <input
                        className="dark:text-white focus:outline-none focus:ring-0 bg-none px-1 ml-2 text-black focus:border-none tracking-wider font-bold text-lg placeholder:font-normal w-full"
                        id="first-name"
                        type="text"
                        placeholder="First Name"
                        value={ payload.firstName }
                        onChange={ (e) => {setPayload({ ...payload, firstName: e.target.value })} }
                        required
                    />
                </div>
                <div className="border-b dark:text-white border-stone-400 my-6 relative pb-2 flex items-center">
                    <User className="size-5 text-stone-600 dark:text-white"/>
                    <input
                        className="focus:outline-none dark:text-white focus:ring-0 bg-none px-1 ml-2 text-black focus:border-none tracking-wider font-bold text-lg placeholder:font-normal w-full"
                        id="last-name"
                        type="text"
                        placeholder="Last name"
                        value={ payload.lastName }
                        onChange={ (e) => {setPayload({ ...payload, lastName: e.target.value })} }
                        required
                    />
                </div>
                <div className="border-b border-stone-400 my-6 relative pb-2 flex items-center">
                    <Mail className="size-5 dark:text-white text-stone-600"/>
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
                <div className="border-b border-stone-400 my-6 relative pb-2 flex items-center">
                    <LockKeyhole className="size-5 dark:text-white text-stone-600"/>
                    <div className="flex justify-between w-full">
                        <input
                        className="focus:outline-none dark:text-white focus:ring-0 bg-none px-1 ml-2 text-black focus:border-none tracking-widest font-bold text-lg placeholder:font-normal placeholder:tracking-wider w-full"
                        id="password"
                        type= {showPassword? "text" : "password" }
                        placeholder="Password"
                        value={ payload.password }
                        onChange={ (e) => {
                            const newPassword = e.target.value;
                            setPayload({ ...payload, password: newPassword })
                            if(!newPassword) {
                                setVerifyPassword("")
                            }
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
                <div>
                    {payload.password && <PasswordStrengthMeter password={payload.password}/>}
                </div>
                <div className={"border-b border-stone-400 dark:text-white my-6 relative pb-2 flex items-center"}>
                    <LockKeyhole className="size-5 dark:text-white text-stone-600"/>
                    <input
                        className="focus:outline-none dark:text-white focus:ring-none bg-none px-1 ml-2 text-black focus:border-none tracking-widest font-bold text-lg placeholder:font-normal placeholder:tracking-wider w-full"
                        id="password"
                        disabled={!payload.password}
                        type="password"
                        placeholder="Re-Type Password"
                        value={ verifyPassword }
                        onChange={ (e) => {
                            setVerifyPassword (e.target.value)
                        } }
                        required
                    />
                </div>
                {verifyPassword.length>0 && 
                <div className="flex">
                    {
                        verifyPassword === payload.password? <p className="ml-auto text-green-700 text-sm">Passwords match</p> : <p className="ml-auto text-red-700 text-sm">Passwords do not match</p>
                    }
                </div>
                }
                <div className="px-10 text-center py-1 rounded-4xl bg-blue-700 text-md font-normal text-white relative">
                    <button type="submit">
                        {
                            isSigningup? "Signing up..." : "Sign Up"
                        }
                    </button>
                    <ArrowRight className="w-5 h-5 bg-blue-400 absolute rounded-full top-1/2 -translate-y-1/2 right-2"/>
                </div>
                <p>Or</p>
                <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                        const result = await googleLogin(credentialResponse.credential);
                        if(result?.success) navigate("/add-username")
                    }}
                    onError={() => {
                        toast.error("Google Sign-In failed");
                    }}
                    theme="filled_blue"
                    size="large"
                    shape="pill"
                    text="signup_with"
                    width="200"
                />
             
            </form>
        </div>
    )
}