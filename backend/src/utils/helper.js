require("dotenv/config");
const { QUESTIONS } = require("../models/question.model");
const genAI = require("../config/gemini-ai");

const calculateCompatibility = (brideAnswers, groomAnswers, ageRange) => {
  if (!brideAnswers || !groomAnswers) {
    return { score: 0, categoryScores: {} };
  }

  const brideOwn = {};
  const groomOwn = {};
  const brideGuesses = {};
  const groomGuesses = {};

  // Extract answers and guesses - with safe access
  if (Array.isArray(brideAnswers.own_answers)) {
    brideAnswers.own_answers.forEach((answer) => {
      if (answer && answer.question_id) {
        brideOwn[answer.question_id] = answer.answer;
      }
    });
  }

  if (Array.isArray(groomAnswers.own_answers)) {
    groomAnswers.own_answers.forEach((answer) => {
      if (answer && answer.question_id) {
        groomOwn[answer.question_id] = answer.answer;
      }
    });
  }

  if (Array.isArray(brideAnswers.partner_guesses)) {
    brideAnswers.partner_guesses.forEach((guess) => {
      if (guess && guess.question_id) {
        brideGuesses[guess.question_id] = guess.guessed_answer;
      }
    });
  }

  if (Array.isArray(groomAnswers.partner_guesses)) {
    groomAnswers.partner_guesses.forEach((guess) => {
      if (guess && guess.question_id) {
        groomGuesses[guess.question_id] = guess.guessed_answer;
      }
    });
  }

  const categoryScores = {};
  let totalMatches = 0;
  let totalQuestions = 0;

  const questionsData = QUESTIONS[ageRange] || { main_questions: {} };
  Object.values(questionsData.main_questions).forEach((question) => {
    const { id, category } = question;

    // Check if bride guessed groom's answer correctly
    const brideGuessCorrect = brideGuesses[id] === groomOwn[id];
    // Check if groom guessed bride's answer correctly
    const groomGuessCorrect = groomGuesses[id] === brideOwn[id];

    const matches = (brideGuessCorrect ? 1 : 0) + (groomGuessCorrect ? 1 : 0);
    categoryScores[category] = (matches / 2) * 100;

    totalMatches += matches;
    totalQuestions += 2;
  });

  const score = totalQuestions > 0 ? (totalMatches / totalQuestions) * 100 : 0;
  return { score, categoryScores };
};

const formatAnswersForAI = (answers, ageRange) => {
  if (!answers) {
    return "No answers provided";
  }

  const result = [];
  const questionsData = QUESTIONS[ageRange] || { main_questions: {} };

  answers.own_answers.forEach((answer) => {
    const question = Object.values(questionsData.main_questions).find(
      (q) => q.id === answer.question_id,
    );
    if (question) {
      result.push(
        `- ${question.category}: ${question.options[answer.answer] || answer.answer}`,
      );
    }
  });

  return result.join("\n") || "No formatted answers";
};

const generateAIRecommendations = async (
  brideAnswers,
  groomAnswers,
  compatibilityScore,
  ageRange,
) => {
  try {
    console.log("Generating AI recommendations...");

    if (!process.env.GEMINI_API_KEY) {
      console.log("Gemini API key not configured");
      return "AI recommendations require a Gemini API key to be configured.";
    }

    const brideFormatted = formatAnswersForAI(brideAnswers, ageRange);
    const groomFormatted = formatAnswersForAI(groomAnswers, ageRange);
    const safeScore =
      typeof compatibilityScore === "number" ? compatibilityScore : 0;

    const prompt = `
You are Svet, a luxury wedding decor consultant.

Analyze this couple's Wedding Slam Book answers and provide elegant decor recommendations.

Bride's Answers:
${brideFormatted}

Groom's Answers:
${groomFormatted}

Compatibility Score: ${safeScore.toFixed(0)}%

Your response must:
1. Identify overall style (Grand vs Intimate)
2. Highlight compatibility insights
3. Suggest 3–5 decor elements
4. Keep tone premium and professional
`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    console.log("AI response received:", response);

    const text = response?.text || "Recommendations generated successfully.";

    console.log("AI text:", text);
    return text;
  } catch (error) {
    console.error("AI generation error:", error);

    return "AI recommendations are currently unavailable. Please try again later.";
  }
};

const generateHTML = (session, score, categoryScores, ageRange) => {
  const safeScore = typeof score === "number" ? score : 0;
  const safeCategoryScores = categoryScores || {};
  const categoriesHTML = Object.entries(safeCategoryScores)
    .map(([category, catScore]) => {
      const safeCatScore = typeof catScore === "number" ? catScore : 0;
      return `
            <div class="category">
                <div class="label">${category}</div>
                <div class="bar">
                    <div class="fill" style="width: ${safeCatScore}%"></div>
                </div>
                <div class="percent">${safeCatScore.toFixed(0)}%</div>
            </div>
            `;
    })
    .join("");

  const predictionsHTML = ""; // Since decor_prediction isn't in the current QUESTIONS structure

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
    body {
        font-family: 'Segoe UI', sans-serif;
        padding: 40px;
        color: #333;
        background: #faf9f7;
    }

    h1 {
        text-align: center;
        letter-spacing: 2px;
    }

    .section {
        margin-top: 30px;
    }

    .title {
        font-size: 18px;
        border-bottom: 2px solid #ddd;
        margin-bottom: 10px;
        padding-bottom: 5px;
    }

    .score {
        font-size: 28px;
        font-weight: bold;
        text-align: center;
        margin: 20px 0;
    }

    .category {
        margin-bottom: 10px;
    }

    .label {
        font-weight: 600;
    }

    .bar {
        background: #eee;
        height: 8px;
        border-radius: 5px;
        overflow: hidden;
    }

    .fill {
        height: 100%;
        background: linear-gradient(to right, #d4af37, #f7e7a1);
    }

    .percent {
        font-size: 12px;
    }

    .prediction {
        margin-bottom: 10px;
    }

    .footer {
        margin-top: 40px;
        text-align: center;
        font-size: 12px;
        color: #888;
    }
</style>
</head>

<body>

<h1>VOWS & VOLUMES</h1>
<p style="text-align:center;">Luxury Wedding Compatibility Report</p>

<div class="section">
    <div class="title">Compatibility Score</div>
    <div class="score">${safeScore.toFixed(0)}%</div>
</div>

<div class="section">
    <div class="title">Category Breakdown</div>
    ${categoriesHTML}
</div>

<div class="section">
    <div class="title">AI Decor Recommendations</div>
    <p>${session.ai_recommendations || "Recommendations pending..."}</p>
</div>

<div class="section">
    <div class="title">Session Info</div>
    <p><strong>Share Code:</strong> ${session.share_code}</p>
    <p><strong>Created:</strong> ${new Date(session.createdAt).toLocaleString()}</p>
</div>

<div class="footer">
    Generated with ♡ by Vows & Volumes
</div>

</body>
</html>
`;
};

module.exports = {
  calculateCompatibility,
  generateAIRecommendations,
  formatAnswersForAI,
  generateHTML,
};
