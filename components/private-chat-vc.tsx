'use client'

import qs from 'query-string'
import { Video, VideoOff } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ActionTooltip } from './action-tooltip'

export const PrivateChatVC = () =>{

    const pathName = usePathname() //Mengambil bagian path dari URL saat ini, tanpa query string (?)
    const router = useRouter()
    const searchParams = useSearchParams()
    const isVideo = searchParams?.get('video')  //Tujuannya agar akses URL query key 'VIDEO' dan akan diakses melalui router.push()
    const Icon = isVideo ? VideoOff : Video
    const tooltipLabel = isVideo ? 'End Video Call' : 'start Video Call'

    const onClick = () => {

        const url = qs.stringifyUrl({
            url : pathName || '',
            query : {
                video : isVideo ? undefined : true
            }
        }, {skipNull : true}
    )
        router.push(url)
    }

    return (
        <ActionTooltip side='bottom' label={tooltipLabel}>
            <button onClick={onClick} className='hover:opacity-75 transition mr-3'>
                <Icon className='h-5 w-5 text-zinc-500 dark:text-zinc-400'/>
            </button>

        </ActionTooltip>
    )
    
}