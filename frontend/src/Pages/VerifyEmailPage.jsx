import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { useAuthStore } from "../store/AuthStore"


export default function VerifyEmailPage () {
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const inputRefs = useRef([]);
	const navigate = useNavigate();

	const handleChange = (index, value) => {
		const newCode = [...code];

		// Handle pasted content
		if (value.length > 1) {
			const pastedCode = value.slice(0, 6).split("");
			for (let i = 0; i < 6; i++) {
				newCode[i] = pastedCode[i] || "";
			}
			setCode(newCode);

			// Focus on the last non-empty input or the first empty one
			const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
			inputRefs.current[focusIndex].focus();
		} else {
			newCode[index] = value;
			setCode(newCode);

			// Move focus to the next input field if value is entered
			if (value && index < 5) {
				inputRefs.current[index + 1].focus();
			}
		}
	};

	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !code[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
	};

	const { verifyEmail, isVerifyingEmail, authUser, resendVerificationToken, isSendingToken } = useAuthStore ()

	const submitCode = async () => {
	const verificationCode = code.join("");
	try {
		const result = await verifyEmail(verificationCode);
		if (result?.success) navigate("/add-username");
	} catch (error) {
		console.log(error);
	}
	};

	const handleTokenResend = async () => {
		try {
			const result = await resendVerificationToken(authUser.email);
			if (result?.success) toast.success("Verification token resent successfully");
		} catch (error) {
			console.log(error);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const verificationCode = code.join("");
		try {
			const result = await verifyEmail(verificationCode);
			if (result?.success) navigate("/add-username");
		} catch (error) {
			console.log(error);
		}
	};

	// Auto submit when all fields are filled
	useEffect(() => {
		if (code.every((digit) => digit !== "")) {
			submitCode();
		}
	}, [code]);

	return (
		<div className="flex flex-col items-center justify-center">
			<motion.div 
			initial={{ opacity: 0, y: -200 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className=" flex flex-col justify-center items-center -translate-y-5 mt-30 px-2 md:px-6">
				<div 
				className='max-w-md w-full rounded-2xl shadow-2xl shadow-gray-600/70 dark:shadow-gray-800/80 Soverflow-hidden flex justify-center items-center'>
					<div
						className="bg-opacity-50 backdrop-filter backdrop-blur-xl py-10 px-4 w-full max-w-md"
					>
						<h2 className='text-3xl dark:text-stone-300 font-bold mb-6 text-center bg-linear-to-r from-blue-300 to-violet-500 text-transparent bg-clip-text'>
							Verify Your Email
						</h2>
						<p className='text-center text-stone-700 text-md mb-6 font-semibold'>Enter the 6-digit code sent to your email address.</p>

						<form className="w-full  flex items-center justify-center"  onSubmit={handleSubmit}>
							<div className='flex w-full items-center justify-between'>
								{code.map((digit, index) => (
									<input
										key={index}
										ref={(el) => (inputRefs.current[index] = el)}
										type='text'
										maxLength='6'
										value={digit}
										onChange={(e) => handleChange(index, e.target.value)}
										onKeyDown={(e) => handleKeyDown(index, e)}
										className='w-10 h-10 text-center text-xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-blue-700 focus:outline-none'
									/>
								))}
							</div>
						</form>
					</div>
				</div>
			</motion.div>
			{new Date(authUser.verificationTokenExpiresAt).getTime() < new Date().getTime() && (
				<div className="dark:text-white gap-6 flex justify-between items-center mt-10">
					<p> "Token has expired"</p>
					<button onClick={handleTokenResend} className="hover:underline text-blue-800 cursor-pointer dark:text-blue-500">{isSendingToken ? "Resending..." : "Resend Token"}</button>
				</div>
			)}
		</div>
		
		
	);
};