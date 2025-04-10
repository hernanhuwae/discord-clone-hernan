"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import qs from 'query-string'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Button } from "../ui/button";
import { FileUpload } from "../file-upload";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useModalStores } from "@/hooks/use-modal";

const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "File is Required !",
  }),
});
export const MessageFileModal = () => {

  const {isOpen,onClose,type,data} = useModalStores()
  const isModalOpen = isOpen && type === 'messageFile'
  const {apiUrl,query} = data
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const handleClose = () => {
    form.reset()
    onClose()
  } 

  const iSLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || '',
        query
      })
      await axios.post(url, {
        ...values,
        content: values.fileUrl
      });

      form.reset();
      router.refresh();
      window.location.reload()
      handleClose()
    } catch (error) {
      console.log(error);
    }
  };

 

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-5">
          <DialogTitle className="text-2xl text-center font-bold">
            Add your file 
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-600">
            Send a file for your message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-5">
              <div className="flex justify-center items-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endPoint="messageFile"
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-5 py-4">
              <Button
                className="w-full bg-indigo-500 text-white hover:bg-indigo-500/90"
                disabled={iSLoading}
              >
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

