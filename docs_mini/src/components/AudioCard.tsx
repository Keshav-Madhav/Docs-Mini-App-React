import React from 'react'
import { FaRegFileAlt } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { LuDownload } from 'react-icons/lu'
import { motion } from "framer-motion"
import AudioPlayer from './AudioPlayer/AudioPlayer'

type Props = {
  data: audioCard,
  reference: React.RefObject<HTMLDivElement>,
  setData: React.Dispatch<React.SetStateAction<audioCard[]>>
}

const AudioCard = ({
  data,
  reference,
  setData,
}:Props) => {

  function downloadFile() {
    const blob = new Blob([data.audioBlob], {type: 'audio/mpeg'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = data.title + '.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setData((prevData) => {
      const newData = [...prevData];
      newData.forEach((item) => {
        if (item.id === data.id) {
          item.tagDetails = {
            isOpen: true,
            tagTitle: "Downloaded",
            tagColor: "rgb(22, 163, 74)",
          };
          item.download = false;
        }
      });
      return newData;
    });
  }

  function handleNameChange(e) {
    setData((prevData) => {
      const newData = [...prevData];
      newData.forEach((item) => {
        if (item.id === data.id) {
          item.title = e.target.value;
          item.download = true;
          item.tagDetails = {
            isOpen: true,
            tagTitle: "Updated",
            tagColor: "rgb(37, 99, 235)",
          };
        }
      });
      return newData;
    })
  }

  function removeNote() {
    setData((prevData) => {
      const newData = prevData.filter((item) => item.id !== data.id);
      return newData;
    })
  }
  
  return (
    <motion.div 
      drag 
      dragConstraints={reference} 
      whileDrag={{scale: 1.1}} 
      dragElastic={0.3} 
      dragTransition={{
        bounceStiffness: 200, 
        bounceDamping:20
      }} 
      className="relative flex-shrink-0 flex flex-col w-80 h-fit rounded-[40px] bg-zinc-900/90 text-white overflow-hidden"
    >
      <div className='flex flex-col gap-4 w-full h-fit px-7 pt-8'>
        <div className='flex items-center gap-2'>
          <FaRegFileAlt className='min-w-4 h-4'/>
          <input
            className='text-md font-semibold bg-transparent outline-none text-white w-[80%] truncate'
            value={data.title}
            onChange={(e) => {
              handleNameChange(e);
            }}
          />
        </div>
        {/* <audio
          controls
          controlsList='nofullscreen nodownload noremoteplayback noplaybackrate'
          src={URL.createObjectURL(data.audioBlob)}
          className='w-full h-8 '
        /> */}

        <AudioPlayer 
          currentSong={{
            title: data.title,
            src: URL.createObjectURL(data.audioBlob)
          }}
        />
      </div>

      <div className={`w-full ${!data.tagDetails.isOpen && 'mb-2'}`}>
        <div className='flex items-center justify-between py-3 px-5'>
          <h5>{data.size}</h5>
          <div className='flex items-center gap-3'>
            {data.download && (
              <div onClick={downloadFile} title='Download' className='w-6 h-6 flex items-center justify-center bg-zinc-500 hover:bg-zinc-600 text-white/80 hover:text-white rounded-full cursor-pointer'>
                <LuDownload className='h-3 w-3'/>
              </div>
            )}
            <div onClick={removeNote} title="Remove" className='w-6 h-6 flex items-center justify-center bg-zinc-500 hover:bg-zinc-600 text-white/80 hover:text-white rounded-full cursor-pointer'>
              <IoClose className='h-4 w-4'/>
            </div>
          </div>
        </div>

        {data.tagDetails.isOpen && (
          <div className='w-full h-10 flex items-center justify-center' style={{backgroundColor: data.tagDetails.tagColor}}>
            <h3 className='text-sm font-semibold'>{data.tagDetails.tagTitle}</h3>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default AudioCard