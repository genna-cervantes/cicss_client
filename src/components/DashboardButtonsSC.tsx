import pencil from "../assets/pencil.png";

const DashboardButtonsSC = ({ Label }: { Label: String }) => {
  return (
    <div>
      <button className="flex font-Manrope bg-custom_lightblue w-[600px] items-center justify-between py-5 px-5 rounded-xl shadow-lg hover:shadow-xl">
        <div className="flex flex-col text-left">
          <div className="font-bold">Specific Constraints:</div>
          <div>{Label}</div>
        </div>
        <div className="flex border font-bold border-primary rounded-md px-6 py-[5px] items-center justify-between gap-3">
          <img src={pencil} alt="" className="w-5" />
          <div className="text-primary">Edit</div>
        </div>
      </button>
    </div>
  );
};

export default DashboardButtonsSC;
