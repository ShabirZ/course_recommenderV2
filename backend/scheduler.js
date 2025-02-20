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

function backtrack(courses, index, schedule, allSchedules) {
    if (index === courses.length) {
        allSchedules.push([...schedule]); // Store a valid schedule
        return;
    }

    let courseOptions = courses[index];

    for (let option of courseOptions) {
        if (!isConflict(schedule, option)) {
            schedule.push(option);
            backtrack(courses, index + 1, schedule, allSchedules);
            schedule.pop(); // Backtrack
        }
    }
}

function scheduleCourses(courseOptions) {
    let allSchedules = [];
    backtrack(courseOptions, 0, [], allSchedules);
    return allSchedules.length > 0 ? allSchedules : "No valid schedule found";
}

// Example Input
const courses = [
    [
        { name: "Math 101", instructor: "John Doe", days: "MoWe", times: ["11:00AM-1:00PM"] },
        { name: "Math 101", instructor: "John Doe", days: "TuTh", times: ["9:00AM-11:00AM"] }
    ],
    [
        { name: "CS 101", instructor: "Jane Smith", days: "MoWe", times: ["1:00PM-3:00PM"] },
        { name: "CS 101", instructor: "Jane Smith", days: "TuTh", times: ["11:00AM-1:00PM"] }
    ],
    [
        { name: "Physics 101", instructor: "Mike Brown", days: "MoWe", times: ["9:00AM-11:00AM"] },
        { name: "Physics 101", instructor: "Mike Brown", days: "TuTh", times: ["3:00PM-5:00PM"] }
    ]
];

console.log(scheduleCourses(courses));
