import { NextResponse } from "next/server";

export const revalidate = 3600; // 1 hour

export async function GET() {
  try {
    const res = await fetch(
      "https://api.github.com/search/repositories?q=location:Bangalore&sort=stars&order=desc&per_page=5",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "AdjustMaadi-Portal",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);

    const data = await res.json();
    return NextResponse.json({
      items: data.items?.map((repo: Record<string, unknown>) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        stargazers_count: repo.stargazers_count,
        language: repo.language,
        html_url: repo.html_url,
        owner: {
          login: (repo.owner as Record<string, unknown>)?.login,
          avatar_url: (repo.owner as Record<string, unknown>)?.avatar_url,
        },
      })) || [],
    });
  } catch {
    return NextResponse.json({
      items: [
        { id: 1, name: "namma-yatri", full_name: "juspay/namma-yatri", description: "Open source mobility platform: Bengaluru's gift to open-source transit", stargazers_count: 2100, language: "Haskell", html_url: "https://github.com/juspay/namma-yatri", owner: { login: "juspay", avatar_url: "" } },
        { id: 2, name: "hasura", full_name: "hasura/graphql-engine", description: "Blazing fast, instant realtime GraphQL APIs, built in Bengaluru", stargazers_count: 31000, language: "Haskell", html_url: "https://github.com/hasura/graphql-engine", owner: { login: "hasura", avatar_url: "" } },
      ],
      fallback: true,
    });
  }
}
