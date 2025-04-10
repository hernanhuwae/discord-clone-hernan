"use client";

import { Member, MemberRole, Profile } from "@prisma/client";
import { UserAvatar } from "../use-avatar";
import { ActionTooltip } from "../action-tooltip";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import qs from 'query-string'
import axios from "axios";

interface IChatBubble {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timeStamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIcon = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
};

export const ChatBubble = ({
  id,
  content,
  currentMember,
  deleted,
  fileUrl,
  isUpdated,
  member,
  socketQuery,
  socketUrl,
  timeStamp,
}: IChatBubble) => {
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwnerMessage = currentMember.id === member.id; //Todo: Pemilik/Pengirim pesan
  const canDeleteMessage =
    !deleted && (isAdmin || isModerator || isOwnerMessage);
  const canEditMessage = !deleted && isOwnerMessage && !fileUrl;

  const [isPdf, setIsPdf] = useState<boolean>(false);
  const [isImage, setIsImage] = useState<boolean>(false);

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  //Todo: Create a Form Edit Message
  const formSchema = z.object({
    content: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        
        const url = qs.stringifyUrl({
            url: `${socketUrl}/${id}`,
            query: socketQuery
        })

        await axios.patch(url)

    } catch (error) {
        console.log(error);
    }
  };

 

  //Todo: Form Edit
  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content]);

  //Todo: 'escape' and 'enter' button to cancel edit Form
  useEffect(()=>{
    const handleKeyDown = (event : any) => {
        if(event.key === 'Escape' || event.keyCode === 27){
            setIsEditing(false)
        }
    }

    window.addEventListener(`keydown`, handleKeyDown)

    return () => window.removeEventListener(`keydown`, handleKeyDown)

  },[])


  //Todo: Show fileUrl among are Image and Pdf with their own UI Component
  useEffect(() => {
    if (fileUrl) {
      // Check file extension from URL
      const fileExt = fileUrl.split(".").pop()?.toLowerCase();

      // Set PDF flag if extension is pdf
      if (fileExt === "pdf") {
        setIsPdf(true);
        setIsImage(false);
      } else {
        // Assume it's an image for all other file types
        setIsPdf(false);
        setIsImage(true);
      }
    } else {
      // No file URL at all
      setIsPdf(false);
      setIsImage(false);
    }
  }, [fileUrl]);


  return (
    <div className="w-full relative group flex items-center hover:bg-black/5 p-4 transition">
      <div className="group flex gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center ">
              <p className="font-semibold pr-2 text-sm hover:underline cursor-pointer">
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIcon[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timeStamp}
            </span>
          </div>

          {isImage && (
            <a
              href={fileUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex aspect-square rounded-md mt-2 overflow-hidden
                            border items-center bg-secondary h-48 w-48"
            >
              <Image
                src={fileUrl!}
                alt={content}
                fill
                className="object-cover"
                onError={() => {
                  // If image loading fails, it might be a PDF
                  console.log("Image loading failed, might be PDF");
                  setIsImage(false);
                  setIsPdf(true);
                }}
              />
            </a>
          )}

          {isPdf && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                File PDF
              </a>
            </div>
          )}

          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
              )}
            >
              {content}

              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}

          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className="flex items-center w-full gap-x-2 pt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input disabled={isLoading}
                            className="w-full p-2 bg-zinc-200/90 dark:bg-zinc-700/75 
                                            border-none border-0  focus-visible:ring-0 focus-visible:ring-offset-0
                                            text-zinc-600 dark:text-zinc-200"
                            placeholder="Edited Message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button onClick={()=>{}} disabled={isLoading} size='sm' variant='secondary'>
                    Save
                </Button>

              </form>

              <span className="text-xs m-1 text-zinc-400">Escape to cancel, Enter to submit</span>

            </Form>
          )}

        </div>
      </div>

      {canDeleteMessage && (
        <div
          className="absolute p-1 -top-2 right-5 bg-white hidden 
                group-hover:flex  items-center gap-x-2 dark:bg-zinc-800 border rounded-sm "
        >
          <ActionTooltip label="delete">
            <Trash
              className="w-4 h-4 cursor-pointer ml-auto text-zinc-500 
                hover:text-zinc-600 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>

          {canEditMessage && (
            <ActionTooltip label="edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="w-4 h-4 cursor-pointer ml-auto text-zinc-500 
                    hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          )}
        </div>
      )}

    </div>
  );
};
