const SchedulerButton = ( props ) => {

    const {fetchSchedules, courses, semesterType, schedulePage, setCourseData, setCardData, setShowCardData} = props;
    
    return <button 
            className = "bg-stone-700 text-blue-300 flex-1 hover:text-blue-800 hover:bg-stone-900"
            onClick = {async ()=>{
              /*
                const {scheduleData, profCardData} = await fetchSchedules(courses, semesterType, 1, schedulePage)
                setCourseData(scheduleData);
                setCardData(profCardData);
                setShowCardData(true);
              */
              fetchSchedules(courses, semesterType, 1, schedulePage)
              .then(({ schedData, profCardData }) => {
                setCourseData(schedData);
                setCardData(profCardData);
                setShowCardData(true);
              })
              .catch(err => console.error(err));

              }}
            > Generate Schedule</button>

            
    }

export default SchedulerButton;