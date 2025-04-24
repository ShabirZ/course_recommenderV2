function timeToMinutes(time) {
    let hours;
    let minutes;
    let PM = 0;

    // Split the time into hours and minutes
    time = time.split(':');
    hours = time[0];
    minutes = time[1].slice(0, -2); // Remove AM/PM suffix from minutes
    let suffix = time[1].slice(-2); // Get AM/PM suffix

    // Adjust hours based on AM/PM
    if (suffix === 'PM') {
        if (hours !== '12') {
            hours = parseInt(hours) + 12; // Convert PM hours to 24-hour format
        }
    } else if (suffix === 'AM' && hours === '12') {
        hours = 0; // Convert 12 AM to 0 hours
    }

    // Convert minutes to integer
    minutes = parseInt(minutes);

    // Convert to total minutes since midnight
    return hours * 60 + minutes;
}

function isConflict(schedule, course) {
    let prevStart, prevEnd;
    let courseStart, courseEnd;
    courseStart = (timeToMinutes(course.startTime));
    courseEnd  = timeToMinutes(course.endTime);

    //after
    for (let prevCourse of schedule) {
        // this will bug out on odd classes like classes only on one day 
        // fix later

        if(prevCourse.days != course.days){
            continue;
        }

        prevStart = timeToMinutes(prevCourse.startTime);
        prevEnd = timeToMinutes(prevCourse.endTime);
        console.log(prevStart, prevEnd);
        console.log(courseStart, courseEnd);
        if( (prevStart <= courseStart <= prevEnd) || (courseStart <= prevStart <= courseEnd)  )
            return true; // conflict in schedule

    }

    /*
    //before
    for (let scheduledCourse of schedule) {
        for (let time of scheduledCourse.times) {
            for (let newTime of course.times) {
                if (time === newTime) {
                    return true; // Conflict detected
                }
            }
        }
    }
    */
    return false;
}

function calculateScore(schedule) {
    let total = schedule.reduce((sum, course) => sum + course.getRating(), 0);
    return parseFloat(total.toFixed(2)); // ensure it's a number, not a string
  }

function backtrack(courses, index, schedule, allSchedules, bestSchedule) {
    if (index === courses.length) {
        let scheduleScore = calculateScore(schedule);
        allSchedules.push({ schedule: [...schedule], score: scheduleScore });

        // Update the best schedule if this one has a higher score
        if (!bestSchedule.best || scheduleScore > bestSchedule.best.score) {
            bestSchedule.best = { schedule: [...schedule], score: scheduleScore };
            for(let idx = 0; idx<schedule.length; idx++){
                console.log(schedule[idx].firstName);
            }
        }
        return;
    }

    let courseOptions = courses[index];

    for (let option of courseOptions) {
        if (!isConflict(schedule, option)) {
            schedule.push(option);
            backtrack(courses, index + 1, schedule, allSchedules, bestSchedule);
            schedule.pop(); // Backtrack
        }
    }
}

function scheduleCourses(courseOptions) {
    let allSchedules = [];
    let bestSchedule = { best: null };
    console.log(courseOptions);
    backtrack(courseOptions, 0, [], allSchedules, bestSchedule);
    
    return allSchedules.length > 0 ? { allSchedules, bestSchedule: bestSchedule.best } : "No valid schedule found";
}

export { scheduleCourses };

