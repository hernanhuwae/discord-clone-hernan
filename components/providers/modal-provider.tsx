'use client'

import { useEffect, useState } from "react"
import { CreateServerModals } from "../modals/createserver-modal"
import { InviteModal } from "../modals/invite-modal"
import { EditServerModals } from "../modals/editserver-modal"
import { MembersModal } from "../modals/member-modal"
import { CreateChannelModals } from "../modals/createChannel-modal"
import { LeaverServerModal } from "../modals/leaveserver-modal"
import { DeleteServerModal } from "../modals/deleteServer-modal"
import { DeleteChannelModal } from "../modals/deleteChannel-modal"
import { EditChannelModals } from "../modals/editChannel-modal"
import { MessageFileModal } from "../modals/message-file-modal"
import { DeleteMessageModal } from "../modals/deleteMessage-modal"

export const ModalProvider = ()=> {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(()=>{  
        setIsMounted(true)
    },[])

    if(!isMounted){
        return null
    }

    return (
        <>
            <CreateServerModals/>
            <InviteModal/>
            <EditServerModals/>
            <MembersModal/>
            <CreateChannelModals/>
            <LeaverServerModal/>
            <DeleteServerModal/>
            <DeleteChannelModal/>
            <EditChannelModals/>
            <MessageFileModal/>
            <DeleteMessageModal/>
        </>
    )
}