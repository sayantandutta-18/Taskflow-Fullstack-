/**
 * TaskFlow AI — End-to-End Automated Verification Test Suite
 * Covers Checkpoints 0 through 13.
 */

const BASE_URL = "http://localhost:5000/api";

async function assert(condition, message) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

async function runFullVerification() {
  console.log("==================================================");
  console.log("   TaskFlow AI: Full System Verification Suite   ");
  console.log("==================================================\n");

  const timestamp = Date.now();
  const userA = {
    name: "User Alpha",
    email: `alpha_${timestamp}@example.com`,
    password: "Password123!",
  };
  const userB = {
    name: "User Beta",
    email: `beta_${timestamp}@example.com`,
    password: "Password123!",
  };

  // 1. Auth: Register User A
  console.log("[1/14] Testing User Registration (User A)...");
  const regResA = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userA),
  });
  assert(regResA.status === 201, `Expected 201 Created, got ${regResA.status}`);
  console.log("   ✓ User A registered successfully");

  // 2. Auth: Prevent duplicate email
  console.log("[2/14] Testing Duplicate Email Prevention...");
  const dupRes = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userA),
  });
  assert(dupRes.status === 400, `Expected 400 Bad Request, got ${dupRes.status}`);
  console.log("   ✓ Duplicate email rejected safely");

  // 3. Auth: Login User A and User B
  console.log("[3/14] Testing User Login & JWT Token Issuance...");
  const loginResA = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: userA.email, password: userA.password }),
  });
  const loginDataA = await loginResA.json();
  assert(loginResA.status === 200 && loginDataA.token, "Login A failed");
  const tokenA = loginDataA.token;

  await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userB),
  });
  const loginResB = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: userB.email, password: userB.password }),
  });
  const loginDataB = await loginResB.json();
  const tokenB = loginDataB.token;
  console.log("   ✓ Login succeeded, JWT tokens acquired for both users");

  const headersA = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${tokenA}`,
  };
  const headersB = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${tokenB}`,
  };

  // 4. Protected Routes
  console.log("[4/14] Testing Route Protection Middleware...");
  const unauthRes = await fetch(`${BASE_URL}/tasks`);
  assert(unauthRes.status === 401, `Expected 401 Unauthorized, got ${unauthRes.status}`);
  console.log("   ✓ Unauthenticated requests blocked with 401");

  // 5. Task Templates
  console.log("[5/14] Testing Productivity Templates (GET /api/tasks/templates)...");
  const tmplRes = await fetch(`${BASE_URL}/tasks/templates`, { headers: headersA });
  const templates = await tmplRes.json();
  assert(Array.isArray(templates) && templates.length >= 4, "Templates fetch failed");
  console.log(`   ✓ Retrieved ${templates.length} built-in productivity templates`);

  // 6. Create Task with Subtasks, Notes & Recurrence
  console.log("[6/14] Testing Task Creation with Subtasks, Notes, and Recurrence...");
  const createRes = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: headersA,
    body: JSON.stringify({
      title: "Develop 3D Productivity Scene",
      description: "Implement Three.js scene with accessibility fallbacks",
      category: "Work",
      priority: "High",
      recurrence: "daily",
      notes: "Ensure WebGL context disposal on unmount.",
      dueDate: new Date().toISOString(),
      subtasks: [
        { title: "Scaffold Three.js canvas", completed: false },
        { title: "Implement orbiting rings and particle mesh", completed: false },
      ],
    }),
  });
  const createData = await createRes.json();
  assert(createRes.status === 201, `Expected 201, got ${createRes.status}`);
  const taskA = createData.task;
  assert(taskA.subtasks.length === 2, "Subtasks count mismatch");
  assert(taskA.category === "Work", "Category persistence mismatch");
  assert(taskA.recurrence === "daily", "Recurrence mismatch");
  console.log("   ✓ Task created with full metadata and subtasks");

  // 7. Security: Ownership Isolation
  console.log("[7/14] Testing Ownership Security Isolation...");
  const listResB = await fetch(`${BASE_URL}/tasks`, { headers: headersB });
  const tasksB = await listResB.json();
  assert(!tasksB.some((t) => t._id === taskA._id), "User B saw User A's task!");

  const editResB = await fetch(`${BASE_URL}/tasks/${taskA._id}`, {
    method: "PUT",
    headers: headersB,
    body: JSON.stringify({ title: "Hacked Title" }),
  });
  assert(editResB.status === 404, "User B was not blocked from editing User A's task!");
  console.log("   ✓ Ownership isolation confirmed: cross-user access safely blocked");

  // 8. Subtasks: Add, Toggle & Delete
  console.log("[8/14] Testing Subtask Manipulation (Add, Toggle, Delete)...");
  const addStRes = await fetch(`${BASE_URL}/tasks/${taskA._id}/subtasks`, {
    method: "POST",
    headers: headersA,
    body: JSON.stringify({ title: "Write Playwright tests" }),
  });
  const addStData = await addStRes.json();
  assert(addStData.task.subtasks.length === 3, "Failed to add subtask");
  const newSubtask = addStData.task.subtasks.find((s) => s.title === "Write Playwright tests");

  const toggleStRes = await fetch(
    `${BASE_URL}/tasks/${taskA._id}/subtasks/${newSubtask._id}/toggle`,
    { method: "PATCH", headers: headersA }
  );
  const toggleStData = await toggleStRes.json();
  const toggled = toggleStData.task.subtasks.find((s) => s._id === newSubtask._id);
  assert(toggled.completed === true, "Subtask failed to toggle");

  const delStRes = await fetch(
    `${BASE_URL}/tasks/${taskA._id}/subtasks/${newSubtask._id}`,
    { method: "DELETE", headers: headersA }
  );
  const delStData = await delStRes.json();
  assert(delStData.task.subtasks.length === 2, "Failed to delete subtask");
  console.log("   ✓ Subtasks lifecycle (add, toggle, delete) verified");

  // 9. Task Archive & Restore
  console.log("[9/14] Testing Archive & Restore Endpoints...");
  const archRes = await fetch(`${BASE_URL}/tasks/${taskA._id}/archive`, {
    method: "PATCH",
    headers: headersA,
  });
  const archData = await archRes.json();
  assert(archData.task.archived === true, "Archive failed");

  const restoreRes = await fetch(`${BASE_URL}/tasks/${taskA._id}/restore`, {
    method: "PATCH",
    headers: headersA,
  });
  const restoreData = await restoreRes.json();
  assert(restoreData.task.archived === false, "Restore failed");
  console.log("   ✓ Archive and Restore verified");

  // 10. AI Task Breakdown
  console.log("[10/14] Testing AI Task Breakdown (POST /api/ai/breakdown)...");
  const aiRes = await fetch(`${BASE_URL}/ai/breakdown`, {
    method: "POST",
    headers: headersA,
    body: JSON.stringify({
      title: "Prepare for Physics Midterm Exam",
      description: "Focus on thermodynamics and electromagnetism",
      category: "Study",
    }),
  });
  const aiData = await aiRes.json();
  assert(aiRes.status === 200 && aiData.subtasks && aiData.subtasks.length > 0, "AI breakdown failed");
  console.log(`   ✓ AI Assistant generated ${aiData.subtasks.length} actionable subtasks (source: ${aiData.source})`);

  // 11. AI Daily Planning
  console.log("[11/14] Testing AI Daily Planning (GET /api/ai/plan-day)...");
  const planRes = await fetch(`${BASE_URL}/ai/plan-day`, { headers: headersA });
  const planData = await planRes.json();
  assert(planRes.status === 200 && planData.advice, "AI plan-day failed");
  console.log("   ✓ AI Daily Planner prioritized agenda successfully");

  // 12. Task Completion & Gamification Rewards
  console.log("[12/14] Testing Task Completion & Idempotent Gamification Rewards...");
  const completeRes = await fetch(`${BASE_URL}/tasks/${taskA._id}`, {
    method: "PUT",
    headers: headersA,
    body: JSON.stringify({ status: "Completed" }),
  });
  const completeData = await completeRes.json();
  assert(completeRes.status === 200, "Complete task request failed");
  assert(completeData.rewards && completeData.rewards.earnedXp === 15, "Expected +15 XP for high priority task");
  assert(completeData.nextRecurringTask, "Next recurring task was not spawned!");
  console.log(`   ✓ Task completed: +${completeData.rewards.earnedXp} XP granted, Level ${completeData.rewards.level}, Streak ${completeData.rewards.streak}d`);
  console.log(`   ✓ Next recurring task auto-scheduled for ${new Date(completeData.nextRecurringTask.dueDate).toLocaleDateString()}`);

  // 13. Idempotent Rewards (No Cheat Double XP)
  console.log("[13/14] Testing Reward Idempotence on Repeat Requests...");
  const repeatRes = await fetch(`${BASE_URL}/tasks/${taskA._id}`, {
    method: "PUT",
    headers: headersA,
    body: JSON.stringify({ status: "Completed" }),
  });
  const repeatData = await repeatRes.json();
  assert(repeatData.rewards === null, "Duplicate XP was wrongly granted on repeated request!");
  console.log("   ✓ Idempotence confirmed: repeated completion awarded 0 duplicate XP");

  // 14. Real User Profile Persistence
  console.log("[14/14] Testing Database Profile & Achievements Persistence...");
  const profileRes = await fetch(`${BASE_URL}/auth/profile`, { headers: headersA });
  const profileData = await profileRes.json();
  assert(profileData.xp === 15, `Expected 15 XP in DB, got ${profileData.xp}`);
  assert(profileData.streak === 1, `Expected 1 day streak in DB, got ${profileData.streak}`);
  assert(profileData.achievements.length >= 1, "Achievements not persisted in DB");
  console.log(`   ✓ User Profile confirmed: ${profileData.xp} XP, Level ${profileData.level}, Streak ${profileData.streak}d, ${profileData.achievements.length} achievements`);

  console.log("\n==================================================");
  console.log("   🎉 ALL 14 E2E CHECKPOINT TESTS PASSED (100%)   ");
  console.log("==================================================");
}

runFullVerification().catch((err) => {
  console.error("\n❌ VERIFICATION TEST FAILED:", err.message);
  process.exit(1);
});
