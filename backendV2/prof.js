class Prof {
    constructor(firstName, lastName, classSubject, classCode, startTime, endTime, section,days) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.classSubject = classSubject;
        this.classCode = classCode;
        this.startTime = startTime;
        this.endTime = endTime;
        this.section = section;
        this.RMP_rating = null;
        this.RMP_difficulty = null;
        this.courseAverage = null;
        this.days = days
    }
    setCourseAverage(courseAverage){
        this.courseAverage = courseAverage;
    }
    setRMP(profRating, profDifficulty){
        this.RMP_rating = profRating;
        this.RMP_difficulty = profDifficulty;
        this.courseAverage ??= 2.75;
    }
    getRating(){
        //Does not account for when a professor has no ratings
        if(this.RMP_rating == null) this.RMP_rating = 2.5;
        if(this.RMP_difficulty == null) this.RMP_difficulty = 2.5;

        this.courseAverage ??= 2.75;

        return (this.RMP_rating+this.RMP_difficulty+2*this.courseAverage);
    }
}

module.exports = Prof;