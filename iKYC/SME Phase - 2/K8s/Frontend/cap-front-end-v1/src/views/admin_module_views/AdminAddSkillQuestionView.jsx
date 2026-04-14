import React from 'react'
import AdminNavbar from '../../components/admin_module_components/AdminNavbar';
import AdminSkillQuestionPick from '../../components/admin_module_components/ScheduleSkillAssessment/AdminSkillQuestionPick';
import AdminHorizontalLinearAlternativeLabelStepper from '../../components/admin_module_components/ScheduleSkillAssessment/AdminHorizontalLinearAlternativeLabelStepper';
import AdminAddSkillQuestionViewStyle from '../../styles/admin_module_styles/skill_assessment_schedule_admin/AdminAddSkillQuestionViewStyle.css';
const AdminAddSkillQuestionView = () => {
    return (
        <div className="container-fluid d-flex">
            <div className='Admin_Add_Skill_Question_View_Navbar'>
                <AdminNavbar />
            </div>

            <div className = 'Admin_Add_Skill_Question_View_Admin_Stepper'>
                <div style={{paddingTop: "100px"}}>
                    <AdminHorizontalLinearAlternativeLabelStepper />
                </div>
                <div className = 'Admin_Add_Skill_Question_View_Admin_Skill_Question_Pick' >
                    <AdminSkillQuestionPick />
                </div>
            </div>
        </div>
    )
}

export default AdminAddSkillQuestionView
