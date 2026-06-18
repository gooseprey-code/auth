import { useEffect, useRef, useState } from "react"
import { useAuthStore } from "../store/AuthStore"
import { useNavigate } from "react-router-dom"
import { User } from "lucide-react"
import toast from "react-hot-toast"

export default function AddUsername () {
    const addUsername = useAuthStore((state) => state.addUsername);
    const isAddingUsername = useAuthStore((state) => state.isAddingUsername);
    const suggestedUsernames = useAuthStore((state) => state.suggestedUsernames);
    const uploadAvatar = useAuthStore((state) => state.uploadAvatar);
    const usernameAvailabilityCheck = useAuthStore(
        (state) => state.usernameAvailabilityCheck
    );
    const authUser = useAuthStore((state) => state.authUser);

    const suggestedUsername = useAuthStore(
    (state) => state.suggestedUsername
    );

    const [username, setUsername] = useState ("")

    const inputRef= useRef(null)
    
    const [message, setMessage] = useState ("")

    const [isUsernameCheck, setIsUsernameCheck] = useState (null)   

    const navigate = useNavigate()

    const regex = /^[A-Za-z][A-Za-z0-9._]{3,19}$/

    const [avatarPreview, setAvatarPreview] = useState(null);

    const store = useAuthStore()

    const handleAutoSubmit = async (name) => {
        try {
            const result = await addUsername (name)
            if (result?.success) {
                navigate ("/")
                toast.success("username added successfully")
            }   
                        console.log("isAddingUsername:", isAddingUsername);

        } catch (error) {
            toast.error(error)
        }   
    }

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);

        setAvatarPreview((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return previewUrl;
        });

        const formData = new FormData();
        formData.append("avatar", file);

        await uploadAvatar(formData);
    };

    const handleSubmit = async () => {
        try {
            const result = await addUsername (username)
            if (result?.success) {
                navigate ("/")
                toast.success("username added successfully")
            }
        } catch (error) {
            toast.error(error)
        }
    }

    useEffect(() => {
        return () => {
            if (avatarPreview) URL.revokeObjectURL(avatarPreview);
        };
    }, [avatarPreview]);

    useEffect(() => {
        const controller = new AbortController();

        const timer = setTimeout(async () => {
            console.log("Checking username availability for:", username);
            if (!username) {
                setMessage("");
                setIsUsernameCheck(null);
                return;
            }

            if (
                username.length < 4 ||
                username.length > 20 ||
                !regex.test(username)
            ) {
                setMessage("Invalid username format");
                setIsUsernameCheck(null);
                return;
            }

            try {
                const available = await usernameAvailabilityCheck(
                    username,
                    controller.signal
                );

                setIsUsernameCheck(available);
                setMessage(
                    available
                        ? "Username is available"
                        : "Username is taken"
                );
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error(err);
                }
            }
        }, 250);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [username]);

    useEffect(() => {
    if (!authUser?.firstName) return;

    suggestedUsername(authUser.firstName);
}, [authUser?.firstName, suggestedUsername]);

useEffect(() => {
    console.log("Store changed:", store);
}, [store]);
   
    return (
        <div className="flex flex-col py-5 dark:text-white justify-center items-center m-10 gap-5 mt-10">
            <div className="rounded-full border-2 relative shadow-2xl dark:shadow-md shadow-stone-600 dark:shadow-stone-900 border-stone-400 h-30 w-30">
                <button
                className="flex flex-col justify-center items-center rounded-full overflow-hidden absolute inset-0 object-cover group hover:cursor-pointer"
                onClick={() => inputRef.current.click()}
                >
                <img
                    src={avatarPreview || authUser?.avatar || "avatar.png"}
                    alt="User image"
                    className="rounded-full "
                />
                <div className="absolute inset-0 bg-transparent flex items-center justify-center transition-opacity">
                    <span className="text-stone-900 text-xs font-semibold">Add a photo</span>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    ref={inputRef}
                    className="hidden"
                    onChange={handleImageChange}
                />
                </button>
            </div>
            <p>{authUser.username}</p>
            <h1 className="mt-12 text-2xl font-bold">Add Your Username</h1>
            <div className="flex flex-col items-center gap-2 md:w-1/3 w-9/10">
                <div className="border-b border-stone-400 my-6 relative pb-2 flex items-center">
                    <User className="size-5 dark:text-white text-stone-600"/>
                    <input
                        className="focus:outline-none dark:text-white focus:ring-0 bg-none px-1 ml-2 text-black focus:border-none tracking-wider font-bold text-lg placeholder:font-normal w-full"
                        id="first-name"
                        type="text"
                        placeholder="Username"
                        value={ username }
                        onChange={ (e) => {
                            setUsername(e.target.value) 
                        }}
                        required
                    />
                </div>
                {username.length > 0 && (
                    <p className={`text-sm text-center font-semibold ${isUsernameCheck === null ? "text-stone-600" : isUsernameCheck ? "text-green-600" : "text-red-600"}`}>
                        {message}
                    </p>
                )}
                <div className="w-1/2 text-center">
                    <button onClick={handleSubmit} className="bg-blue-700 dark:bg-blue-500 py-2 mt-3 rounded-2xl shadow-md dark:shadow-none shadow-stone-500 text-stone-50 font-semibold w-full hover:cursor-pointer" disabled={!isUsernameCheck || isAddingUsername} >
                        {
                            isAddingUsername? "Adding username..." : "Add Username"
                        }
                    </button>
                </div> 
            </div>     
            
            <h2 className="text-xl">Or</h2>
            <div className="flex gap-2 flex-wrap justify-center items-center dark:text-stone-300 text-stone-800 font-semibold">
                <h3>Use: </h3>
                {suggestedUsernames?.map((name)=>(
                    <div>
                        <button onClick={()=>{
                            handleAutoSubmit(name)
                        }} className="border-b border-stone-700 dark:shadow-none dark:border-stone-200 dark:text-white shadow-md hover:cursor-pointer">{name}</button>
                    </div>
                ))}
            </div> 
        </div>
    )
}