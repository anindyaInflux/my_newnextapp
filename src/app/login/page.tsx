"use client";

import axios from 'axios'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function login() {
        const router = useRouter();
        const [user,setUser] =useState({email:"",password:""})
        const [error,setError] = useState("")
        const [loading, setLoading] = useState(false)
        const[buttonDisabled,setButtonDisabled] = useState(false)


        const handleLogin = async ()=>{
            try {
                setLoading(true)
                setError("")

                const response = await axios.post("/api/auth/login",user)
                console.log("responce==>",response.data);
                toast.success("Login success");
                router.push("/usertable")
            }  catch (error: any) {
                console.log("Login failed", error.message);
          
                // Show error toast
                toast.error("Login failed: " + error.message);
            }finally{
                setLoading(false)
            }
        }


        useEffect(() => {
            if(user.email.length > 0 && user.password.length > 0) {
                setButtonDisabled(false);
            } else{
                setButtonDisabled(true);
            }
        }, [user]);


  return (
    <div>
  <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1>{loading ? "Processing" : "Login"}</h1>
        <hr />
        
        <label htmlFor="email">email</label>
        <input 
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            id="email"
            type="text"
            value={user.email}
            onChange={(e) => setUser({...user, email: e.target.value})}
            placeholder="email"
            />
        <label htmlFor="password">password</label>
        <input 
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({...user, password: e.target.value})}
            placeholder="password"
            />
            <button
            onClick={handleLogin}
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600">Login here</button>
            <Link href="/signup"> Signup page</Link>
        </div>


        </div>
  )
}
