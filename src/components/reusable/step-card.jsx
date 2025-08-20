import { List } from "lucide-react";

const StepCard = ({ title }) => (
  <div className="bg-white w-20 p-3 rounded-md flex flex-col items-center gap-1 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
    <div className="w-8 h-8 bg-blue-100 text-blue-700 flex items-center justify-center rounded-full text-lg">
      <List />
    </div>
    <div
      className="text-center font-medium text-[10px] text-gray-800 w-full overflow-hidden text-ellipsis whitespace-nowrap"
      title={title}
    >
      {title}
    </div>
  </div>
);

export default StepCard;
