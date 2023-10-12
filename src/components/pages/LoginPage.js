
import React, { useState } from "react"
import { Link } from 'react-router-dom'

import '../../App.css'
import BackgroundImage from '../../assets/images/bg.png'
import urlContext from '../URLContext'
import axios from 'axios';

import { Redirect } from 'react-router-dom';


export default function SignInPage() {

    const [formData, setFormData] = useState({ name: "", password: "" });
    const [msg, setMsg] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const baseURL = React.useContext(urlContext);

    function checkIfEmail(str) {
        // Regular expression to check if string is email
        const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;

        return regexExp.test(str);
    }

    const handleSubmit = async (event) => {

        event.preventDefault();  //Stop reloading   

        var logInfo = "";
        if (checkIfEmail(formData.name)) {
            logInfo = "loginEmail=" + formData.name + "&loginPassWord=" + formData.password;
        }
        else
            logInfo = "loginName=" + formData.name + "&loginPassWord=" + formData.password;


        let config = {
            method: 'post',
            url: `${baseURL}/api/scanner/login?` + logInfo,
            // headers: {
            //     'Content-Type': 'application/json',
            //     'Authorization': 'Bearer ' + accessToken
            // },
            // data: data
        };

        await axios(config)
            .then((response) => {

                if (response.status === 200) {
                    setIsLoggedIn(true);
                    let accessToken = response.data.token;
                    if (accessToken) {
                        localStorage.setItem('accessToken', accessToken)
                        //console.log("XXXXX  ", accessToken);
                    }
                    else {
                        localStorage.removeItem('accessToken');
                    }
                }
                else {
                    setMsg("Invalid UserName or Password");
                    localStorage.removeItem('accessToken');
                }
            })
            .catch((error) => {
                console.log(error);
                setMsg("Invalid UserName or Password");
                localStorage.removeItem('accessToken');
            });


    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    if (isLoggedIn) {
        // Redirect to dashboard if isLoggedIn is true
        return <Redirect to="/home" />;
    }

    return (
        <header style={HeaderStyle}>
            <div className="text-center ">
                <div style={{ height: 100 }}></div>
                <h2>Sign in to us</h2>
                <form onSubmit={handleSubmit}>

                    <p>
                        <label>Username or email address</label><br />
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
                    </p>
                    <p>
                        <label>Password</label>
                        {/* <Link to="/forget-password"><label className="right-label">Forget password?</label></Link>  */}
                        <br />
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
                    </p>

                    <p>
                        <button id="sub_btn" type="submit" >Login</button>
                    </p>
                    <div>
                        <h6 style={{ color: 'red' }}>{msg}</h6>
                    </div>

                </form>
                <footer>
                    {/* <p>First time? <Link to="/register">Create an account</Link>.</p> */}
                    <p><Link to="/">Back to Homepage</Link>.</p>
                </footer>
            </div>

        </header>
    )
}
const HeaderStyle = {
    width: "100%",
    height: "100vh",
    background: `url(${BackgroundImage})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover"
}
