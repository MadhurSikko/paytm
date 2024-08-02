import { useNavigate } from "react-router-dom";

export const Appbar = ({name}) => {
    const navigate = useNavigate();
    return <div className="shadow h-14 flex justify-between">
        <div className="flex flex-col justify-center h-full ml-4">
            Payments App
        </div>
        <div className="flex">
            <div className="flex flex-col justify-center h-full mr-4">
                Hello
            </div>
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {name[0]}
                </div>
            </div>
            <div  className="flex">
                <button className="pointer underline pl-1 cursor-pointer" onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/signin");
                }}>LogOut</button>
            </div>
        </div>
    </div>
}