import {NextApiRequest} from 'next'
import {NextApiResponseServerIo} from '@/types'
import { currentProfileSocket } from '@/lib/current-profile-socket'
import { prismaDb } from '@/lib/db'

export default async function handler (req: NextApiRequest , res: NextApiResponseServerIo){
    if(req.method !== 'POST' ){
        return res.status(405).json({error: 'Method Not Allowed'})
    }

    try {
        const profile = await currentProfileSocket(req)
        const {content,fileUrl} = req.body
        const {serverId, channelId} = req.query

        if(!profile){
            return res.status(400).json({error : 'Unauthorized'})
        }

        if(!serverId){
            return res.status(400).json({error : 'SERVER ID IS NOT FOUND'})
        }

        if(!channelId){
            return res.status(400).json({error : 'CHANNEL ID IS NOT FOUND '})
        }

        if(!content){
            return res.status(400).json({error : 'CONTENT IS NOT FOUND'})
        }
        
        const server = await prismaDb.server.findFirst({
            where : {
                id : serverId as string,
                Member : {
                    some : {
                        profileId : profile.id
                    }
                }
            },
            include : {
                Member : true
            }
        })


        if(!server){
            return res.status(400).json({error : 'SERVER ID IS NOT FOUND'})
        }

        const channel = await prismaDb.channel.findFirst({
            where : {
                id: channelId as string,
                serverId : serverId as string
            }
        })


        if(!channel){
            return res.status(400).json({error : 'CHANNEL ID IS NOT FOUND'})
        }

        
        const member = server.Member.find((members)=> members.profileId === profile.id)

        if(!member){
            return res.status(400).json({error : 'MEMBER IS NOT FOUND'})
        }


        const message = await prismaDb.message.create({
            data : {
                content,
                fileUrl,
                channelId : channelId as string,
                memberId : member.id
            },
            include : {
                member : {
                    include : {
                        profile : true
                    }
                }
            }
        })

        const channelKey = `chat:${channelId}:message`

        res?.socket?.server?.io?.emit(channelKey, message)

        return res.status(200).json(message)

    } catch (error) {
        console.log('MESSAGE_POST', error);
        return res.status(500).json({message : 'INTERNAL_ERROR'})
    }
}
    