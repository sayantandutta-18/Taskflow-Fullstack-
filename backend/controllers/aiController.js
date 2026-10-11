import Task from "../models/Task.js";

// ==============================
// Smart Heuristic Engine (Fallback)
// ==============================
function generateHeuristicBreakdown(title, description, category) {
  const lower = `${title} ${description || ""}`.toLowerCase();

  let subtasks = [];
  let suggestedPriority = "Medium";
  let suggestedCategory = category || "General";
  let tips = "Tackle the most demanding subtask first during your highest energy window.";

  if (
    lower.includes("study") ||
    lower.includes("exam") ||
    lower.includes("learn") ||
    lower.includes("read") ||
    lower.includes("course") ||
    lower.includes("homework")
  ) {
    suggestedCategory = "Study";
    suggestedPriority = lower.includes("exam") || lower.includes("deadline") ? "High" : "Medium";
    subtasks = [
      "Review syllabus and highlight core textbook chapters",
      "Draft concise Cornell notes / flashcards for key definitions",
      "Complete 3-5 timed practice problems without looking at notes",
      "Self-test recall and log difficult concepts for revision",
    ];
    tips = "Use active recall rather than passive re-reading for maximum retention.";
  } else if (
    lower.includes("code") ||
    lower.includes("build") ||
    lower.includes("dev") ||
    lower.includes("app") ||
    lower.includes("feature") ||
    lower.includes("fix") ||
    lower.includes("bug") ||
    lower.includes("api") ||
    lower.includes("refactor")
  ) {
    suggestedCategory = "Work";
    suggestedPriority = lower.includes("bug") || lower.includes("prod") ? "High" : "Medium";
    subtasks = [
      "Clarify technical requirements and edge cases",
      "Implement core architecture and data model changes",
      "Write unit/integration tests and verify functionality",
      "Perform code review, documentation update, and commit",
    ];
    tips = "Break the implementation into small commits to keep regressions easily traceable.";
  } else if (
    lower.includes("clean") ||
    lower.includes("organize") ||
    lower.includes("room") ||
    lower.includes("house") ||
    lower.includes("desk")
  ) {
    suggestedCategory = "Personal";
    suggestedPriority = "Low";
    subtasks = [
      "Gather cleaning supplies and storage bins",
      "Declutter flat surfaces and sort misplaced items",
      "Wipe down surfaces and sanitize high-touch areas",
      "Empty trash bins and vacuum or sweep floor",
    ];
    tips = "Put on energetic music and set a 20-minute timer for a quick blitz.";
  } else if (
    lower.includes("workout") ||
    lower.includes("gym") ||
    lower.includes("run") ||
    lower.includes("fitness") ||
    lower.includes("exercise") ||
    lower.includes("health")
  ) {
    suggestedCategory = "Health";
    suggestedPriority = "Medium";
    subtasks = [
      "5-minute dynamic joint mobility and warm-up",
      "Core training session (strength or cardio intervals)",
      "Hydrate with 500ml water and perform cooldown stretching",
      "Log workout reps/distance in fitness tracker",
    ];
    tips = "Consistency in habit formation beats intermittent extreme intensity.";
  } else if (
    lower.includes("buy") ||
    lower.includes("shop") ||
    lower.includes("groceries") ||
    lower.includes("order")
  ) {
    suggestedCategory = "Shopping";
    suggestedPriority = "Medium";
    subtasks = [
      "Draft comprehensive grocery / shopping list by aisle",
      "Check pantry and fridge to avoid unnecessary duplicates",
      "Execute shopping trip or complete online order",
      "Unpack goods, store properly, and check receipt",
    ];
    tips = "Stick strictly to your written list to prevent impulsive purchases.";
  } else if (
    lower.includes("budget") ||
    lower.includes("tax") ||
    lower.includes("invoice") ||
    lower.includes("finance") ||
    lower.includes("bill")
  ) {
    suggestedCategory = "Finance";
    suggestedPriority = "High";
    subtasks = [
      "Gather bank statements, receipts, and invoices",
      "Categorize monthly income and fixed recurring expenses",
      "Audit discretionary spend and identify reduction opportunities",
      "Transfer allocated savings to high-yield or investment fund",
    ];
    tips = "Automate your savings transfers immediately upon receiving paychecks.";
  } else {
    if (lower.includes("urgent") || lower.includes("asap") || lower.includes("important")) {
      suggestedPriority = "High";
    }
    subtasks = [
      `Clarify scope, acceptance criteria, and goal for "${title}"`,
      "Gather necessary tools, files, and initial references",
      "Execute primary work phases in focused intervals",
      "Review final outcome against expectations and mark complete",
    ];
  }

  return {
    subtasks,
    suggestedPriority,
    suggestedCategory,
    tips,
  };
}

// ==============================
// Breakdown Task into Subtasks
// ==============================
export const breakdownTask = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const trimmedTitle = title.trim();
    const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;

    if (apiKey) {
      try {
        const prompt = `You are a productivity expert for TaskFlow AI. Given the task title "${trimmedTitle}" and description "${description || "None"}", provide a structured breakdown. Return strictly a JSON object with this exact shape:
{
  "subtasks": ["step 1", "step 2", "step 3", "step 4"],
  "suggestedPriority": "High" or "Medium" or "Low",
  "suggestedCategory": "General" or "Study" or "Work" or "Personal" or "Health" or "Finance" or "Shopping",
  "tips": "one concise actionable productivity tip"
}`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const aiResponse = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        });

        if (aiResponse.ok) {
          const data = await aiResponse.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            return res.status(200).json({
              success: true,
              source: "gemini",
              subtasks: Array.isArray(parsed.subtasks) ? parsed.subtasks : [],
              suggestedPriority: parsed.suggestedPriority || "Medium",
              suggestedCategory: parsed.suggestedCategory || category || "General",
              tips: parsed.tips || "Focus on one subtask at a time without multitasking.",
            });
          }
        }
      } catch (aiErr) {
        console.warn("Gemini API call failed, falling back to heuristic engine:", aiErr.message);
      }
    }

    // Heuristic fallback
    const heuristic = generateHeuristicBreakdown(trimmedTitle, description, category);
    return res.status(200).json({
      success: true,
      source: "heuristic",
      ...heuristic,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// Daily Planning Assistant
// ==============================
export const planDay = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
      status: "Pending",
      archived: false,
    }).sort({ priority: 1, dueDate: 1 });

    if (tasks.length === 0) {
      return res.status(200).json({
        message: "No pending tasks for today. You are all caught up!",
        topPriorities: [],
        secondaryTasks: [],
        advice: "Take time to recharge, plan upcoming goals, or explore new learning skills.",
      });
    }

    const highPriority = tasks.filter((t) => t.priority === "High");
    const mediumPriority = tasks.filter((t) => t.priority === "Medium");
    const lowPriority = tasks.filter((t) => t.priority === "Low");

    const topPriorities = highPriority.slice(0, 3);
    const secondaryTasks = [...highPriority.slice(3), ...mediumPriority].slice(0, 4);
    const quickWins = lowPriority.slice(0, 2);

    return res.status(200).json({
      message: `You have ${tasks.length} pending tasks. Here is your recommended execution plan:`,
      topPriorities,
      secondaryTasks,
      quickWins,
      advice: "Focus on your Top Priorities first using 25-minute Pomodoro intervals.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
