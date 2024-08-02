//const axios = require('axios');
import axios from "axios"
import { BottomWarning } from "../Components/BottomWarning"
import { Button } from "../Components/Button"
import { Heading } from "../Components/Heading"
import { InputBox } from "../Components/InputBox"
import { SubHeading } from "../Components/SubHeading"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export function Signin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credientials to access your account"} />
        <InputBox onChange={(e) => {setEmail(e.target.value)}} placeholder="youremail@gmail.com" label={"Email"} />
        <InputBox onChange={(e) => {setPassword(e.target.value)}} placeholder="123456" label={"Password"} />
        <div className="pt-4">
          <Button onClick={() => {
            axios.post("http://localhost:3000/api/v1/user/signin", {
              username: email,
              password: password,
            }, {
              headers: {

              },
            }).then((response) => {
              localStorage.setItem("token", response.data.token)
            }).catch((error) => {
              console.log(response.data.message);
              console.log("An error occured");
            })
            setTimeout(() => {
              navigate("/dashboard");
            }, 150)
            
          }} label={"Sign in"} />
        </div>
        <BottomWarning label={"Don't have an account?"} buttonText={"Sign Up"} to={"/signup"} />
      </div>
    </div>
  </div>
}