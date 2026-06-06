const PROGRESS_KEY_PREFIX = 'study_m_theory_progress';

function getProgressKey(user) {
  const userKey = user?.id || user?.email;
  return userKey ? `${PROGRESS_KEY_PREFIX}_${userKey}` : PROGRESS_KEY_PREFIX;
}

export function getTheoryProgress(user) {
  const raw = localStorage.getItem(getProgressKey(user));

  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function markTheoryCompleted(topicId, user) {
  const progress = getTheoryProgress(user);

  if (!progress.includes(topicId)) {
    progress.push(topicId);
    localStorage.setItem(getProgressKey(user), JSON.stringify(progress));
  }
}
