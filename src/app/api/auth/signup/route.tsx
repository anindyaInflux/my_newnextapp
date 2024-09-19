import { NextRequest, NextResponse } from "next/server";
// import { connect } from "../../../db/dbconfig";
import User from "../../../../../models/usedrModel";
import bcryptjs from "bcryptjs";
import { getUser, getUserById, updateUser } from "@/app/utils/users";
import dbConnect from "../../../utils/db/dbconfig";



dbConnect()

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






// export async function GET(request:NextRequest){
//     console.log("requesr",request);
    
//     try {

//         const Userdata= await getUser()

//         console.log("userData===>",Userdata);

//         return NextResponse.json({
//             status:200,
//             message:"Get All Users",
//             success:true,
//             data:Userdata})
        
//     } catch (error:any) {

//         return NextResponse.json({error:"server Side Error"},{status:500})
        
//     }


// }




// export async function GET(request: NextRequest) {
//   try {
//     console.log('Received request:', request.url);
    
//     const Userdata = await getUser();
//     console.log('Fetched user data:', Userdata);

//     return NextResponse.json({
//       status: 200,
//       message: 'Get All Users',
//       success: true,
//       data: Userdata,
//     });
//   } catch (error: any) {
//     console.error('Server error:', error.message);
    
//     return NextResponse.json({ error: 'Server Side Error' }, { status: 500 });
//   }
// }




// export async function GET(request: NextRequest, { params }: { params: { id?: string } }) { // Make id optional
//     console.log(params,"params");
  
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get('id'); // Get the 'id' query parameter
//     console.log(id,"id")
//     // if(id !== undefined){
//     // const { id } = params; 
  
//     if (id) {
//       // Get a single product by ID
//       const product = await getUserById(id);
//       if (!product) {
//         return NextResponse.json({ error: 'Product not found' }, { status: 404 });
//       }
//       return NextResponse.json(product);
//     }
// }




// export async function GET(request: NextRequest) {
//   try {
//     console.log('Received request:', request.url);

//     // Parse the query parameters
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get('id'); // Get the 'id' query parameter if it exists

//     if (id) {
//       // If 'id' is present, fetch the user by ID
//       console.log(`Fetching user with id: ${id}`);
//       const user = await getUserById(id);

//       if (!user) {
//         return NextResponse.json({ error: 'User not found' }, { status: 404 });
//       }

//       return NextResponse.json({
//         status: 200,
//         message: 'User found',
//         success: true,
//         data: user,
//       });
//     } else {
//       // If 'id' is not present, fetch all users
//       console.log('Fetching all users');
//       const Userdata = await getUser();

//       return NextResponse.json({
//         status: 200,
//         message: 'Get All Users',
//         success: true,
//         data: Userdata,
//       });
//     }
//   } catch (error: any) {
//     console.error('Server error:', error.message);
//     return NextResponse.json({ error: 'Server Side Error' }, { status: 500 });
//   }
// }






export async function GET(request: NextRequest) {
  try {
    console.log('Received request:', request.url);

    // Parse the query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); // Get the 'id' query parameter if it exists
    const page = parseInt(searchParams.get('_page') || '1'); // Get the current page
    const limit = parseInt(searchParams.get('_limit') || '5'); // Get the limit per page

    if (id) {
      // If 'id' is present, fetch the user by ID
      console.log(`Fetching user with id: ${id}`);
      const user = await getUserById(id);

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({
        status: 200,
        message: 'User found',
        success: true,
        data: user,
      });
    } else {
      // If 'id' is not present, fetch all users with pagination
      console.log('Fetching all users with pagination');
      const userData = await getUser(page, limit); // Pass page and limit to getUser

      return NextResponse.json({
        status: 200,
        message: 'Get All Users',
        success: true,
        data: userData.users, // Paginated user data
        totalPages: userData.totalPages, // Total pages for frontend to know
        currentPage: userData.currentPage, // Current page
      });
    }
  } catch (error: any) {
    console.error('Server error:', error.message);
    return NextResponse.json({ error: 'Server Side Error' }, { status: 500 });
  }
}



export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); // Get the 'id' query parameter
    console.log(id, "id");
  
    if (!id) {
      return NextResponse.json({ error: 'Missing User ID' }, { status: 400 });
    }
  
    try {
      const userData = await request.json(); // Parse the request body
      console.log('Request data:', userData);
  
      const updatedUser = await updateUser(id, userData);
  
      if (!updatedUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
  
      return NextResponse.json({
        status: 200,
        message: 'User Updated Successfully',
        success: true,
        data: updatedUser,
      });
    } catch (error: any) {
      console.error('Error updating user:', error.message);
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
  }