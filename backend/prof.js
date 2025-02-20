class Person {
    constructor(firstName, lastName, classSubject, classCode, startTime, endTime) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.classSubject = classSubject;
        this.classCode = classCode;
        this.startTime = startTime;
        this.endTime = endTime;
        this.RMP_rating = null;
        this.RMP_difficulty = null;
        this.courseAverage = null;
    }
    setCourseAverage(courseAverage){
        this.courseAverage = courseAverage;
    }
    setRMP(profRating, profDifficulty){
        this.profRating = profRating;
        this.profDifficulty = profDifficulty;
    }
}

// Creating an instance of the class
const person1 = new Person("Shabir", 21);
person1.greet(); // Output: Hello, my name is Shabir and I am 21 years old.
