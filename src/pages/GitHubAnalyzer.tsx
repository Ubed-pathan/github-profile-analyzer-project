import { useRef, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { subDays, format } from "date-fns";
import { FaGithub } from "react-icons/fa";

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

interface Activity {
  type: string;
  repo: { name: string };
  created_at: string;
  payload: any;
}

interface User {
  avatar_url: string;
  name: string;
  login: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
}

export default function GitHubAnalyzer() {
  const [username, setUsername] = useState("");
  const [searchedUser, setSearchedUser] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [commitData, setCommitData] = useState<
    { date: string; count: number }[]
  >([]);
  const [activeTab, setActiveTab] = useState<"repos" | "activity">("repos");
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const errorRef = useRef<HTMLDivElement | null>(null);

  async function fetchGitHubData(name: string) {
    if (name === searchedUser) return;

    setLoading(true);
    setUser(null);
    setRepos([]);
    setActivity([]);
    setCommitData([]);
    setNotFound(false);
    setErrorMessage("");

    try {
      const [userRes, reposRes, activityRes] = await Promise.all([
        axios.get<User>(`https://api.github.com/users/${name}`),
        axios.get<Repo[]>(
          `https://api.github.com/users/${name}/repos?sort=updated&per_page=100`
        ),
        axios.get<Activity[]>(
          `https://api.github.com/users/${name}/events/public`
        ),
      ]);

      setUser(userRes.data);
      setRepos(reposRes.data);
      setActivity(activityRes.data);
      setSearchedUser(name);

      const dailyCommitsMap = new Map<string, number>();

      activityRes.data.forEach((event) => {
        if (event.type === "PushEvent") {
          const date = format(new Date(event.created_at), "yyyy-MM-dd");
          dailyCommitsMap.set(
            date,
            (dailyCommitsMap.get(date) || 0) +
              (event.payload.commits?.length || 0)
          );
        }
      });

      const last30Days = Array.from({ length: 30 }).map((_, i) => {
        const date = subDays(new Date(), 29 - i);
        const dateStr = format(date, "yyyy-MM-dd");
        return {
          date: dateStr,
          count: dailyCommitsMap.get(dateStr) || 0,
        };
      });

      setCommitData(last30Days);
    } catch (err: any) {
      setNotFound(true);
      if (err.response?.status === 404) {
        setErrorMessage("❌ User not found");
      } else if (err.response?.status === 403) {
        setErrorMessage("🚫 Rate limit exceeded. Please try again later.");
      } else {
        setErrorMessage("⚠️ Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
      setTimeout(() => {
        errorRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Search Bar */}
      <div
        className={`transition-all duration-500 ${
          user
            ? "sticky top-0 z-20 bg-white shadow-md py-4"
            : "h-screen flex items-center"
        }`}
      >
        <div className="w-full max-w-md mx-auto flex flex-col items-center px-4">
          {!user && (
            <h1 className="text-3xl font-bold mb-4 text-center">
              GitHub Profile Analyzer
            </h1>
          )}
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Input
              placeholder="Enter GitHub username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchGitHubData(username)}
              className="flex-1"
            />
            <Button
              onClick={() => fetchGitHubData(username)}
              className="whitespace-nowrap"
            >
              Analyze
            </Button>
          </div>
          {notFound && (
            <div
              ref={errorRef}
              className="mt-4 text-center text-red-500 font-semibold bg-red-50 border border-red-300 px-4 py-2 rounded shadow-sm"
            >
              {errorMessage}
            </div>
          )}
          {loading && (
            <div className="mt-4 flex justify-center">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      {user && !loading && (
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden px-4 max-w-7xl mx-auto gap-6 py-4">
          <div className="w-full md:w-1/3 space-y-4 overflow-visible">
            <Card>
              <CardContent className="p-4 text-center">
                <img
                  src={user.avatar_url}
                  alt="avatar"
                  className="w-24 h-24 mx-auto rounded-full mb-4 shadow-lg"
                />
                <a
                  href={`https://github.com/${user.login}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xl font-bold hover:underline inline-flex items-center justify-center gap-1"
                >
                  {user.name || user.login} <FaGithub className="inline ml-1" />
                </a>
                <p className="text-sm text-gray-500">{user.bio}</p>
                <div className="mt-4 flex justify-around text-center text-sm">
                  <div>
                    <p className="text-lg font-bold">{user.public_repos}</p>
                    <p className="text-gray-500">Repos</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{user.followers}</p>
                    <p className="text-gray-500">Followers</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{user.following}</p>
                    <p className="text-gray-500">Following</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-full md:flex-1 space-y-4 overflow-y-auto">
            <div className="flex border-b sticky top-0 bg-white z-10 overflow-x-auto">
              <button
                onClick={() => setActiveTab("repos")}
                className={`px-4 py-2 font-semibold ${
                  activeTab === "repos"
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-600"
                }`}
              >
                Repositories
              </button>
              <button
                onClick={() => setActiveTab("activity")}
                className={`px-4 py-2 font-semibold ${
                  activeTab === "activity"
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-600"
                }`}
              >
                Activity
              </button>
            </div>

            <div className="min-h-[600px] transition-all w-full">
              {activeTab === "repos" ? (
                <div className="grid gap-4">
                  {repos.slice(0, 8).map((repo) => (
                    <Card key={repo.id}>
                      <CardContent className="p-4 sm:px-6 md:px-10">
                        <a
                          href={repo.html_url}
                          className="text-lg font-bold text-blue-600 hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {repo.name}
                        </a>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-3 break-words">
                          {repo.description || "No description available"}
                        </p>
                        <div className="text-xs text-gray-500 space-x-4 mb-2 flex flex-wrap gap-2">
                          <span>⭐ {repo.stargazers_count}</span>
                          <span>🍴 {repo.forks_count}</span>
                          <span>🧠 {repo.language}</span>
                          <span>
                            🕒 {new Date(repo.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <div className="text-center text-sm text-gray-500">
                    Showing 8 of {user.public_repos} repositories.{" "}
                    <a
                      href={`https://github.com/${user.login}?tab=repositories`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      View all on GitHub
                    </a>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h2 className="text-center font-semibold mb-4">
                        📊 Commits in Last 30 Days
                      </h2>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={commitData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={(date) => date.slice(5)}
                          />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#8747D0" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h2 className="text-center font-semibold mb-4">
                        🕒 Activity Timeline
                      </h2>
                      <div className="space-y-4 border-l-2 border-purple-600 pl-4">
                        {activity.slice(0, 10).map((event, index) => (
                          <div key={index} className="relative">
                            <div className="absolute left-[-10px] top-1 w-3 h-3 bg-purple-600 rounded-full"></div>
                            <div className="ml-2">
                              <p className="text-sm">
                                <strong>{event.type}</strong> on{" "}
                                <strong>{event.repo.name}</strong>
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(event.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
