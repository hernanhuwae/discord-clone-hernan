import { getAuth } from "@clerk/nextjs/server"
import { prismaDb } from "./db"
import { NextApiRequest } from "next"

export const currentProfileSocket = async (req:NextApiRequest) =>{

    const {userId} = getAuth(req)

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