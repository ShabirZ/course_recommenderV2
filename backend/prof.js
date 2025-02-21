class Prof {
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
    calcGrade(){
        //Does not account for when a professor has no ratings
        return (this.RMP_rating+this.RMP_difficulty+2*this.courseAverage);
    }
}
