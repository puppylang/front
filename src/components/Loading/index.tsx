function Loading() {
  return (
    <div className='loading  fixed z-[1000] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] flex items-center justify-center gap-x-4 w-full h-full bg-[#ffffff4d]'>
      {Array.from({ length: 3 }, (_, i) => i).map(div => (
        <div key={div} className={`relative w-2 h-2 bg-main-1 rounded-full animate-ping duration-700 `} />
      ))}
    </div>
  );
}

export default Loading;
