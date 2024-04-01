import React, { useState } from 'react'
import './CSS/LoginSignup.css'


const LoginSignup = () => {
    const [state, setState] = useState("Login")
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({ ...formData, [name]: value })
    }

    const login = async () => {
        const res = await fetch("http://localhost:4000/login", {
            method: "POST",
            headers: {
                Accept: "application/form-data",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        const data = await res.json()

        if (data.success) {
            localStorage.setItem('auth-token', data.token)
            window.location.replace("/")
        }
        else {
            alert(data.errors)
        }
    }

    const signup = async () => {
        const res = await fetch("http://localhost:4000/signup", {
            method: "POST",
            headers: {
                Accept: "application/form-data",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        const data = await res.json()

        if (data.success) {
            console.log(data.token)
            localStorage.setItem('auth-token', data.token)
            window.location.replace("/")
        }
        else {
            alert(data.errors)
        }
    }

    return (
        <div className='loginsignup'>
            <div className="loginsignup-container">
                <h1>{state}</h1>
                <div className="loginsignup-fields">
                    {state === "Sign Up" ? <input type="text" placeholder='Your Name' name='name' value={formData.name} onChange={handleChange} /> : <></>}
                    <input type="email" placeholder='Email Address' name='email' value={formData.email} onChange={handleChange} />
                    <input type="password" placeholder='Password' name='password' value={formData.password} onChange={handleChange} />
                </div>
                <button onClick={() => { state === "Login" ? login() : signup() }}>Continue</button>
                {
                    state === "Sign Up" ? <p className='loginsignup-login'>Already have an account? <span onClick={() => { setState("Login") }}>Login Here</span></p>
                        : <p className='loginsignup-login'>Create an account? <span onClick={() => { setState("Sign Up") }}>Click Here</span></p>
                }
                <div className="loginsignup-agree">
                    <input type="checkbox" name='' id='' />
                    <p>By continuing, I agree to use the terms of use & privacy policy.</p>
                </div>
            </div>
        </div>
    )
}

export default LoginSignup