"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

interface RoomFormProps {
  onJoinRoom?: (roomName: string) => void;
  onCreateRoom?: () => void;
}

export default function RoomForm({ onJoinRoom, onCreateRoom }: RoomFormProps) {
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState<"join" | "create" | null>(null);
  const router = useRouter();
  const validateRoomName = (name: string): boolean => {
    if (!name.trim()) {
      setError("Room name is required");
      return false;
    }
    if (name.trim().length < 3) {
      setError("Room name must be at least 3 characters");
      return false;
    }
    if (name.trim().length > 30) {
      setError("Room name must be less than 30 characters");
      return false;
    }
    if (!/^[a-zA-Z0-9\s-_]+$/.test(name.trim())) {
      setError(
        "Room name can only contain letters, numbers, spaces, hyphens, and underscores"
      );
      return false;
    }
    return true;
  };

  const handleJoinRoom = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateRoomName(roomName)) return;

    setIsLoading("join");
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return alert("Not authorized. Please Signin first !");
      }
      const res = await axios.get(
        `http://localhost:3001/join-room/${roomName}`,
        {
          headers: {
            authorization: token,
          },
        }
      );

      if (res.status === 201) {
        const roomId = res.data.roomId;
        alert("Joined room successfullt");
        router.push(`/canvas/${roomId}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          alert("Room not found");
        } else if (error.response?.status === 401) {
          alert("Unauthorized");
        } else {
          alert("Something went wrong. Please try again later");
        }
      }
    } finally {
      setIsLoading(null);
    }
  };

  const handleCreateRoom = async () => {
    setIsLoading("create");
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return alert("Not authorized. Please Signin first !");
      }
      const res = await axios.post(
        `http://localhost:3001/create-room`,
        {
          name: roomName,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (res.status === 201) {
        alert("Room created successfully");
        const roomId = res.data.roomId;
        router.push(`/canvas/${roomId}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          alert(
            "Room with same name already exists. Please try a different name"
          );
        } else if (error.response?.status === 403) {
          alert("Invalid input. Please check the form");
        } else {
          alert("Something went wrong. Please try again later");
        }
      }
    } finally {
      setIsLoading(null);
    }
  };

  const handleInputChange = (value: string) => {
    setRoomName(value);
    if (error) {
      setError("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Join a Room
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Enter a room name to join an existing room or create a new one
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="px-8 pb-8">
          <form onSubmit={handleJoinRoom} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="roomName"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Room Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <input
                  id="roomName"
                  type="text"
                  placeholder="Enter room name..."
                  value={roomName}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-800 dark:text-white transition-all duration-200 placeholder-slate-400 text-lg"
                  disabled={isLoading !== null}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-0 group-focus-within:opacity-10 transition-opacity duration-200 pointer-events-none"></div>
              </div>
              {error && (
                <div className="flex items-center space-x-2 text-red-500 text-sm mt-2">
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                type="submit"
                disabled={isLoading !== null}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
              >
                {isLoading === "join" ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Joining Room...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Join Room</span>
                  </div>
                )}
              </button>

              {/* Separator */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 font-medium">
                    or
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCreateRoom}
                disabled={isLoading !== null}
                className="w-full py-4 px-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
              >
                {isLoading === "create" ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-5 h-5 border-2 border-slate-400/30 border-t-slate-600 dark:border-slate-300/30 dark:border-t-slate-300 rounded-full animate-spin"></div>
                    <span>Creating Room...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span>Create New Room</span>
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <p className="font-medium">Room Name Guidelines:</p>
                <ul className="space-y-1 text-xs">
                  <li>• 3-30 characters long</li>
                  <li>
                    • Letters, numbers, spaces, hyphens, and underscores only
                  </li>
                  <li>• Case sensitive</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
