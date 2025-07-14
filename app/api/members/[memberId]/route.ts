import { currentProfile } from "@/lib/current-profile";
import { prismaDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH (req: Request, {params : paramsPromise} : {params : Promise<{memberId: string}>}) {

    try {
        const params = await paramsPromise
        const profile = await currentProfile()
        const {searchParams} = new URL (req.url)
        const {role} = await req.json()
        
        // Todo: Untuk akses ke API ServerID '/api/servers/[serverId]'
        const serverId = searchParams.get('serverId')

        if(!profile){
            return new NextResponse('Unauthorized', {status: 400})
        }

        if(!serverId){
            return new NextResponse('Server ID is Missing', {status: 400})
        }
        
        if(!params.memberId){
            return new NextResponse('Member ID is missing' , {status: 400})
        }

        const server = await prismaDb.server.update({
            where :{
                id : serverId,
                profileId: profile.id  //Todo : Pemilik/pembuat server
            },
            data : {
                Member: {
                    update : {
                        where : {
                            id: params.memberId,
                            profileId : {
                                not : profile.id  //Todo: Pemilik/pembuat server tidak bisa rubah rolenya
                            }
                        },
                        data :{
                            role : role
                        }
                    }
                }
            },
            include : {
                Member : {
                    include : {
                        profile : true
                    },
                    orderBy : {
                        role : 'asc'
                    }
                }
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log('[MEMBER_ID_PATCH]', error);
        return new NextResponse('Internal Error' , {status: 500})
    }

}

export async function DELETE (req: Request, {params: paramsPromise} : {params : Promise<{memberId : string}>}) {


    try { 
        const profile = await currentProfile()
        const params = await paramsPromise
        const {searchParams} = new URL (req.url)

         // Todo: Untuk akses ke API ServerID '/api/servers/[serverId]'
        const serverId = searchParams.get('serverId')

        if(!profile){
            return new NextResponse('Unauthorized' , {status: 400})
        }

        if(!serverId) {
            return new NextResponse('Server ID is Missing' , {status : 400})
        }

        if(!params.memberId){
            return new NextResponse('Member Id is Missing', {status: 400})
        }

        const server = await prismaDb.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data : {
                Member: {
                    deleteMany : {
                        id: params.memberId,
                        profileId : {
                            not : profile.id  //Todo : Pemilik/pembuat Server tidak bisa kick profilenya sendiri dalam servernya
                        }
                    }
                }
            },
            include : {
                Member : {
                    include : {
                        profile : true
                    },
                    orderBy : {
                        role : 'asc'
                    }
                }
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log('[MEMBER ID _DELETE]', error);
        return new NextResponse('MemberID_DELETE ERROR', {status: 500})
        
    }

}