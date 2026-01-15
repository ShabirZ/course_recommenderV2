import clsx from "clsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faChartLine, faUserGraduate, faLayerGroup } from '@fortawesome/free-solid-svg-icons';

const CourseCard = ({ course, card, hasProfData, fullBgClass, setModelFlag, setModelDetails }) => {
  
  const [courseSubject, courseNumber] = course.split(" ");
  
  const {
    profName,
    profCourseAvg,
    profRating,
    profDifficulty,
    overallRating,
    section
  } = card || {};

  const modelDetails = {
    profName,
    profCourseAvg,
    profRating,
    profDifficulty,
    overallRating,
    className: courseSubject,
    classCode: courseNumber,
    section
  };

  const handleCardClick = () => {
    if (!card) return;
    setModelDetails(modelDetails);
    setModelFlag(true);
  };

  const getDifficultyColor = (diff) => {
    if (diff > 4) return 'bg-red-500';
    if (diff > 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div
      onClick={handleCardClick}
      className={clsx(
        // CHANGE 1: max-w-md (Wider), reduced vertical margin
        "group relative w-full max-w-md flex flex-col rounded-xl overflow-hidden transition-all duration-300 ease-out",
        "bg-white shadow-md hover:shadow-xl hover:-translate-y-1 cursor-pointer ring-1 ring-slate-100",
        !card && "cursor-default hover:translate-y-0 hover:shadow-md"
      )}
    >
      
      {/* --- Compact Header --- */}
      {/* CHANGE 2: Reduced vertical padding (py-3) */}
      <div className={clsx("px-5 py-3 flex justify-between items-center", fullBgClass || "bg-blue-600")}>
        <div className="flex items-baseline gap-2 text-white">
          <span className="text-2xl font-bold tracking-tight">{courseNumber}</span>
          <span className="text-xs font-medium opacity-80 uppercase tracking-widest">{courseSubject}</span>
        </div>
        
        {/* Decorative Icon */}
        <div className="text-white opacity-20 transform group-hover:scale-110 transition-transform duration-500">
           <FontAwesomeIcon icon={faLayerGroup} size="lg" />
        </div>
      </div>

      {/* --- Horizontal Body --- */}
      <div className="flex-1 flex flex-col justify-center px-5 py-3 min-h-[110px] bg-white"> 
        
        {hasProfData && card ? (
          <div className="flex items-center justify-between gap-4 animate-fade-in">
            
            {/* Left Side: Professor Info */}
            <div className="flex-1 min-w-0 border-r border-slate-100 pr-4">
               <h3 className="text-base font-bold text-slate-800 truncate" title={profName}>
                  {profName}
               </h3>
               <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wide border border-slate-200">
                    Section {section}
                  </span>
               </div>
               {/* Overall Score moved here for compactness */}
               <div className="mt-2 text-[10px] font-semibold text-slate-400">
                  Overall: <span className="text-blue-600">{overallRating}/100</span>
               </div>
            </div>

            {/* Right Side: Stats Grid (2x2) */}
            {/* CHANGE 3: Grid layout pushes data side-by-side to save height */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 flex-shrink-0">
               
               {/* Rating */}
               <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-amber-400">
                     <span className="text-slate-800 font-bold text-sm">{profRating}</span>
                     <FontAwesomeIcon icon={faStar} className="text-xs" />
                  </div>
                  <span className="text-[9px] text-slate-400 uppercase font-medium">Rating</span>
               </div>

               {/* Avg Grade */}
               <div className="flex flex-col items-end">
                  <div className="text-sm font-bold text-slate-800">{profCourseAvg}%</div>
                  <span className="text-[9px] text-slate-400 uppercase font-medium">Avg</span>
               </div>

               {/* Difficulty (Spans 2 cols if needed, or just sits below) */}
               <div className="col-span-2 flex flex-col justify-center mt-1">
                 <div className="flex justify-between text-[9px] mb-0.5">
                    <span className="text-slate-400">Diff</span>
                    <span className="text-slate-600 font-bold">{profDifficulty}</span>
                 </div>
                 <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${getDifficultyColor(profDifficulty)}`} 
                      style={{ width: `${(profDifficulty / 5) * 100}%` }}
                    />
                 </div>
               </div>

            </div>

          </div>
        ) : (
          /* --- Compact Empty State --- */
          <div className="flex items-center justify-center gap-3 opacity-60 py-2">
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
               <FontAwesomeIcon icon={faUserGraduate} size="sm"/>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-500">No Schedule</p>
              <p className="text-[10px] text-slate-400">Waiting for input...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;