import qs from 'query-string'
import {useInfiniteQuery} from '@tanstack/react-query'
import { useSocket } from '@/components/providers/socket-provider'


interface IUseChatQuery {
    queryKey: string
    apiUrl: string
    paramKey: 'channelId' | 'conversationId'
    paramValue: string
}

export const useChatQuery = ({queryKey,apiUrl,paramKey,paramValue}:IUseChatQuery) => {

    const {isConnected} = useSocket()

    const fetchMessages = async({pageParam = undefined}) => {
        
        const url = qs.stringifyUrl({
            url: apiUrl,
            query: {
                cursor : pageParam,
                [paramKey]: paramValue 
            }
        }, {skipNull: true})

        const res = await fetch(url)
        return res.json()
    }

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchMessages,
        getNextPageParam: (lastPage) => lastPage?.nextCursor, //Todo: nextCursor dari isi route.ts api/messages
        refetchInterval: isConnected ? false : 1000,
        initialPageParam: undefined
    })

    return{
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    }
    

}