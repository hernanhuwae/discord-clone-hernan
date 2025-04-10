import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prismaDb } from "./db"


export const InitialProfile = async() =>{

    const user = await currentUser()

    if(!user){
        return redirect('/sign-in')
    }

    const profile = await prismaDb.profile.findUnique({
        where:{
            userId : user.id
        }
    })

    if(profile){
        return profile
    }

    const newProfile= await prismaDb.profile.create({
        data:{
            userId:user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.emailAddresses[0].emailAddress,
            imageUrl:user.imageUrl
        }
    })

    return newProfile
}