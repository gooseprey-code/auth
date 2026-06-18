import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom";
import {ArrowBigLeft, ArrowBigRight, ArrowBigRightDash} from "lucide-react"

const carouselImg = [
    {imgUrl: "/1.jpg"},
    {imgUrl: "/2.jpg"},
    {imgUrl: "/5.jpg"},
    {imgUrl: "/9.jpg"},
]
export default function Carousel () {
    const [carousel, setCarousel] = useState(0)

    useEffect (()=> { 
    const interval = setInterval(() => {
        setCarousel(prev => (prev + 1) % carouselImg.length)
        }, 2000);
        return () => clearInterval(interval)
    },[setCarousel, carouselImg.length])
    return (
        <div>
            <div 
                key={carousel}
                style={{
                  backgroundImage: `url(${carouselImg[carousel].imgUrl})`
                }}
                className="bg-cover bg-center dark:shadow-sm dark:shadow-stone-300 relative z-0 min-h-160 w-full flex flex-col justify-center items-center gap-8"
            >
                <div className="absolute inset-0 bg-black/50"></div>
                <NavLink className="bg-red-400 px-3 py-0.5 rounded-xl text-white font-medium text-md z-10">food</NavLink>
                <NavLink className="text-2xl md:text-3xl lg:text-4xl font-bold text-center max-w-2xl lg:max-w-3xl xl:max-w-4xl  text-white capitalize leading-normal z-10">Get the most out of iceland with our 10 travel tips</NavLink>
                <div className="flex  items-center justify-center space-x-3 text-white z-10">
                    <NavLink className="flex justify-center items-center space-x-3">
                        <img src="/1.jpg" className="w-10 h-10 rounded-full"/>
                        <p className="font-bold">David Smith</p>
                    </NavLink>
                    <p>February 23, 1995</p>
                </div>
                <div className="z-10 flex gap-3 absolute bottom-20 ">
                    <button onClick={()=> setCarousel(0)} className={`w-3 h-3 cursor-pointer bg-none border border-white ${carousel===0 && `bg-white`}`} />
                    <button onClick={()=> setCarousel(1)} className={`w-3 h-3 cursor-pointer bg-none border border-white ${carousel===1 && `bg-white`}`} />
                    <button onClick={()=> setCarousel(2)} className={`w-3 h-3 cursor-pointer bg-none border border-white ${carousel===2 && `bg-white`}`} />
                    <button onClick={()=> setCarousel(3)} className={`w-3 h-3 cursor-pointer bg-none border border-white ${carousel===3 && `bg-white`}`} />                
                </div>
                <button className="absolute left-10 border rounded-full p-2 opacity-80 border-white hidden md:block der-disabled:opacity-30" onClick={()=>{setCarousel(prev=> (prev-1))}} disabled={carousel === 0}>
                    <ArrowBigLeft className="text-white size-6 opacity-80" />
                </button>
                <button className="absolute right-10 border rounded-full p-2 opacity-80 border-white hidden md:block disabled:opacity-30" onClick={()=>{setCarousel(prev=> (prev+1))}} disabled={carousel === 3}>
                    <ArrowBigRight className="text-white size-6 opacity-80" />
                </button>
            </div>
        </div>
    )
}