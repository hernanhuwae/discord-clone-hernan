import { NextApiResponseServerIo } from '@/types'
import {Server as NetServer} from 'http'
import { NextApiRequest } from 'next'
import {Server as ServerIO} from 'socket.io'

//Todo : Tujuan kode ini adalah buat server realtime dgn socket.Io buat Realtime data utk Message/Video Call antara FE & BE

export const config = {
    api : {
        bodyParser: false    //Todo : Matiin bodyParser bawaan Next.js karena socket nggak perlu nge-handle JSON/body kayak API biasa.
    }
}

// Todo :Template dasar buat setup Socket.io di Next.js API route
const ioHandler = (req:NextApiRequest, res:NextApiResponseServerIo) => {
    if(!res.socket.server.io){
        const path = '/api/socket/io'   //Todo : Ini adalah API route khusus buat inisialisasi server Socket.io, dan ini hanya akan dijalankan di sisi server, bukan di browser karena NextJs defaultnya Severless.
        const httpServer : NetServer = res.socket.server as any
        const io = new ServerIO(httpServer , {
            path : path,
            addTrailingSlash: false
        })
        res.socket.server.io = io
    }
    res.end()
}

export default ioHandler;