const searchEmployees = require('../services/EmployeeService');

exports.getEmpByName = async (req, res) => {
    try {
        const { keyword } = req.query;

        const response = await searchEmployees(keyword);
        res.status(200).json(response);
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
};