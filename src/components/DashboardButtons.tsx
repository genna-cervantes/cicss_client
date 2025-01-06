import pencil from "../assets/pencil.png";

const DashboardButtons = ({ Label }: { Label: String }) => {
  return (
    <div>
      <button className="flex font-Manrope font-bold bg-custom_lightblue w-[600px] items-center justify-between py-5 px-5 rounded-xl shadow-lg hover:shadow-xl">
        <div>{Label}</div>
        <div className="flex border border-primary rounded-md px-6 py-[5px] items-center justify-between gap-3">
          <img src={pencil} alt="" className="w-5" />
          <div className="text-primary">Edit</div>
        </div>
      </button>
    </div>
  );
};

export default DashboardButtons;
