import { currentProfile } from "@/lib/current-profile"
import { prismaDb } from "@/lib/db"
import { MemberRole } from "@prisma/client"
import { NextResponse } from "next/server"

export async function DELETE (req: Request, {params : paramsPromise} : {params : Promise<{channelId : string}>}){

    try {

        const profile = await currentProfile()
        const params = await paramsPromise
        
        const {searchParams} = new URL(req.url)
        const serverId = searchParams.get('serverId')

        if(!profile){
            return new NextResponse('Unauthorized' , {status:400})
        }

        if(!serverId){
            return new NextResponse('Server ID Is Missing' , {status:400})
        }


        if(!params.channelId){
            return new NextResponse('Channel ID Is Missing' , {status:400})
        }

        const server = await prismaDb.server.update({
            where : {
                id : serverId,
                Member : {
                    some : {
                        profileId: profile.id,
                        role : {
                            in : [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data : {
                Channel : {
                    delete : {
                        id: params.channelId, 
                        name : {
                            not : 'general'
                        }
                    }
                }
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log('CHANNEL_ID_DELETE', error)
        return new NextResponse('[CHANNEL_ID_DELETE_ERROR]', {status:500})
    }

}


export async function PATCH (req: Request, {params : paramsPromise} : {params : Promise<{channelId : string}>}){

    try {

        const profile = await currentProfile()
        const params = await paramsPromise
        const {name,type} = await req.json()
        
        const {searchParams} = new URL(req.url)
        const serverId = searchParams.get('serverId')

        if(!profile){
            return new NextResponse('Unauthorized' , {status:400})
        }

        if(!serverId){
            return new NextResponse('Server ID Is Missing' , {status:400})
        }


        if(!params.channelId){
            return new NextResponse('Channel ID Is Missing' , {status:400})
        }

        if(name === 'general'){
            return new NextResponse('Name can`t be General ', {status:400})
        }

        const server = await prismaDb.server.update({
            where : {
                id : serverId,
                Member : {
                    some : {
                        profileId: profile.id,
                        role : {
                            in : [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data : {
                Channel : {
                    update : {
                        where : {
                            id: params.channelId,
                            NOT: {
                                name : 'general'
                            },
                        },
                        data:{
                            name,type
                        }
                    }
                }
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log('CHANNEL_ID_UPDATE', error)
        return new NextResponse('[CHANNEL_ID_UPDATE_ERROR]', {status:500})
    }

}



