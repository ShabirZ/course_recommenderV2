function isConflict(schedule, course) {
    for (let scheduledCourse of schedule) {
        for (let time of scheduledCourse.times) {
            for (let newTime of course.times) {
                if (time === newTime) {
                    return true; // Conflict detected
                }
            }
        }
    }
    return false;
}

function calculateScore(schedule) {
    return schedule.reduce((total, course) => total + course.getRating(), 0);
}

function backtrack(courses, index, schedule, allSchedules, bestSchedule) {
    if (index === courses.length) {
        let scheduleScore = calculateScore(schedule);
        allSchedules.push({ schedule: [...schedule], score: scheduleScore });

        // Update the best schedule if this one has a higher score
        if (!bestSchedule.best || scheduleScore > bestSchedule.best.score) {
            bestSchedule.best = { schedule: [...schedule], score: scheduleScore };
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
    backtrack(courseOptions, 0, [], allSchedules, bestSchedule);
    
    return allSchedules.length > 0 ? { allSchedules, bestSchedule: bestSchedule.best } : "No valid schedule found";
}

// Example Input
const courses = [
    [
        { name: "Math 101", instructor: "John Doe", days: "MoWe", times: ["11:00AM-1:00PM"], getRating: () => 8 },
        { name: "Math 101", instructor: "John Doe", days: "TuTh", times: ["9:00AM-11:00AM"], getRating: () => 7 }
    ],
    [
        { name: "CS 101", instructor: "Jane Smith", days: "MoWe", times: ["1:00PM-3:00PM"], getRating: () => 9 },
        { name: "CS 101", instructor: "Jane Smith", days: "TuTh", times: ["11:00AM-1:00PM"], getRating: () => 6 }
    ],
    [
        { name: "Physics 101", instructor: "Mike Brown", days: "MoWe", times: ["9:00AM-11:00AM"], getRating: () => 8 },
        { name: "Physics 101", instructor: "Mike Brown", days: "TuTh", times: ["3:00PM-5:00PM"], getRating: () => 5 }
    ]
];

console.log(scheduleCourses(courses));
