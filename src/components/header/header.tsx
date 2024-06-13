export default function Header({title} : {title: string}) {
    return (
        <div className="h-[10rem] bg-sky-900 flex justify-center items-center w-full mb-10">
            <h1 className="tracking-widest md:text-4xl text-3xl font-bold text-white border-b-2 pb-2 border-primaryYellow">{title}</h1>
        </div>
    )
};
