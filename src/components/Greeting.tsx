import wave from "../assets/wave.png";

const Greeting = ({ userName }: { userName: String }) => {
  return (
    <div>
      <div>
        <div className="flex gap-7 items-center">
          <h1 className="font-Helvetica-Neue-Heavy text-5xl">
            <div className="flex gap-3">
              <div className="text-primary">Hello, </div>{" "}
              <div className="text-secondary">{userName}</div>
            </div>
          </h1>
          <img src={wave} alt="" className="w-[48px] h-[50px]" />
        </div>
      </div>
    </div>
  );
};

export default Greeting;
