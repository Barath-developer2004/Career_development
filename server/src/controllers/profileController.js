const asyncHandler = require("express-async-handler");

const ALFA_BASE = "https://alfa-leetcode-api.onrender.com";

// ── GET /api/coding-profile/leetcode/:username ────────────────────────────────
exports.getLeetCodeStats = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const headers = { "Accept": "application/json" };
  const timeout = 12000;

  // Helper: fetch with timeout
  const fetchWithTimeout = (url) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    return fetch(url, { headers, signal: controller.signal })
      .finally(() => clearTimeout(id));
  };

  // Fire all three requests in parallel
  // /{username}           → profile (name, ranking, avatar …)
  // /userProfile/{username} → solved counts + submission arrays
  // /{username}/contest    → contest rating/ranking
  const [profileRes, solvedRes, contestRes] = await Promise.allSettled([
    fetchWithTimeout(`${ALFA_BASE}/${username}`),
    fetchWithTimeout(`${ALFA_BASE}/userProfile/${username}`),
    fetchWithTimeout(`${ALFA_BASE}/${username}/contest`),
  ]);

  // Parse helpers
  const parseJson = async (settled) => {
    if (settled.status !== "fulfilled" || !settled.value.ok) return null;
    try { return await settled.value.json(); } catch { return null; }
  };

  const [profile, solved, contest] = await Promise.all([
    parseJson(profileRes),
    parseJson(solvedRes),
    parseJson(contestRes),
  ]);

  // If the core profile/solved data is missing, user likely doesn't exist
  if (!profile && !solved) {
    return res.status(404).json({ success: false, message: "LeetCode user not found. Check the username and try again." });
  }

  const totalSolved = solved?.totalSolved ?? 0;
  const easySolved  = solved?.easySolved  ?? 0;
  const medSolved   = solved?.mediumSolved ?? 0;
  const hardSolved  = solved?.hardSolved  ?? 0;

  // totalSubmissions is an array: [{difficulty:"All", count:N, submissions:N}, ...]
  const totalSubsObj = Array.isArray(solved?.totalSubmissions)
    ? solved.totalSubmissions.find((s) => s.difficulty === "All")
    : null;
  const totalSubs = totalSubsObj?.submissions ?? totalSubsObj?.count ?? 0;
  const acceptanceRate = totalSubs > 0 ? Math.round((totalSolved / totalSubs) * 1000) / 10 : 0;

  res.json({
    success: true,
    data: {
      username:         profile?.username   ?? solved?.username  ?? username,
      realName:         profile?.name       ?? "",
      avatar:           profile?.avatar     ?? "",
      totalSolved,
      totalSubmissions: totalSubs,
      acceptanceRate,
      easy:             easySolved,
      medium:           medSolved,
      hard:             hardSolved,
      ranking:          profile?.ranking    ?? solved?.ranking   ?? 0,
      reputation:       profile?.reputation ?? solved?.reputation ?? 0,
      activeBadge:      null,
      contest: contest?.contestRating != null
        ? {
            attended:      contest.contestAttend          ?? 0,
            rating:        Math.round(contest.contestRating ?? 0),
            globalRanking: contest.contestGlobalRanking   ?? 0,
            topPercentage: contest.contestTopPercentage != null
              ? Math.round(contest.contestTopPercentage * 10) / 10
              : null,
          }
        : null,
    },
  });
});

// ── GET /api/coding-profile/github/:username ──────────────────────────────────
exports.getGitHubStats = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const headers = { "User-Agent": "CareerX-App" };

  const [profileRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers }),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers }),
  ]);

  if (!profileRes.ok) {
    return res
      .status(profileRes.status)
      .json({ success: false, message: "GitHub user not found" });
  }

  const profile = await profileRes.json();
  const repos   = reposRes.ok ? await reposRes.json() : [];

  const langMap   = {};
  let totalStars  = 0;
  let totalForks  = 0;

  (Array.isArray(repos) ? repos : []).forEach((repo) => {
    if (repo.language) {
      langMap[repo.language] = (langMap[repo.language] ?? 0) + 1;
    }
    totalStars += repo.stargazers_count ?? 0;
    totalForks += repo.forks_count ?? 0;
  });

  const topLanguages = Object.entries(langMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([lang, count]) => ({ lang, count }));

  res.json({
    success: true,
    data: {
      username: profile.login,
      name: profile.name ?? "",
      avatarUrl: profile.avatar_url,
      bio: profile.bio ?? "",
      publicRepos: profile.public_repos ?? 0,
      followers: profile.followers ?? 0,
      following: profile.following ?? 0,
      totalStars,
      totalForks,
      topLanguages,
      profileUrl: profile.html_url,
      createdAt: profile.created_at,
    },
  });
});
