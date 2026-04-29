export function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function getSecondsElapsedToday(): number {
  const now = new Date();
  return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
}

export function getSecondsElapsedThisYear(): number {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  return Math.floor((now.getTime() - startOfYear.getTime()) / 1000);
}

export function formatTime(utcTime: string): string {
  try {
    const date = new Date(utcTime);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
      hour12: true,
    });
  } catch {
    return utcTime;
  }
}

export function getTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export function getGreeting(): { kannada: string; english: string } {
  const timeOfDay = getTimeOfDay();
  switch (timeOfDay) {
    case "morning":
      return { kannada: "ಶುಭೋದಯ", english: "Good Morning" };
    case "afternoon":
      return { kannada: "ನಮಸ್ಕಾರ", english: "Hello" };
    case "evening":
      return { kannada: "ಶುಭ ಸಂಜೆ", english: "Good Evening" };
    case "night":
      return { kannada: "ಶುಭ ರಾತ್ರಿ", english: "Good Night" };
  }
}

export function findClosestHistoricalEvent(
  events: { month: number; day: number; title: string; description: string; year?: number; emoji?: string }[]
): { month: number; day: number; title: string; description: string; year?: number; emoji?: string } {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  let closest = events[0];
  let minDiff = Infinity;

  for (const event of events) {
    const diff = Math.abs(
      (event.month - currentMonth) * 30 + (event.day - currentDay)
    );
    if (diff < minDiff) {
      minDiff = diff;
      closest = event;
    }
  }

  return closest;
}
