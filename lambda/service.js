const agenda = require('./configuration.js')
var moment = require('moment');
var _ = require('lodash');

module.exports = {    
    set_exams: function(attributesManager){
        let todo_exam = agenda.my_exam
        set_s3_data(attributesManager, todo_exam)
        return todo_exam
    }
}

/*
This function generates the effort requested in days in order to prepare the exam.
The effort is evaluated as follows:
- suppose that for each CFU you need 8h of study
- the above supposition is true for an exam with 50% of pass rate
- each day you study 8h
- the effort for a 50% rate exam is CFU * 8
- for exam with different pass rate, you need to increase (or decrease) the above value of (50% - exam pass rate)
*/
function evaluate_exam_effort(cfu, pass_rate){
    var effort_baseline = cfu
    if(pass_rate === 50)
        return effort_baseline
    
    return Math.ceil(effort_baseline + ( ( (effort_baseline * (50 - pass_rate) ) / 100 ) / 8 ))
}

async function get_s3_data(attributesManager){
    const s3Attributes = await attributesManager.getPersistentAttributes() || {};
    return s3Attributes
}

async function set_s3_data(attributesManager, s3Attributes){
    attributesManager.setPersistentAttributes(s3Attributes);
    await attributesManager.savePersistentAttributes();
    return s3Attributes;
}