const Session = require("../models/session.model");
const { QUESTIONS } = require("../models/question.model");
const {
  calculateCompatibility,
  generateAIRecommendations,
  generateHTML,
} = require("../utils/helper");
const { v4: uuidv4 } = require("uuid");
const puppeteer = require("puppeteer");
const razorpayInstance = require("../config/razorpay");
const crypto = require("crypto");

const createSession = async (req, res) => {
  try {
    const { partner_name, role, age_range } = req.body;

    if (!partner_name || !role || !age_range) {
      return res
        .status(400)
        .json({ error: "Partner name, role, and age range are required" });
    }

    const validAgeRanges = ["18-24", "24-30", "30-40", "40-60"];
    if (!validAgeRanges.includes(age_range)) {
      return res
        .status(400)
        .json({
          error:
            "Invalid age range. Must be one of: 18-24, 24-30, 30-40, 40-60",
        });
    }

    const share_code = uuidv4().substring(0, 8).toUpperCase();
    const session = await Session.create({
      share_code: share_code,
      partner_name: partner_name,
      age_range: age_range,
      created_by: role,
    });

    await session.save();

    return res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getSession = async (req, res) => {
  try {
    const { share_code } = req.params;

    const session = await Session.findOne({ share_code: share_code });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve session",
      error: error.message,
    });
  }
};

const submitAnswers = async (req, res) => {
  try {
    const { share_code } = req.params;
    const { role, own_answers, partner_guesses, bonus_answers } = req.body;

    if (!role || !own_answers || !partner_guesses || !bonus_answers) {
      return res.status(400).json({
        success: false,
        message:
          "Role, own answers, partner guesses, and bonus answers are required",
      });
    }

    const session = await Session.findOne({ share_code: share_code });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    const answersData = { own_answers, partner_guesses, bonus_answers };

    if (role === "bride") {
      session.bride_answers = answersData;
      session.bride_completed = true;
    } else if (role === "groom") {
      session.groom_answers = answersData;
      session.groom_completed = true;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Role must be either "bride" or "groom"',
      });
    }

    session.updatedAt = new Date();
    await session.save();

    if (session.bride_completed && session.groom_completed) {
      const { score, categoryScores } = calculateCompatibility(
        session.bride_answers,
        session.groom_answers,
        session.age_range,
      );

      let aiRecommendations = "Generating recommendations...";
      try {
        aiRecommendations = await generateAIRecommendations(
          session.bride_answers,
          session.groom_answers,
          score,
          session.age_range,
        );
      } catch (aiError) {
        console.error("AI recommendation error:", aiError);
        aiRecommendations = "AI recommendations are temporarily unavailable.";
      }

      session.compatibility_score = score;
      session.ai_recommendations = aiRecommendations;
      await session.save();
    }

    return res.status(200).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} answers submitted`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit answers",
      error: error.message,
    });
  }
};

const getResults = async (req, res) => {
  try {
    const { share_code } = req.params;

    const session = await Session.findOne({ share_code: share_code });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    if (!session.bride_completed || !session.groom_completed) {
      return res.status(400).json({
        success: false,
        message: "Both partners must complete the quiz first",
      });
    }

    const { score, categoryScores } = calculateCompatibility(
      session.bride_answers,
      session.groom_answers,
      session.age_range,
    );

    return res.status(200).json({
      success: true,
      data: {
        compatibility_score: score,
        category_scores: categoryScores,
        ai_recommendations:
          session.ai_recommendations || "Generating recommendations...",
        bride_answers: session.bride_answers,
        groom_answers: session.groom_answers,
        partner_name: session.partner_name,
        created_by: session.created_by,
        age_range: session.age_range,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve results",
      error: error.message,
    });
  }
};

const generatePDF = async (req, res) => {
  try {
    const { share_code } = req.params;

    const session = await Session.findOne({ share_code });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    if (!session.bride_completed || !session.groom_completed) {
      return res.status(400).json({
        success: false,
        message: "Both partners must complete the quiz first",
      });
    }

    if (!session.is_paid) {
      return res.status(402).json({
        success: false,
        message: "Payment required to generate PDF",
      });
    }

    const { score, categoryScores } = calculateCompatibility(
      session.bride_answers,
      session.groom_answers,
      session.age_range,
    );

    const html = generateHTML(
      session,
      score,
      categoryScores,
      session.age_range,
    );

    const browser = await puppeteer.launch({
      headless: "new",
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "domcontentloaded",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=wedding-slambook-${share_code}.pdf`,
    );
    res.setHeader("Content-Type", "application/pdf");
    return res.status(200).send(pdfBuffer); // send(), not json()
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate PDF",
      error: error.message,
    });
  }
};

const checkOut = async (req, res) => {
  try {
    const { share_code } = req.params;
    const session = await Session.findOne({ share_code });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    const { name, email, phone } = req.body;
    const options = {
      amount: +req.body.amount,
      currency: req.body.currency,
      notes: {
        ...req.body.notes,
        name,
        email,
        contact: "+91" + phone,
      },
      receipt: req.body.receipt || `receipt_${share_code}_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    session.razorpay_order_id = order.id;
    await session.save();

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Checkout failed",
      error: error.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      const session = await Session.findOneAndUpdate(
        { razorpay_order_id },
        {
          is_paid: true,
          razorpay_payment_id,
          razorpay_signature,
        },
        { new: true },
      );

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        data: session,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Verification failed",
      error: error.message,
    });
  }
};

module.exports = {
  createSession,
  getSession,
  submitAnswers,
  getResults,
  generatePDF,
  checkOut,
  verifyPayment,
};
