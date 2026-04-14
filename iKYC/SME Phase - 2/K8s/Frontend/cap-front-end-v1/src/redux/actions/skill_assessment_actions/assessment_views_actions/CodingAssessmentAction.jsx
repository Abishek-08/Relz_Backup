import { assessmentConstants } from "../../../constants/skill_assessment_constants/assessment_view_constants/CodingAssessmentActionType"

/**
 * @author sanjay.subramani
 * @since 11-07-2024
 * @version 1.0
*/

const getSkillAssessmentQuestions = (questions) => {
    return {
        type: assessmentConstants.GET_ASSESSMENT_QUESTIONS,
        payload: questions
    }
}


const getCurrentLanguageSkeleton = (record) => {
    return {
        type: assessmentConstants.GET_CURRENT_LANGUAGE_SKELETON,
        payload: record
    }
}

const resetCurrentLanguageSkeleton = () => {
    return {
        type: assessmentConstants.RESET_CURRENT_LANGUAGE_SKELETON
    }
}

export {
    getCurrentLanguageSkeleton, getSkillAssessmentQuestions, resetCurrentLanguageSkeleton
}

