"use client";

import qs from 'query-string'
import { ServerWithMemberWithProfile } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { useModalStores } from "@/hooks/use-modal";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "../use-avatar";
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MemberRole } from "@prisma/client";
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const MembersModal = () => {

  const router = useRouter()
  const { onOpen, isOpen, onClose, type, data } = useModalStores();
  const { server } = data as { server: ServerWithMemberWithProfile };
  const isModalOpen = isOpen && type === "member";
  const [loadingId, setLoadingId] = useState('')

  const roles = {
    "GUEST" : null ,
    "MODERATOR" : <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/> ,
    "ADMIN" : <ShieldAlert className="h-4 w-4 ml-2 text-rose-500"/>
  }

  const onRolesChange = async (memberId: string , role : MemberRole ) => {
    try {
      setLoadingId(memberId)
      const url = qs.stringifyUrl({
        url : `/api/members/${memberId}`,
        query : {
          serverId : server?.id,
          memberId
        }
      })

      const response = await axios.patch(url, {role})
      router.refresh()
      onOpen('member', {server : response.data})

    } catch (error) {
      console.log(error);
      
    } finally {
      setLoadingId('')
    }
  }


  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId)
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query : {
          serverId : server?.id
        }
      })

      const response = await axios.delete(url)
      router.refresh()
      onOpen('member', {server: response.data})

    } catch (error) {
      console.log(error);
      
    } finally{
      setLoadingId('')
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black px-5 overflow-hidden">
        <DialogHeader className="pt-8 px-5">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage your members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.Member?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
            {server?.Member?.map((members)=> (
              <div
                key={members.id}
                className="flex items-center gap-x-2 mb-5">
                  <UserAvatar src={members.profile.imageUrl}/>
                  <div className="flex flex-col gap-y-1">
                    <div className="text-xs font-semibold flex items-center gap-x-1">
                      {members.profile.name}
                      {roles[members.role]}
                    </div>
                    <p className="text-xs text-zinc-500">
                      {members.profile.email}
                    </p>
                  </div>
                    {server.profileId !== members.profileId && loadingId !== members.id && (
                      <div className="ml-auto">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <MoreVertical className="h-4 w-4 text-zinc-500"/>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="left">
                                <DropdownMenuSub>
                                  <DropdownMenuSubTrigger
                                    className="flex items-center"
                                  >
                                      <ShieldQuestion
                                        className="w-4 h-4 mr-2"
                                      />
                                      <span>Role</span>
                                  </DropdownMenuSubTrigger>
                                  <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                      <DropdownMenuItem
                                        onClick={()=> onRolesChange(members.id, 'GUEST')}>
                                        <Shield className="w-4 h-4 mr-2"/>
                                        GUEST
                                        {members.role === 'GUEST' && (
                                          <Check className="h-4 w-4 ml-auto"/>
                                        )}

                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onClick={()=>onRolesChange(members.id, 'MODERATOR')}>
                                        <ShieldCheck className="w-4 h-4 mr-2"/>
                                        MODERATOR
                                        {members.role === 'MODERATOR' && (
                                          <Check className="h-4 w-4 ml-auto"/>
                                        )}
                                      </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                  </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem onClick={()=> onKick(members.id)}>
                                  <Gavel className="h-4 w-4 mr-3"/>
                                  Kick
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                      </div>
                    )}
                    {loadingId === members.id && (
                      <Loader2 className="w-4 h-4 animate-spin text-green-500 ml-auto"/>
                    )}
              </div>
            ))}
        </ScrollArea>
        <div className="p-5"></div>
      </DialogContent>
    </Dialog>
  );
};
