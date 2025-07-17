'use client';

import {
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  RoomContext,
  useTracks,
  Chat,
  useChatToggle
} from '@livekit/components-react';
import { Room, Track } from 'livekit-client';
import '@livekit/components-styles';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Video, VideoOff, Mic, MicOff, MonitorUp, MonitorX, LogOut } from 'lucide-react';

interface IMediaRoom {
  chatId: string;
  video: boolean;
  audio: boolean;

}

export const MediaRoom = ({ chatId, video, audio }: IMediaRoom) => {
  const router = useRouter();
  const [roomInstance] = useState(() =>
    new Room({
      adaptiveStream: true,
      dynacast: true,
    }),
  );
  const [token, setToken] = useState('');
  const [isCamOn, setIsCamOn] = useState(video);
  const [isMicOn, setIsMicOn] = useState(audio);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  useEffect(() => {
    let mounted = true;

    const connectRoom = async () => {
      try {
        const res = await fetch(`/api/livekit?room=${chatId}&username=User`);
        const data = await res.json();
        if (!mounted) return;
        setToken(data.token);

        await roomInstance.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, data.token);

        if (video) await roomInstance.localParticipant.setCameraEnabled(true);
        if (audio) await roomInstance.localParticipant.setMicrophoneEnabled(true);
      } catch (err) {
        console.error('Error connecting:', err);
      }
    };

    connectRoom();

    return () => {
      mounted = false;
      roomInstance.disconnect();
    };
  }, [chatId, roomInstance, video, audio]);

  const handleLeave = async () => {
    await roomInstance.disconnect();
    router.refresh()
    router.push(`/servers/${chatId}`); // 🔁 redirect ke page server
   
  };

  const toggleCamera = () => {
    const isEnabled = roomInstance.localParticipant.isCameraEnabled;
    roomInstance.localParticipant.setCameraEnabled(!isEnabled);
    setIsCamOn(!isEnabled);
  };

  const toggleMic = () => {
    const isEnabled = roomInstance.localParticipant.isMicrophoneEnabled;
    roomInstance.localParticipant.setMicrophoneEnabled(!isEnabled);
    setIsMicOn(!isEnabled);
  };

  const toggleScreenShare = async () => {
    const isSharing = roomInstance.localParticipant.isScreenShareEnabled;
    if (isSharing) {
      await roomInstance.localParticipant.setScreenShareEnabled(false);
      setIsScreenSharing(false);
    } else {
      try {
        await roomInstance.localParticipant.setScreenShareEnabled(true);
        setIsScreenSharing(true);
      } catch (err) {
        console.error('Failed to share screen:', err);
      }
    }
  };

  if (!token) return <div>Loading...</div>;

  return (
    <RoomContext.Provider value={roomInstance}>
      <div data-lk-theme="default" className="h-screen flex flex-col bg-black">
        <MyVideoConference />

        {/* 🔘 Custom Control Bar */}
        <div className="flex items-center justify-center gap-4 p-4 bg-zinc-900 border-t border-zinc-800">
          {/* MIC */}
          <button
            onClick={toggleMic}
            className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white"
          >
            {isMicOn ? <Mic /> : <MicOff />}
          </button>

          {/* CAMERA */}
          <button
            onClick={toggleCamera}
            className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white"
          >
            {isCamOn ? <Video /> : <VideoOff />}
          </button>

          {/* SCREEN SHARE */}
          <button
            onClick={toggleScreenShare}
            className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white"
          >
            {isScreenSharing ? <MonitorX /> : <MonitorUp />}
          </button>

          {/* LEAVE */}
          <button
            onClick={handleLeave}
            className="ml-auto p-2 px-4 rounded-md bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
          >
            <LogOut size={18} />
            Leave
          </button>
        </div>

        <RoomAudioRenderer />
      </div>
    </RoomContext.Provider>
  );
};

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  return (
    <GridLayout
      tracks={tracks}
      style={{ height: 'calc(92vh - 70px)' }} // Sesuaikan dengan tinggi control bar custom
    >
      <ParticipantTile />
    </GridLayout>
  );
}
