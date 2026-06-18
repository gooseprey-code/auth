import { NavLink } from "react-router-dom";

export default function Footer () {
    return (
        <div className="flex flex-col justify-center items-center dark:text-white  dark:bg-stone-950 bg-stone-300 py-6 w-full mt-auto">
            <div className="flex flex-col justify-center items-center gap-1 mb-5">
                <h1 className="font-bold text-3xl">Akisss<span className="italic text-blue-800  dark:text-blue-500 font-normal">Blog</span></h1>
                <p className="text-md font-semibold dark:text-stone-400 text-stone-600">Everything Akisss and Fun</p>
            </div>
            <div className="flex justify-between gap-2 mb-4">
                <NavLink className="text-sm shadow-sm">Privacy Policy</NavLink>
                <NavLink className="text-sm shadow-sm">Terms of Use</NavLink>
                <NavLink className="text-sm shadow-sm">Campus Guide</NavLink>
                <NavLink className="text-sm shadow-sm">Help</NavLink>
            </div>
            <div>
                <NavLink>Become an author</NavLink>
            </div>
        </div>
    )
}