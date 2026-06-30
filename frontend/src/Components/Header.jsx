import { Sun, Moon, Menu, X, ArrowRight, ArrowDown, ArrowUp, ArrowLeft} from "lucide-react"
import { useRef, useState } from "react"
import ReactModal from "react-modal"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/AuthStore"
import { LogOut } from "lucide-react"
import ArticleCard from "./ArticleCard"

export default function Header () {

    const uploadAvatar = useAuthStore((state) => state.uploadAvatar);


    const navigate = useNavigate()
    const [darkMode, setDarkMode] = useState(false)
    const [modal, setModal] = useState(false)
    const [showCategories, setShowCategories] =useState(false)
    const [mainModal, setMainModal] = useState(false)
    const [publishedPlane, setPublishedPlane] = useState(false)
    const [draftPlane, setDraftPlane] = useState(true)
    const toggleMainModal = () => {
        setMainModal(prev => !prev)
    }
    const togglePublished = () => {
        setPublishedPlane(prev => !prev)
    }
    const toggleDraft = () => {
        setDraftPlane(prev => !prev)
    }
    const toggleModal = () => {
        setModal(prev => !prev)
    }
    const toggleCategory = () => {
        setShowCategories (prev => !prev)
    }
    
    const { logout } = useAuthStore()

    const inputRef= useRef(null)

    const [avatarPreview, setAvatarPreview] = useState(null);


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

    const articles = [
        {
            id: "123445",
            name: "Major inputs",
            intro: " nesciunt veniam vero ex laborum quos nostrum fugit nam molestiae",
            type: "published"
        },
        {
            id: "123446",
            name: "Major inputs",
            intro: " nesciunt veniam vero ex laborum quos nostrum fugit nam molestiae",
            type: "published"
        },
        {
            id: "123447",
            name: "Major inputs",
            intro: " nesciunt veniam vero ex laborum quos nostrum fugit nam molestiae",
            type: "published"
        },
        {
            id: "123448",
            name: "Major inputs",
            intro: " nesciunt veniam vero ex laborum quos nostrum fugit nam molestiae",
            type: "published"
        },
        {
            id: "123445",
            name: "Major inputs",
            intro: " nesciunt veniam vero ex laborum quos nostrum fugit nam molestiae",
            type: "draft"
        },
        {
            id: "123446",
            name: "Major inputs",
            intro: " nesciunt veniam vero ex laborum quos nostrum fugit nam molestiae",
            type: "draft"
        },
        {
            id: "123447",
            name: "Major inputs",
            intro: " nesciunt veniam vero ex laborum quos nostrum fugit nam molestiae",
            type: "draft"
        },
    ]

    const authUser = useAuthStore((state) => state.authUser)

    const handleLogOut = async () => {
        const result = await logout()
        if (result.success) navigate("/")
        if (!result.success) navigate("/login")
    }
    return (
        <div className="w-full fixed z-1000 dark:bg-black dark:text-white bg-white flex justify-between items-center  p-4 shadow-sm dark:shadow-stone-300">
            <div className="">
                <NavLink onClick={()=>{setMainModal(false); setModal(false)}} to="/"><h1 className="font-bold text-3xl hover:cursor-pointer">Akisss<span className="italic text-blue-800 dark:text-blue-500 font-normal">Blog</span></h1></NavLink>
            </div>
            <div className="flex justify-center items-center gap-5 hover:cursor-pointer">
                <nav className="hidden md:flex justify-center items-center gap-3 text-md font-semibold">
                    <ul className="">
                        <li><NavLink className={({isActive})=>
                            isActive? `text-blue-800 dark:text-blue-500`: `text-stone-900 dark:text-white`
                        } to="/">Home</NavLink></li>
                    </ul>
                    <ul>
                        <li><NavLink className={({isActive})=>
                            isActive? `text-blue-800 dark:text-blue-500`: `text-stone-900 dark:text-white`
                        } to="/categories">Categories</NavLink></li>
                    </ul>
                    <ul>
                        <li>About Us</li>
                    </ul>
                    <ul>
                        <li>Contact Us</li>
                    </ul>
                    <ul>
                        {!authUser &&
                        <li>
                            <NavLink className={({isActive})=>
                            isActive? `text-blue-800 dark:text-blue-500`: `text-stone-900 dark:text-white`} to="/login">Sign in
                            </NavLink>
                        </li>}
                    </ul>
                </nav>
                {authUser?.isVerified && <img src={authUser?.avatar || "avatar.png"} alt="User avatar" onClick={toggleMainModal} className="border-2 hidden md:block border-stone-500 dark:border-white rounded-full h-10 w-10" />}
                <button className="md:hidden" onClick={() => {
                    toggleModal()
                    setMainModal(false)
                    }}>
                    {!modal?<Menu />:<X />}    
                </button>
            </div>
            <ReactModal
                isOpen={modal}
                onRequestClose={()=>setModal(false)}
                shouldCloseOnOverlayClick={true}
                style={{
                    overlay: {
                    position: 'fixed',
                    top: 68,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.40)'
                    },
                    content: {
                    position: 'absolute',
                    top: '0px',
                    left: '0px',
                    right: '0px',
                    bottom: '0px',
                    border: '1px solid #ccc',
                    background: '#fff',
                    overflow: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    borderRadius: '4px',
                    outline: 'none',
                    padding: '20px'
                    },
                }}
              
                contentLabel="Example Modal"
                >
                <div className="px-6 pt-6 w-full">
                    <nav className="flex flex-col w-full text-xl items-center justify-center gap-10 text-md font-semibold">
                        <ul className="">
                            <li><NavLink 
                            onClick={()=>setModal(false)}
                            className={({isActive})=>
                                isActive? `text-blue-800`: `text-stone-900`
                            } to="/">Home</NavLink></li>
                        </ul>
                        <ul className="flex flex-col justify-center items-center">
                            <div className="flex gap-2 items-center justify-center mb-2">
                                <li onClick={toggleCategory}>
                                    Categories  
                                </li>
                                <div>
                                    <ArrowRight onClick={toggleCategory} className={`${showCategories?`hidden`:`block size-4`}`}/>
                                    <ArrowUp onClick={toggleCategory} className={`${!showCategories?`hidden`:`block size-4`}`}/>
                                </div>
                                
                            </div>
                            <nav className={`flex flex-col items-center justify-center px-8 space-y-3 text-[15px] mt-2 ${showCategories?`block`:`hidden`}`}>
                                <ul>
                                    <li><NavLink to="">Lifestyle</NavLink></li>
                                </ul>
                                <ul>
                                    <li><NavLink to="">Politics</NavLink></li>
                                </ul>
                                <ul>
                                    <li><NavLink to="">Sports</NavLink></li>
                                </ul>
                                <ul>
                                    <li><NavLink to="">Entertainment</NavLink></li>
                                </ul>
                            </nav>
                        </ul>
                        <ul>
                            <li onClick={()=>setMainModal(true)}>Profile</li>
                        </ul>
                        <ul>
                            <li>About Us</li>
                        </ul>
                        <ul>
                            <li>Contact Us</li>
                        </ul>
                        <ul>
                            {authUser ? (
                                <li><NavLink className={({isActive})=>
                                    isActive? `text-blue-800`: `text-stone-900 dark:text-white`} to="/profile" onClick={handleLogOut}>Logout</NavLink></li>
                            ) : (
                                <li><NavLink className={({isActive})=>
                                    isActive? `text-blue-800`: `text-stone-900 dark:text-white`} to="/signup">Sign in</NavLink></li>
                            )}
                        </ul>
                    </nav>
                </div>
            </ReactModal>
            <ReactModal
                isOpen={mainModal}
                onRequestClose={()=>setMainModal(false)}
                shouldCloseOnOverlayClick={true}
                style={{
                    overlay: {
                    position: 'fixed',
                    top: 68,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.40)'
                    },
                    content: {
                    position: 'absolute',
                    top: '0px',
                    left: '0px',
                    right: '0px',
                    bottom: '0px',
                    border: '1px solid #ccc',
                    background: '#fff',
                    overflow: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    borderRadius: '4px',
                    outline: 'none',
                    padding: '20px'
                    }
                }}
              
                contentLabel="Example Modal"
                >
                <div className="px-6 pt-6 flex flex-col items-center gap-4 relative w-full">
                    <ArrowLeft
                     className="absolute left-5 top-0 size-5 md:hidden"
                     onClick={()=>setMainModal(false)}
                    />
                    <LogOut onClick={()=>{
                        setMainModal(false)
                        handleLogOut()}}  className="absolute right-5 top-0 size-5"/>
                    <div className="group border-2 overflow-hidden relative border-stone-800 dark:border-white rounded-full size-25"
                        
                    >
                        <img
                            src={avatarPreview || authUser?.avatar || "avatar.png"}
                            alt="User image"
                            className="absolute size-25 inset-0 bg-cover bg-center bg-no-repeat"
                            onClick={() => inputRef.current.click()}
                        />
                        <button onClick={() => inputRef.current.click()} className="cursor-pointer absolute hidden inset-0 group-hover:block group-hover:bg-gray-400/30 font-bold text-white text-xl tracking-wider">Change</button>
                        <input
                            type="file"
                            accept="image/*"
                            ref={inputRef}
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </div>
                    <h2 className="font-bold text-xl md:text-2xl my-4">{authUser?.username}</h2>
                    <div className="flex flex-col md:flex-row gap-2 ">
                        <div className="flex flex-col items-center w-full p-4 ">
                            <div className="flex items-center gap-2 justify-center w-full mb-5">
                                <h2 className="font-bold text-xl"
                            onClick={togglePublished}
                            >Published Articles
                            
                            </h2>
                            <ArrowRight className={`${!publishedPlane?`hidden`:`block size-4`} md:hidden`} onClick={togglePublished}/>
                            <ArrowUp className={`${publishedPlane?`hidden`:`block size-4`} md:hidden`} onClick={togglePublished}/>
                            </div>
                            <div className={`${!publishedPlane?`block space-y-4`:`hidden`} md:block space-y-4`}>

                                {
                                    articles && 
                                    articles.map(article => {

                                       if(article.type==="published") return (<ArticleCard article={article} />)
                                    })
                                }

                            </div>
                        </div>
                        <div className="flex flex-col items-center w-full p-4 ">
                            <div className="flex items-center gap-2 justify-center w-full mb-5">
                                <h2 className="font-bold text-xl"
                            onClick={toggleDraft}
                            > Drafts
                            
                            </h2>
                            <ArrowRight className={`${!draftPlane?`hidden`:`block size-4`} md:hidden`} />
                            <ArrowUp className={`${draftPlane?`hidden`:`block size-4`} md:hidden`}/>
                            </div>
                            <div className={`${!draftPlane?`block space-y-4`:`hidden`} md:block space-y-4`}>
                                {
                                    articles && 
                                    articles.map(article => {

                                       if(article.type==="draft") return (<ArticleCard article={article} />)
                                    })
                                }

                            </div>
                        </div>
                    </div>
                    

                </div>
            </ReactModal>
        </div>
    )
}