import { Mail } from "lucide-react"
import { NavLink } from "react-router-dom"
export default function ForgotPassword () {
    return (
        <div  className="w-full mt-20 dark:text-white flex flex-col justify-center items-center px-8 mb-15">
            <div className="flex flex-col gap-2 mb-8 justify-center items-center ">
                <h2 className="text-stone-800 dark:text-white font-bold text-3xl tracking-wide mb-2">Forgot Your Password</h2>
                <p className="text-stone-600 font-medium text-sm dark:text-white text-center">Enter your email address and we'll send you a link to reset your password.</p>
            </div>
            <form  className="my-5 md:w-1/3 w-9/10 flex flex-col items-center justify-center">
                <div className="border-b border-stone-400 my-10 relative flex items-center">
                    <Mail className="size-5 text-stone-600 dark:text-white"/>
                    <input
                        className="focus:outline-none focus:ring-0 bg-none dark:text-white ml-2 text-black focus:border-none tracking-wider font-bold text-lg placeholder:font-normal w-full"
                        id="email"
                        type="email"
                        placeholder="Email"
                        onChange={ (e) => {setPayload({ ...payload, email: e.target.value })} }
                        required
                    />
                </div>
                <button className="bg-blue-700 py-2 w-2/3 dark:shadow-none rounded-2xl shadow-md shadow-stone-500 text-stone-50 font-semibold">Send Reset Link</button>

            </form>
            <p className="text-sm dark:text-gray-300 text-gray-600 mt-4">Remembered your password? <NavLink to="/login" className="text-blue-700 hover:underline py-1 px-2">Login here</NavLink></p>
        </div>
    )
}