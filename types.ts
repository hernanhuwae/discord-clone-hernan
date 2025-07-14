import {Member, Profile, Server} from '@prisma/client'
import {Server as NetServer, Socket} from 'net'
import { NextApiResponse } from 'next';
import {Server as SocketIOServer} from 'socket.io'


//TODO : Nama Type samakan sesuai dengan Field tabel Schema Prisma (ex: "Member" & "profile")
//TODO : Sebagai props buat ambil sebuah data dari nested database yg hrs berkaita "Server -> Member -> Profile"

export type ServerWithMemberWithProfile = Server & {
    Member : (Member & {profile : Profile})[];
}

//TODO : Untuk kebutuhan NextApiResponse types socket.io
 
export type NextApiResponseServerIo = NextApiResponse & {
    socket : Socket & {
       server : NetServer & {
        io: SocketIOServer
       }
    }
}