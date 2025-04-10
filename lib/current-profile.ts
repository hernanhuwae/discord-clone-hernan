import { auth } from "@clerk/nextjs/server"
import { prismaDb } from "./db"

export const currentProfile = async () =>{

    const {userId} = await auth()

    if(!userId){
        return null
    }

    const profile = await prismaDb.profile.findUnique({
        where:{
            userId
        }
    })

    return profile

}