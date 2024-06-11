import React from 'react'
import { IoClose } from 'react-icons/io5'
import { LuDownload } from 'react-icons/lu'
import { motion } from "framer-motion"
import getFileSize from '../helpers/getSize'
import ReactPlayer from 'react-player'
import { FaRegFileVideo } from 'react-icons/fa6'
import { toast } from 'sonner'

type Props = {
  data: videoCard,
  reference: React.RefObject<HTMLDivElement>,
  setData: React.Dispatch<React.SetStateAction<videoCard[]>>
  setCount: React.Dispatch<React.SetStateAction<number>>
}

const VideoCard = ({
  data,
  reference,
  setData,
  setCount,
}:Props) => {
  function downloadFile() {
    const url = URL.createObjectURL(data.videoBlob);
    const a = document.createElement
    ('a');
    a.href= url;
    a.download = data.title;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${data.title}`);

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
    setCount((prevCount) => prevCount - 1);
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
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-shrink-0 flex flex-col gap-0 w-[98%] md:w-[50%] lg:w-[35%] h-fit min-h-40 rounded-[40px] bg-zinc-900/90 text-white overflow-hidden"
    >
      <div className='flex flex-col gap-2 w-full h-fit px-7 pt-8'>
        <div className='flex items-center gap-2'>
          <FaRegFileVideo className='min-w-4 h-4'/>
          <input
            className='text-md font-semibold bg-transparent outline-none text-white w-[80%] truncate'
            value={data.title}
            onChange={(e) => {
              handleNameChange(e);
            }}
          />
        </div>
        
        <ReactPlayer 
          url={URL.createObjectURL(data.videoBlob)} 
          width='100%' 
          height='auto' 
          controls={true} 
          playing={false} 
          loop={true} 
          muted={true}
        />
      </div>

      <div className={`w-full ${!data.tagDetails.isOpen && 'mb-2'}`}>
        <div className='flex items-center justify-between py-3 px-5'>
          <h5>{data.size}</h5>
          <div className='flex items-center gap-3'>
            {data.download && (
              <motion.div 
                onClick={downloadFile} 
                title='Download' 
                className='w-6 h-6 flex items-center justify-center bg-zinc-500 hover:bg-zinc-600 text-white/80 hover:text-white rounded-full cursor-pointer'
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.2 }}
              >
                <LuDownload className='h-3 w-3'/>
              </motion.div>
            )}
            <motion.div 
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.2 }}
              onClick={removeNote} 
              title="Remove" 
              className='w-6 h-6 flex items-center justify-center bg-zinc-500 hover:bg-zinc-600 text-white/80 hover:text-white rounded-full cursor-pointer'
            >
              <IoClose className='h-4 w-4'/>
            </motion.div>
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

export default VideoCard