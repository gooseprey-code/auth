import Card from "../Components/Card";
import Carousel from "../Components/Carousel";

export default function UserDashboardPage () {
    return (
        <div className="overflow-x-hidden w-full dark:bg-black bg-white pb-15 flex flex-col justify-center items-center">
            <div className="w-full">
                <Carousel />
            </div>
            <div className="px-4 mt-25 f00lex justify-center items-center">
                <Card />
            </div>
            
        </div>
    )
}