import { FaRegFileAlt } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { LuDownload } from 'react-icons/lu'
import { motion } from "framer-motion"

const Card = ({
  title,
  size,
  description,
  tagDetails: { isOpen, tagTitle, tagColor },
  download,
  reference,
}) => {
  return (
    <motion.div drag dragConstraints={reference} whileDrag={{scale: 1.1}} dragElastic={0.3} dragTransition={{bounceStiffness: 200, bounceDamping:20}} className="relative flex-shrink-0 w-60 h-72 rounded-[40px] bg-zinc-900/90 text-white py-8 px-6 overflow-hidden">
      <div className='flex items-center gap-2'>
        <FaRegFileAlt />
        <h3 className='text-md font-semibold'>{title}</h3>
      </div>
      <p className='text-sm mt-3 font-semibold leading-tight'>{description}</p>

      <div className={`absolute bottom-0 w-full left-0 ${!isOpen && 'bottom-2'}`}>
        <div className='flex items-center justify-between py-3 px-7'>
          <h5>{size}</h5>
          {download? (
            <div title='Download' className='w-6 h-6 flex items-center justify-center bg-zinc-500 text-white rounded-full cursor-pointer'>
              <LuDownload className='h-3 w-3'/>
            </div>
          ):(
            <div title="Cancel" className='w-6 h-6 flex items-center justify-center bg-zinc-500 text-white rounded-full cursor-pointer'>
              <IoClose className='h-4 w-4'/>
            </div>
          )}
        </div>

        {isOpen && (
          <div className='w-full h-10 flex items-center justify-center' style={{backgroundColor: tagColor}}>
            <h3 className='text-sm font-semibold'>{tagTitle}</h3>
          </div>
        )}

      </div>
    </motion.div>
  )
}

export default Card