"use client";

import qs from 'query-string'
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useModalStores } from "@/hooks/use-modal";
import { ChannelType } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Channel Name is Required !",
    })
    .refine((name) => name !== "general", {
      message: "Channel Name can`t be a General ",
    }),
  type: z.nativeEnum(ChannelType),
});
export const CreateChannelModals = () => {
  const { isOpen, onClose, type, data } = useModalStores();
  const router = useRouter();
  const params = useParams()
  const isModalOpen = isOpen && type === "createChannel";
  const {channelTypeValue} = data  //Todo: Dibuat karena mau create default value form 'server-member'

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: channelTypeValue || ChannelType.TEXT,
    },
  });

  //Todo: Dibuat karena mau create default value form 'server-member'
  useEffect(()=>{
    if(channelTypeValue){
      form.setValue('type', channelTypeValue)
    }else{
      form.setValue('type', ChannelType.TEXT)
    }
  },[channelTypeValue,form])

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {

    try {
      const url = qs.stringifyUrl({
        url: '/api/channels',
        query: {
          serverId : params?.serverId
        }
      })
      await axios.post(url, values);

      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-5">
          <DialogTitle className="text-2xl text-center font-bold">
            Create Channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-slate-700">
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Enter Channel Name"
                        className="bg-zinc-300/50
                                            border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                  control={form.control}
                  name="type"
                  render = {({field})=>(
                    <FormItem>
                      <FormLabel>Channel Type</FormLabel>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className="bg-zinc-300/50 border-0 focus:ring-0
                            text-black  ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                          >
                            <SelectValue placeholder="select a channel type"/>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(ChannelType).map((types)=>(
                            <SelectItem
                              key={types}
                              value={types}
                              className='capitalize'
                            >
                              {types.toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage/>
                    </FormItem>
                  )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-5 py-4">
              <Button
                className="w-full bg-indigo-500 text-white hover:bg-indigo-500/90"
                disabled={isLoading}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
