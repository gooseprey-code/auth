import { Sun, Moon, Menu, X} from "lucide-react"
import { useState } from "react"
import ReactModal from "react-modal"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/AuthStore"
import { LogOut } from "lucide-react"
export default function Header () {
    const navigate = useNavigate()
    const [darkMode, setDarkMode] = useState(false)
    const [modal, setModal] = useState(false)
    const [showCategories, setShowCategories] =useState(false)
    const [mainModal, setMainModal] = useState(false)
    const toggleMainModal = () => {
        setMainModal(prev => !prev)
    }
    const toggleModal = () => {
        setModal(prev => !prev)
    }
    const toggleCategory = () => {
        setShowCategories (prev => !prev)
    }
    
    const { authUser, logout } = useAuthStore()

    const handleLogOut = async () => {
        const result = await logout()
        if (result.success) navigate("/")
        if (!result.success) navigate("/login")
    }
    return (
        <div className="w-full fixed z-1000 dark:bg-black dark:text-white bg-white flex justify-between items-center md:px-30 p-6 shadow-sm dark:shadow-stone-300">
            <div className="">
                <NavLink to="/"><h1 className="font-bold text-3xl hover:cursor-pointer">Akisss<span className="italic text-blue-800 dark:text-blue-500 font-normal">Blog</span></h1></NavLink>
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
                {authUser?.isVerified && <img src={authUser?.avatar || "avatar.png"} alt="User avatar" onClick={toggleMainModal} className="border-2 lg:block border-stone-500 dark:border-white rounded-full h-10 w-10" />}
                <button className="md:hidden" onClick={toggleModal}>
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
                    top: 84,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.40)'
                    },
                    content: {
                    position: 'absolute',
                    top: '0px',
                    left: '120px',
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
                <div className="px-6 pt-6">
                    {authUser && <img src={authUser?.avatar || "avatar.png"} alt="User avatar" onClick={toggleMainModal} className="border-2 border-stone-500 dark:border-white  mb-8 rounded-full h-10 w-10" />}
                    <nav className="flex flex-col justify-center gap-10 text-md font-semibold">
                        <ul className="">
                            <li><NavLink className={({isActive})=>
                                isActive? `text-blue-800`: `text-stone-900`
                            } to="/">Home</NavLink></li>
                        </ul>
                        <ul>
                            <li onClick={toggleCategory}>
                                Categories
                                
                            </li>
                            <nav className={`px-8 space-y-3 mt-2 ${showCategories?`block`:`hidden`}`}>
                                <ul>
                                    <li><NavLink to="">LifeStyle</NavLink></li>
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
                    top: 84,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.40)'
                    },
                    content: {
                    position: 'absolute',
                    top: '0px',
                    left: '74%',
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
                <div className="px-6 pt-6 flex flex-col items-center relative">
                    <LogOut onClick={()=>{
                        setMainModal(false)
                        handleLogOut()}}  className="absolute right-5 top-0"/>
                    <h5 className="">{authUser && authUser.firstName}</h5>
                    <h5 className="">{authUser && authUser.avatar}</h5>
                    <img src={authUser?.avatar || "avatar.png"} alt="User avatar" className="border-2 border-stone-500 dark:border-white rounded-full h-20 w-20" /> 
                </div>
            </ReactModal>
        </div>
    )
}