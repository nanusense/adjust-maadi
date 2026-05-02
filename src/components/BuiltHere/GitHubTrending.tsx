"use client";

import { useEffect, useState } from "react";
import { GitBranch, Star } from "lucide-react";

interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
  owner: { login: string; avatar_url: string };
}

const languageColors: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3776AB",
  Go: "#00ADD8",
  Rust: "#CE422B",
  Haskell: "#5E5086",
  Java: "#ED8B00",
  Kotlin: "#7F52FF",
  Swift: "#FA7343",
  Ruby: "#CC342D",
  default: "#8B7355",
};

export function GitHubTrending() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then((data) => setRepos(data.items || []))
      .catch(() => setRepos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="warm-card p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-5">
        <GitBranch size={20} style={{ color: "#2D5016", opacity: 0.7 }} />
        <div>
          <h3 className="font-lora text-xl font-bold" style={{ color: "#2D5016" }}>
            Bengaluru on GitHub
          </h3>
          <p className="text-xs" style={{ color: "#8B7355" }}>
            Top repos from Bengaluru developers
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded animate-pulse" style={{ background: "rgba(45, 80, 22, 0.05)" }} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {repos.map((repo, index) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3 rounded transition-all hover:scale-[1.01] group"
              style={{
                background: "rgba(45, 80, 22, 0.04)",
                border: "1px solid rgba(45, 80, 22, 0.08)",
                textDecoration: "none",
              }}
            >
              <div
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: "rgba(198, 124, 42, 0.15)", color: "#C67C2A" }}
              >
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="font-medium text-sm group-hover:underline"
                    style={{ color: "#2D5016" }}
                  >
                    {repo.full_name}
                  </span>
                  {repo.language && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: `${languageColors[repo.language] || languageColors.default}20`,
                        color: languageColors[repo.language] || languageColors.default,
                      }}
                    >
                      {repo.language}
                    </span>
                  )}
                </div>
                {repo.description && (
                  <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "#8B7355" }}>
                    {repo.description}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0 flex items-center gap-1 text-xs" style={{ color: "#C67C2A" }}>
                <Star size={11} />
                <span>{repo.stargazers_count.toLocaleString()}</span>
              </div>
            </a>
          ))}
        </div>
      )}

      <div
        className="mt-4 text-xs text-center"
        style={{ color: "#8B7355" }}
      >
        Bengaluru developers building for the world
      </div>
    </div>
  );
}
