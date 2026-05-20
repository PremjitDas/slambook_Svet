const Information = require("../models/information.model");

module.exports.createInformation = async (req, res) => {
    try {
        // Create a new information document using the request body
        await Information.create(req.body);
        return res.status(201).json({
            success: true,
        });
    } catch (error) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: error.message
        });
    }
}
