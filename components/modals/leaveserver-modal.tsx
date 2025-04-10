"use client";

 
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { useModalStores } from "@/hooks/use-modal";
import { Button } from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";


export const LeaverServerModal = () => {

  const [isLoading, setIsLoading] = useState(false)
  const {isOpen, onClose ,type, data} = useModalStores()
  const {server} = data
  const isModalOpen = isOpen && type === "leaveServer"
  const router = useRouter()

  const onClick = async () => {

    try {

      setIsLoading(true)
      await axios.patch(`/api/servers/${server?.id}/leave`)
      onClose()
      router.refresh()
      router.push('/')

    } catch (error) {
      console.log(error);
      
    }

  }

  
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-5">
          <DialogTitle className="text-2xl text-center font-bold">
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure to leave <span className="text-red-500 font-semibold">{server?.name}</span> Server?
          </DialogDescription>
        </DialogHeader>
          <DialogFooter className="bg-gray-100 px-6 py-4">
              <div className="flex items-center justify-between w-full">
                  <Button disabled={isLoading} onClick={onClose} variant='ghost'>
                    Cancel
                  </Button>
                  <Button disabled={isLoading} onClick={onClick} variant='destructive'>
                    Confirm
                  </Button>
              </div>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


