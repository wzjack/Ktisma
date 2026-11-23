// Ktisma Capital Group: settings and quiz content.
// Loaded before quiz.js. Change the values below; the quiz logic lives in quiz.js.

// ---- Settings you can change ----
const CONFIG = {
  // Where to send submitted leads. Examples: a Formspree, Make, Zapier or Cloudflare Worker URL.
  // The page POSTs JSON to this address. Leave empty to test without sending anything.
  formEndpoint: "",
  minimumInvestment: "$50,000"
};

// ---- Questions (edit freely) ----
const STEPS = [
  {
    id: "investor_type",
    question: "Which of these best describes you?",
    options: [
      "Accredited (net worth): $1M+ excluding primary residence",
      "Accredited (income): $200k+ ($300k+ with spouse)",
      "Licensed: Series 7, 65, or 82",
      "Qualified purchaser: $5M+ investable assets",
      "None of the above"
    ],
    blockOn: "None of the above"
  },
  {
    id: "experience",
    question: "Have you invested in multifamily developments or real estate before?",
    options: ["Yes", "No"]
  },
  {
    id: "priority",
    question: "What matters most to you in your next investment?",
    options: ["Cash flow", "Equity growth", "Tax efficiency"]
  },
  {
    id: "timeline",
    question: "When are you looking to invest?",
    options: ["I’m ready now", "Within the next 30 days", "1 to 3 months", "3+ months"]
  },
  {
    id: "amount",
    question: "The minimum investment is " + CONFIG.minimumInvestment + ". How much are you looking to place?",
    options: ["$50k–$100k", "$100k–$250k", "$250k–$1M", "$1M+"]
  }
];
