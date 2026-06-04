const PROGRESS_KEY = 'study_m_theory_progress';

export function getTheoryProgress() {
  const raw = localStorage.getItem(PROGRESS_KEY);

  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function markTheoryCompleted(topicId) {
  const progress = getTheoryProgress();

  if (!progress.includes(topicId)) {
    progress.push(topicId);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }
}