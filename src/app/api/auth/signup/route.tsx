import { NextRequest, NextResponse } from "next/server";
// import { connect } from "../../../db/dbconfig";
import User from "../../../../../models/usedrModel";
import bcryptjs from "bcryptjs";
import { getProducts } from "@/app/utils/users";
import { connect } from "../../../utils/db/dbconfig";



connect()

export async function POST(request:NextRequest){
    console.log("request",request);
    

    try {

        const reqBody = await request.json();
        const{username,email,password}=reqBody

        console.log("body===>",reqBody);

        // const user =User.findOne({email})

        // if(user) return NextResponse.json({error:"User already exists"},{status:400})

            const salt = await bcryptjs.genSalt(10)

            const hashedPassword = await bcryptjs.hash(password, salt)

            const newUser = new User({username,email,password:hashedPassword})

            const seveUser =await newUser.save()
            console.log("saveUser===>",seveUser);

            return NextResponse.json({
                status:201,
                message: "User created successfully",
                success: true,
                data:seveUser
            })
            
        
        
    } catch (error:any) {

        return NextResponse.json({error:"server Side Error"},{status:500})


        
    }
}






export async function GET(request:NextRequest){
    console.log("requesr",request);
    
    try {

        const Userdata= await getProducts()

        console.log("userData===>",Userdata);

        return NextResponse.json({
            status:200,
            message:"Get All Users",
            success:true,
            data:Userdata})
        
    } catch (error:any) {

        return NextResponse.json({error:"server Side Error"},{status:500})
        
    }


}