import React from "react";

type Props = {
  header: string;
  fontSize?: string;
};

const DividerHeader = ({ header, fontSize }: Props) => {
  return (
    <div
      className={`py-2 text-amber-950 ${
        fontSize ? fontSize : "text-3xl md:text-4xl"
      } relative my-3`}
    >
      <div className="w-full h-[4px] bg-yellow-950 absolute top-1/2 rounded-full"></div>
      <p
        className={`font-bold ml-12 px-4 bg-[#fff8e3] relative z-2 inline-block`}
      >
        {header.toUpperCase()}
      </p>
    </div>
  );
};

export default DividerHeader;
