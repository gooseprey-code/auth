import { NavLink } from "react-router-dom";

const Article = {
    name: "my data is always finished which have to eventually buy more unless i can steal from the telcos",
    imageURL: "/2.jpg",
    content: "Lorem iditiboriosam quaepellendus debitis et unde magni recusandae illum iste nemo quia tempore quaerat architecto id ullam earum, enim maiores, quidem fugiat. Quasi, voluptates officia! Blanditiis voluptate omnis id laboriosam et distinctio pariatur perferendis, quisquam corporis ullam, quae magni sed nostrum nulla aliquid ea dolorem. Sunt, velit possimus? Numquam doloremque quibusdam recusandae aperiam tenetur quidem nesciunt est hic quia ut. Eaque soluta, dolore minima et debitis voluptatibus cum fugiat tempore nemo quis asperiores temporibus delectus libero at magnam veniam sint! Repellat placeat optio labore, amet quod incidunt sapiente molestiae doloremque eligendi praesentium similique explicabo cumque doloribus. Necessitatibus illum quos alias vero veritatis rerum amet veniam facere, suscipit dolorum reiciendis facilis maiores architecto consequuntur, qui adipisci neque totam consectetur culpa tenetur vitae magnam? Eveniet, odio culpa eius ipsam quae temporibus officia harum explicabo minima? Voluptatibus possimus id, laboriosam, ea excepturi inventore iure fuga illum iusto eligendi modi consequuntur architecto incidunt eum fugiat. Nisi fugiat facilis aliquid nobis. Distinctio voluptate dolor, recusandae quis adipisci, beatae soluta provident reprehenderit a repudiandae, itaque possimus at ipsum unde nam voluptatem qui quisquam tempore temporibus sed ea quibusdam vel aspernatur accusamus. Officiis consectetur temporibus odit cumque sapiente corporis placeat incidunt obcaecati dolorum nobis laudantium praesentium architecto exercitationem maiores dicta ipsa ex labore dolore, enim earum distinctio nemo. Eaque nam, mollitia sunt, maiores libero molestias quia earum corrupti itaque in alias quam beatae minus laborum voluptates debitis. Similique pariatur reiciendis ad amet voluptatibus quasi dignissimos rem inventore nam eum! Neque illo hic rem in cum sapiente voluptas distinctio, mollitia commodi, eos suscipit perspiciatis magnam dicta voluptate quae tempora, velit nam inventore impedit necessitatibus molestias consectetur voluptatem sint amet? Inventore dolorem alias, dolorum numquam, laborum earum magni voluptatibus deserunt sunt soluta, voluptates provident. Explicabo, libero modi? Adipisci modi ab non, quaerat recusandae nobis unde sunt similique tenetur ducimus sint atque vitae iste ea magni quasi saepe nemo? Dolor, natus laborum. Hic ad aperiam ipsum architecto unde placeat labore, corporis odit odio quibusdam accusantium sunt doloribus amet et facilis. Ut suscipit, voluptates debitis hic delectus earum cumque vitae, assumenda aliquam quaerat quibusdam laudantium est exercitationem rem? Dolores libero corrupti est dolorem officiis consequatur eligendi, praesentium inventore sunt consectetur placeat nisi explicabo aspernatur. Nisi, id. Et, a quia reprehenderit harum minima laborum. Nihil, corrupti provident possimus similique natus vero dolorem fugit veritatis quam odio quis error pariatur porro voluptate minus facere. Quos quod cum nam. Non ab, dolores necessitatibus assumenda eaque asperiores dignissimos. Id numquam nisi doloremque quos at quo asperiores aperiam! Quam itaque delectus molestiae quo quasi perferendis fugit ratione. Ipsum aliquam, consequatur modi debitis molestias architecto facere assumenda sunt tempora, nisi minus hic quaerat magni provident fugit earum quasi blanditiis cumque. Modi illo quos placeat esse, nesciunt a dignissimos magnam eius eos quibusdam reiciendis cumque sunt quisquam incidunt itaque. Eaque voluptatibus reprehenderit eligendi inventore reiciendis exercitationem iste quos ad nemo fugiat deleniti iusto in, deserunt voluptatem vitae modi ratione quibusdam dolorem esse commodi officia consequuntur officiis odio a? Ipsa autem fuga consequatur quos incidunt nam quo porro laboriosam consequuntur ab aliquam eaque ducimus nisi suscipit ullam nobis enim alias minima rem quam, doloremque dolore obcaecati! Ab.",
    author: "Marking Table",
    date: "Feb 20, 2025",
    views: 23
}

export default function ArticlesPage () {
    return (
        <div className="flex flex-col items-center gap-4 md:gap-6 px-3 py-5 md:py-8 md:px-10">
            <NavLink className="text-blue-400" to=""># {"Category"}</NavLink>
            <h1 className="max-w-[75vw] md:max-w-[70vw] text-center capitalize font-bold text-xl md:text-2xl">{Article.name}</h1>
            <img className=" w-full h-[40vh] rounded-xl " src="/5.jpg" alt="Aticle main image"/>
            <p className="w-[80vw]">{Article.content}</p>
            <div className="flex w-full px-15">
                <div className="ml-auto flex gap-2 items-center justify-center">
                    <img className="size-15 rounded-full" src={`/5.jpg`} alt="author avatar" />
                    <div className="flex flex-col justify-center">
                        <h2>{Article.author}</h2>
                        <div className="flex gap-2 items-center">
                            <p>{Article.date}</p>
                            <small className="size-1 rounded-full bg-stone-900"></small>
                            <p>{Article.views} views</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}