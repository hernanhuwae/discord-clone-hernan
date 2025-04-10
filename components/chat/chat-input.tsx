'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { Plus, Smile, SmileIcon } from 'lucide-react'
import { Input } from '../ui/input'
import qs from 'query-string'
import axios from 'axios'
import { useModalStores } from '@/hooks/use-modal'
import { EmoticonMessage } from './chat-emoticon'
import { useRouter } from 'next/navigation'

interface IChatInput{
    apiUrl: string
    query: Record<string,any>
    name: string
    type: 'conversation' | 'channel'
}

const formSchema= z.object({
    content : z.string().min(1)
})

export const ChatInput = ({apiUrl,query,name,type}:IChatInput) => {

    const {onOpen} = useModalStores()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: ''
        }
    })

    
    const router= useRouter()
    const isLoading = form.formState.isSubmitting
    const onSubmit = async(values: z.infer<typeof formSchema>)=> {

        try {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query
            })
            await axios.post(url,values)
            form.reset()
            router.refresh()
            window.location.reload()
        } catch (error) {
            console.log(error);   
        }
        
    }


    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name='content'
                    render={({field})=>(
                        <FormItem>
                            <FormControl>
                                <div className='relative p-4 pb-5'>
                                    <button
                                        type='button'
                                        onClick={()=> onOpen('messageFile',{apiUrl,query})}
                                        className='flex mx-2 items-center justify-center absolute top-7 h-[25px] w-[25px] 
                                        dark:bg-zinc-300 bg-emerald-500 dark:bg-zinc-400hover:bg-zinc-600 dark:hover:bg-emerald-500 transition rounded-full'
                                    >
                                        <Plus size={55} className='dark:hover:text-white  text-white dark:text-emerald-700'/>
                                    </button>
                                    <Input
                                        {...field}
                                        placeholder={`Type Something in ${type ==='channel' ? name : '#' + name} ...`}
                                        disabled={isLoading}
                                        className='px-14 py-7 bg-zinc-200/90 dark:bg-zinc-700/75 border-none
                                            border-0 focus-visible:ring-0 focus-visible:ring-offset-0
                                            text-zinc-600 dark:text-zinc-300'
                                    />
                                    <div className='absolute top-7 right-8'>
                                        <EmoticonMessage
                                            onChange={(emoji:string) => field.onChange(`${field.value}${emoji}`)}
                                        />
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )

}