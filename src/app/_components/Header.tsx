import { Icon, icons } from "lucide-react";

import { Film } from "lucide-react";
import { Sun } from "lucide-react";

export const Header = () => {
  return (
    <div className="flex h-[59px] items-center justify-around">
      <div className="flex flex-wrap">
        <div className="flex">
          <Film className="text-indigo-700" />
          <p className="text-indigo-700 text-1xl">MovieZ</p>
        </div>
      </div>
      <div></div>
      <div className="">
        <Sun />
      </div>
    </div>
  );
};
