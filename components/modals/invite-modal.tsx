"use client";

 
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { useModalStores } from "@/hooks/use-modal";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCcw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import axios from "axios";


export const InviteModal = () => {

  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const {onOpen,isOpen, onClose ,type, data} = useModalStores()
  const {server} = data
  const origin = useOrigin()

  //Todo: buat direct ke halaman (invite) setelah buat API update invitecode
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`

  const isModalOpen = isOpen && type === "invite"

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)

    setTimeout(()=>{ 
      setCopied(false)
    },1000)
  }

  const onNewToken = async () => {
    try {
      setIsLoading(true)
      const response = await axios.patch(`/api/servers/${server?.id}/invitecode`)
      
      onOpen('invite' , {server: response.data})

      console.log(response.data);
    } catch (error) {
        console.log(error);
        
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-5">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Your Friends
          </DialogTitle>
        </DialogHeader>
          <div className="p-5">
            <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
              Server Invite Link
            </Label>
            <div className="flex items-center mt-2  gap-x-2 ">
              <Input disabled={isLoading} onChange={()=> {}} value={inviteUrl} className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black"  />
              <Button disabled={isLoading} onClick={onCopy} size="icon">
                {copied ? <Check className="w-3 h-3"/> : <Copy className="w-3 h-3"/>}
              </Button>
            </div>

            <Button onClick={onNewToken} disabled={isLoading} variant='link' size='sm' className='text-xs text-zinc-500 mt-4' >
              Generate a new link
              <RefreshCcw className="w-3 h-3 ml-2"/>
            </Button>
          </div>
      </DialogContent>
    </Dialog>
  );
};


