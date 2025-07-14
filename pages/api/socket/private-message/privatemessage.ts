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
        const {conversationId} = req.query

        if(!profile){
            return res.status(400).json({error : 'Unauthorized'})
        }

        if(!content){
            return res.status(400).json({error : 'CONTENT IS NOT FOUND'})
        }
        
        const conversation = await prismaDb.conversation.findFirst({
            where : {
                id : conversationId as string,
                OR : [
                    {
                        memberOne : {
                            profileId : profile.id
                        },     
                    },
                    {
                        memberTwo : {
                            profileId : profile.id
                        }
                    }

                ]
            },
            include : {
                memberOne : {
                    include : {
                        profile : true
                    }
                },
                memberTwo : {
                    include : {
                        profile: true
                    }
                }
            }
        })

        if(!conversation){
            return res.status(400).json({error : 'CONVERSATION ID IS NOT FOUND'})
        }
        
        const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo

        if(!member){
            return res.status(400).json({error : 'MEMBER IS NOT FOUND'})
        }


        const message = await prismaDb.privateMessage.create({
            data : {
                content,
                fileUrl,
                conversationId : conversationId as string,
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

        const channelKey = `chat:${conversationId}:messages`

        res?.socket?.server?.io?.emit(channelKey,message)

        return res.status(200).json(message)

    } catch (error) {
        console.log('PRIVATE_MESSAGE_POST', error);
        return res.status(500).json({message : 'INTERNAL_ERROR'})
    }
}
    