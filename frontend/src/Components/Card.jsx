import { NavLink } from "react-router-dom";

export default function Card () {
    return(
        <div className=" max-w-lg dark:shadow-md rounded-xl px-4 md:px-8 flex flex-col pb-5 gap-3 justify-center bg-gray-200 shadow-xl shadow-stone-600/60">
            <img src="/26.jpg" className="rounded-xl shadow-xl -mt-10"/>
            <NavLink className="bg-red-400 px-2 rounded-3xl text-white font-medium text-sm mr-auto">lifestyle</NavLink>
            <NavLink className="text-xl font-bold">Get the most out of iceland with our 10 travel tips</NavLink>
            <p>Lorem ipsum dolor sit amet deserunt aperiam in. Provident voluptates ipsum quia pariatur blanditiis.</p>
            <div className="flex space-x-3">
                <NavLink className="flex space-x-3">
                    <img src="/1.jpg" className="w-8 h-8 rounded-full"/>
                    <p className="font-bold">David Smith</p>
                </NavLink>
                <p>February 23, 1995</p>
            </div>
        </div>
    )
}