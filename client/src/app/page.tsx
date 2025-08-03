import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center mt-10 px-4 lg:px-16 max-w-7xl mx-auto gap-y-8 lg:gap-y-0 lg:gap-x-16">
      <div className="w-full lg:w-1/2 flex justify-center text-center">
        <Image
          src="/heroPic.png"
          alt="logo"
          width={500}
          height={500}
          className="max-w-xs md:max-w-md lg:max-w-lg w-full h-auto"
        />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col gap-6 items-center lg:items-start text-center lg:text-left">
        <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold">
          Learn Anything. Anytime. Anywhere.
        </h1>
        <p className="text-base md:text-lg lg:text-xl">
          Join thousands of learners today.
        </p>
        <button className="primaryBtn w-full ">Browse Courses</button>
      </div>
    </div>
  );
}
