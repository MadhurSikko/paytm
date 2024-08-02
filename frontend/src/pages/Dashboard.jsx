import { useEffect, useState } from "react";
import { Appbar } from "../Components/Appbar";
import { Balance } from "../Components/Balance";
import { Users } from "../Components/Users";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

export function Dashboard() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [firstName, setFirstName] = useState("");
    const [balance, setBalance] = useState();
        
    useEffect(() => {

        axios.get("http://localhost:3000/api/v1/user/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(response => {
            setFirstName(response.data.firstName);
        })
        
        axios.get("http://localhost:3000/api/v1/account/balance", {
            headers : {
                Authorization: `Bearer ${token}`,
            }
        }).then((response) => {
            setBalance(response.data.balance);
        })
    }, [token])

    return (
        <div>
            <Appbar name={firstName}/>
            <Balance value={balance}/>
            <Users />
        </div>
    )
}