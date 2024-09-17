import User from "../../../models/usedrModel";
import { connect } from "../utils/db/dbconfig";




export async function getProducts(): Promise<any> {

    await connect()
    return User.find({})


}