import { Eye, EyeClosed, LockKeyhole } from "lucide-react"
import { useState } from "react"
import { NavLink, useNavigate, useParams } from "react-router-dom"
import PasswordStrengthMeter from "../Components/PasswordStrength"
import { useAuthStore } from "../store/AuthStore"

export default function ResetPassword () {
    const navigate = useNavigate ()

    const [ showPassword, setShowPassword ] = useState(false)

    const [password, setPassword] = useState ("")

    const [verifyPassword, setVerifyPassword] = useState("")
    
    const resetPassword = useAuthStore((state) => state.resetPassword)

    const isChangingPassword = useAuthStore((state) => state.isChangingPassword)
    
    const getStrength = (pass) => {
		let strength = 0;
		if (pass.length >= 8) strength++;
		if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
		if (pass.match(/\d/)) strength++;
		if (pass.match(/[^a-zA-Z\d]/)) strength++;
		return strength;
	};

    const { token } = useParams()

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(getStrength(password) != 4) {
            toast.error("Password is not strong")
            return
        }
        if(password != verifyPassword){
            toast.error("Passwords do not match")
            return
        }
        try {
            const result = await resetPassword(password, token)
            if (result?.success) navigate ("/login", { replace: true })
        } catch (error) {
            toast.error(error)
        }
    }

    return (
        <div className="w-ful flex flex-col dark:text-white justify-center items-center mt-30 px-8 mb-10">
            <div className="flex flex-col gap-2 mb-8 justify-center items-center ">
                <h2 className="text-stone-800 dark:text-white font-bold text-3xl tracking-wide mb-2">Change Your Password</h2>
                <p className="text-stone-600 font-medium dark:text-white text-sm text-center">Enter a new password to change your password</p>
            </div>
            <form onSubmit={handleSubmit} className="md:w-1/3 w-9/10 flex items-center flex-col" >
                <div className="border-b border-stone-400 my-6 relative pb-2 flex items-center">
                <LockKeyhole className="size-5 text-stone-600 dark:text-white"/>
                <div className="flex justify-between w-full">
                    <input
                    className="focus:outline-none focus:ring-0 bg-none px-1 dark:text-white ml-2 text-black focus:border-none tracking-widest font-bold text-lg placeholder:font-normal placeholder:tracking-wider w-full"
                    type= {showPassword? "text" : "password" }
                    placeholder="Password"
                    value={ password }
                    onChange={ (e) => {
                        setPassword(e.target.value)
                        password.length === 0 && setVerifyPassword ("")
                    } }
                    required
                />
                {password.length>0 && <button onClick={ (e)=>{
                    e.preventDefault()
                    setShowPassword (!showPassword)
                }}>
                    {!showPassword? <Eye /> : <EyeClosed/>}
                </button>}
                </div>
            </div>
            <div>
                {password && <PasswordStrengthMeter password={password}/>}
            </div>
            <div className={"border-b border-stone-400 my-6 relative pb-2 flex items-center"}>
                <LockKeyhole className="size-5 text-stone-600 dark:text-white"/>
                <input
                    className="focus:outline-none focus:ring-none dark:text-white bg-none px-1 ml-2 text-black focus:border-none tracking-widest font-bold text-lg placeholder:font-normal placeholder:tracking-wider w-full"
                    disabled={!password}
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
                <div className="flex items-center">
                    {
                        verifyPassword === password? <p className="ml-auto text-green-700 text-sm">Passwords match</p> : <p className="ml-auto text-red-700 text-sm">Passwords do not match</p>
                    }
                </div>
                }
                <button type="submit" 
                    className="bg-blue-700 py-2 rounded-2xl shadow-md mt-8 shadow-stone-500 dark:shadow-none text-stone-50 font-semibold w-3/4"
                    disabled={isChangingPassword}
                >
                    {isChangingPassword ? "Changing Password..." : "Change Password"}
                </button>
            </form>
        </div>
    )
}