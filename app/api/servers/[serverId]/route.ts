import { currentProfile } from "@/lib/current-profile";
import { prismaDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH (req:Request, {params: paramsPromise} : {params: Promise<{serverId: string}>}) {

    const params = await paramsPromise
    const {name, imageUrl} = await req.json()

    try {

        const profile = await currentProfile()

        if(!profile){
            return new NextResponse('Unauthorized', {status: 400})
        }

        const server = await prismaDb.server.update({
            where : {
                id: params.serverId,
                profileId: profile.id
            },
            data : {
                name,
                imageUrl
            }
        })

        return NextResponse.json(server)
        
    } catch (error) {
        console.log('[SERVER_ID_PATCH]', error);
        return new NextResponse('[Error SERVER_ID_PATCH]', {status: 500})
    }

}

export async function DELETE (_req: Request, {params : paramsPromise} : {params : Promise<{serverId : string}>}){

    try {

        const profile = await currentProfile()
        const params = await paramsPromise

        if(!profile){
            return new NextResponse('Unauthorized' , {status:400})
        }

        if(!params.serverId){
            return new NextResponse('Server ID Is Missing' , {status:400})
        }

        const server = await prismaDb.server.delete({
            where : {
                id : params.serverId,
                profileId: profile.id
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log('SERVER_DELETE', error)
        return new NextResponse('[SERVER_DELETE_ERROR]', {status:500})
    }

}