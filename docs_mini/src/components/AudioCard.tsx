import React, { useState, useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import { LuDownload } from 'react-icons/lu';
import { motion } from 'framer-motion';
import AudioPlayer from './AudioPlayer/AudioPlayer';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder';
import getFileSize from '../helpers/getSize';
import { FaRegFileAudio } from 'react-icons/fa6';
import { toast } from 'sonner';

type Props = {
  data: audioCard;
  reference: React.RefObject<HTMLDivElement>;
  setData: React.Dispatch<React.SetStateAction<audioCard[]>>;
  setCount: React.Dispatch<React.SetStateAction<number>>;
};

const AudioCard = ({
  data,
  reference,
  setData,
  setCount
}: Props) => {
  const [recordState, setRecordState] = useState<RecordState | null>(null);
  const [micPermission, setMicPermission] = useState<boolean | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(divRef.current && reference.current){
      // Get the dimensions of the parent div and the card itself
      const parentDimensions = reference.current.getBoundingClientRect();
      const cardDimensions = divRef.current.getBoundingClientRect();

      // Calculate random position
      const randomTop = Math.random() * (parentDimensions.height - cardDimensions.height);
      const randomLeft = Math.random() * (parentDimensions.width - cardDimensions.width);

      // Set the position state
      setPosition({ top: randomTop, left: randomLeft });
    }
  }, []);

  // Function to check microphone permission
  const checkMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission(true);
    } catch (err) {
      console.error(err);
      setMicPermission(false);
    }
  };

  const startRecording = () => {
    if (micPermission) {
      setRecordState(RecordState.START);
    } else {
      checkMicrophonePermission();
      toast.error('Microphone permission not granted');
      console.error('Microphone permission not granted');
    }
  };

  const stopRecording = () => {
    setRecordState(RecordState.STOP);
  };

  const onStop = (audioData: { blob: Blob; url: string }) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData.forEach((item) => {
        if (item.id === data.id) {
          item.audioBlob = audioData.blob;
          item.download = true;
          item.tagDetails = {
            isOpen: true,
            tagTitle: 'Recorded',
            tagColor: 'rgb(37, 99, 235)',
          };
          item.size = getFileSize(audioData.blob.size);
        }
      });
      return newData;
    });
  };

  const downloadFile = () => {
    const blob = new Blob([data.audioBlob], { type: 'audio/mpeg' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = data.title + '.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded ${data.title}`);

    setData((prevData) => {
      const newData = [...prevData];
      newData.forEach((item) => {
        if (item.id === data.id) {
          item.tagDetails = {
            isOpen: true,
            tagTitle: 'Downloaded',
            tagColor: 'rgb(22, 163, 74)',
          };
          item.download = false;
        }
      });
      return newData;
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData.forEach((item) => {
        if (item.id === data.id) {
          item.title = e.target.value;
          item.download = true;
          item.tagDetails = {
            isOpen: true,
            tagTitle: 'Updated',
            tagColor: 'rgb(37, 99, 235)',
          };
        }
      });
      return newData;
    });
  };

  const removeNote = () => {
    setCount((prevCount) => prevCount - 1);
    setData((prevData) => {
      const newData = prevData.filter((item) => item.id !== data.id);
      return newData;
    });
  };

  return (
    <motion.div
      drag
      dragConstraints={reference}
      whileDrag={{ scale: 1.1 }}
      dragElastic={0.3}
      dragTransition={{
        bounceStiffness: 200,
        bounceDamping: 20,
      }}
      ref={divRef}
      style={{
        top: position.top,
        left: position.left,
      }}
      className="absolute flex-shrink-0 flex flex-col w-80 h-fit rounded-[40px] bg-zinc-900/90 text-white overflow-hidden"
    >
      <div className='flex flex-col gap-4 w-full h-fit px-7 pt-8'>
        <div className='flex items-center gap-2'>
          <FaRegFileAudio className='min-w-4 h-4'/>
          <input
            className='text-md font-semibold bg-transparent outline-none text-white w-[80%] truncate'
            value={data.title}
            onChange={handleNameChange}
          />
        </div>

        {recordState !== RecordState.START && (
          <AudioPlayer
            key={data.audioBlob.size}
            currentSong={{
              title: data.title,
              src: URL.createObjectURL(data.audioBlob),
            }}
          />
        )}

        <div className={`rounded-full overflow-hidden w-full h-fit ${recordState === RecordState.START ? 'block' : 'hidden'}`}>
          <AudioReactRecorder state={recordState} onStop={onStop} canvasWidth={270} canvasHeight={44} backgroundColor={"rgb(30,30,32)"} foregroundColor={"rgb(200,200,200)"}/>
        </div>

        <button onMouseDown={startRecording} onMouseUp={stopRecording} className={recordState === RecordState.START ? 'recording-button' : 'not-recording-button'}>
          {recordState === RecordState.START ? 'Recording...' : 'Hold to Record'}
        </button>
      </div>

      <div className={`w-full ${!data.tagDetails.isOpen && 'mb-2'}`}>
        <div className='flex items-center justify-between py-3 px-5'>
          <h5>{data.size}</h5>
          <div className='flex items-center gap-3'>
            {data.download && (
              <motion.div 
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.2 }}
                onClick={downloadFile} 
                title='Download' 
                className='w-6 h-6 flex items-center justify-center bg-zinc-500 hover:bg-zinc-600 text-white/80 hover:text-white rounded-full cursor-pointer'
              >
                <LuDownload className='h-3 w-3' />
              </motion.div>
            )}
            <motion.div 
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.2 }}
              onClick={removeNote} 
              title="Remove" 
              className='w-6 h-6 flex items-center justify-center bg-zinc-500 hover:bg-zinc-600 text-white/80 hover:text-white rounded-full cursor-pointer'
            >
              <IoClose className='h-4 w-4' />
            </motion.div>
          </div>
        </div>

        {data.tagDetails.isOpen && (
          <div className='w-full h-10 flex items-center justify-center' style={{ backgroundColor: data.tagDetails.tagColor }}>
            <h3 className='text-sm font-semibold'>{data.tagDetails.tagTitle}</h3>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AudioCard;
