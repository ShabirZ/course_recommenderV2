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

function backtrack(courses, index, schedule) {
    if (index === courses.length) {
        return schedule; // Successfully scheduled all courses
    }

    let courseOptions = courses[index];

    for (let option of courseOptions) {
        if (!isConflict(schedule, option)) {
            schedule.push(option);
            let result = backtrack(courses, index + 1, schedule);
            if (result) return result; // Found a valid schedule
            schedule.pop(); // Backtrack
        }
    }

    return null; // No valid schedule found
}

function scheduleCourses(courseOptions) {
    return backtrack(courseOptions, 0, []) || "No valid schedule found";
}

// Example Input: List of possible courses and their schedules
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
