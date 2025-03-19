function ClassCards({ className }) {
  return (
    <div
      className={`relative shadow-lg w-120 h-32 border border-gray-700 text-white text-lg overflow-hidden flex flex-col ${className} rounded-xl transform hover:scale-[1.05] transition-all duration-300 hover:shadow-2xl`}
    >
      {/* Header */}
      <div className="header flex flex-row justify-between p-4 pt-2">
        <div className="text-xl font-semibold tracking-wide">CSCI 313</div>
        <div className="text-base font-medium opacity-80">Shabir Zahir</div>
      </div>

      {/* Divider */}
      <div className="border-b border-gray-700 w-full -mt-3"></div>

      {/* Details */}
      <div className="p-4 pt-1 text-sm space-y-1 space ">

        <div className="flex justify-between">
          <span className="opacity-80">Prof Rating:</span>
          <span className="font-semibold">3/3</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-80">Course Average:</span>
          <span className="font-semibold">X/4.0</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-80">Score:</span>
          <span className="font-semibold">8/10</span>
        </div>
      </div>
    </div>
  );
}

function ClassCardList() {
  const backgrounds = [
    'bg-blue-600',
    'bg-green-600',
    'bg-amber-400',
    'bg-lime-400',
    'bg-teal-700',
    'bg-purple-600',
    'bg-pink-600',
    'bg-orange-600'
  ];

  return (
    <div className="flex flex-col space-y-4 p-4">
      {backgrounds.map((bgClass, index) => (
        <ClassCards
          key={index}
          className={`${bgClass} hover:opacity-90 transition-all duration-500`}
        />
      ))}
    </div>
  );
}

export default ClassCardList;
