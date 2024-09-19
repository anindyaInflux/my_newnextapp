import User from "../../../models/usedrModel";
import dbConnect  from "../utils/db/dbconfig";




// export async function getUser(): Promise<any> {
//     try {
//       await dbConnect();
//       const users = await User.find({});
//       return users;
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       throw new Error('Database query failed');
//     }
//   }


export async function getUser(page: number = 1, limit: number = 5): Promise<any> {
    try {
      await dbConnect();
      
      // Calculate the skip value (for MongoDB, or whichever DB you're using)
      const skip = (page - 1) * limit;
  
      // Fetch the paginated users
      const users = await User.find({})
        .skip(skip)  // Skip the documents before the current page
        .limit(limit) // Limit the number of results per page
        .exec(); // Execute the query
  
      // Get the total number of users (for calculating total pages)
      const totalUsers = await User.countDocuments({});
  
      return {
        users,
        totalUsers, // Total count for frontend to know the total pages
        totalPages: Math.ceil(totalUsers / limit), // Total pages for the frontend
        currentPage: page, // Current page for frontend tracking
      };
    } catch (error) {
      console.error('Error fetching users with pagination:', error);
      throw new Error('Database query failed');
    }
  }
  


  export async function getUserById(id: string): Promise<any | null> {
    
    try {
        await dbConnect();
        const users = await  User.findById(id).lean()
        return users;
      } catch (error:any) {
        console.error('Error fetching users:', error);
        throw new Error('Database query failed');
      }
  }



export async function updateUser(id: string, userData: any): Promise<any | null> {
  try {
    await dbConnect(); // Ensure database connection
    console.log(`Updating user with id: ${id}`, userData); // Log data to help with debugging

    const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true, runValidators: true }).lean();

    if (!updatedUser) {
      console.log('User not found for id:', id);
      return null;
    }

    console.log('User updated successfully:', updatedUser);
    return updatedUser;
  } catch (error: any) {
    console.error('Error updating user:', error.message);
    throw new Error('Database query failed');
  }
}