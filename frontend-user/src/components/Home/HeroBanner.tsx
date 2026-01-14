
const HeroBanner = () => {
  return (
    <div className="flex w-full justify-center px-4 md:px-10 lg:px-20 py-2">
      <img
        src="/banner.jpg"
        alt="Hero Banner"
        className="w-full 
        max-w-7xl
        h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] object-cover rounded-lg"
      />
    </div>
  )
}

export default HeroBanner;

