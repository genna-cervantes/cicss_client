import wave from "../assets/wave.png";

const Greeting = ({ userName }: { userName: String }) => {
  return (
    <div>
      <div>
        <div className="flex">
          <h1 className="flex font-Helvetica-Neue-Heavy text-4xl">
            <div>
              Hello, <span>{userName}</span>
            </div>
          </h1>
          <img src={wave} alt="" className="w-[60px] h-[60px]" />
        </div>
      </div>
    </div>
  );
};

export default Greeting;
