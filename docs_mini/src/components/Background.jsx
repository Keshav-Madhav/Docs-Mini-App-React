import { mainStore } from './mainStore'

const Background = () => {
  const { isDrag } = mainStore();

  return (
    <div 
      className="fixed w-full h-screen z-[2]"
    >
      <div className="absolute top-[5%] w-full py-8 flex justify-center text-zinc-500 font-semibold text-xl">
        Drag and Drop.
      </div>
      <h1 className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] text-[15vw] leading-none tracking-tighter font-semibold text-[rgb(232,145,47)]">
        {isDrag ? "drop." : "notes."}
      </h1>
    </div>
  )
}

export default Background