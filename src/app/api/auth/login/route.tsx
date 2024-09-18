import { connect } from "@/app/utils/db/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import User from "../../../../../models/usedrModel";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    console.log("body===>", reqBody);

    const { email, password } = reqBody;

    // Find the user by email
    const user = await User.findOne({ email: email });
    console.log("user===>", user);

    // If user does not exist
    if (!user) {
      return NextResponse.json({ error: "User does not exist" }, { status: 400 });
    }

    // Check if the password is valid
    const validPassword = await bcryptjs.compare(password, user.password);
    console.log("validPassword===>", validPassword);

    if (!validPassword) {
      return NextResponse.json({ message: "Invalid Password" }, { status: 400 });
    }

    // Create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    console.log("token====>", tokenData);

    // Create the JWT token (make sure process.env.TOKEN_SECRET is set)
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" });

    // Set the token in a cookie
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
      token:token,
      data:tokenData
    });
    response.cookies.set("token", token,{
      httpOnly: true,
    
      maxAge: 24 * 60 * 60, // 1 day
      path: "/", // Cookie is accessible from the whole site
    });

    return response;
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error: "Server Side Error" }, { status: 500 });
  }
}
