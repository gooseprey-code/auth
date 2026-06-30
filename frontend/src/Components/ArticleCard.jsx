import { Delete, Edit, Trash } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function ArticleCard ({article}) {
    return (
        <div className="border rounded-xl px-3 py-2">
            <div className="flex justify-between">
                <h2 className="text-lg md-xl font-bold text-blue-500">{article?.name}</h2>
                <div className="flex gap-2 items-center">
                    <Trash className="size-4 cursor-pointer hover:fill-gray-600"/>
                    <Edit className={`size-4 cursor-pointer ${article.type === "published" && `hidden`} hover:fill-gray-600`}/>
                </div>
            </div>
            <p className="text-sm md:text-md">{article.intro} ...<span><NavLink className="font-bold">read more</NavLink></span></p>
        </div>
    )
}