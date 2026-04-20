"use client";
import { useState } from "react";
import { FolderKanban, Users, ListTodo, Star } from "lucide-react";
import ProjectManagement from "./ProjectManagement";
import EmployeePage from "@/app/tasks/EmployeePage";
import Rating from "@/app/tasks/RatingPage";
import TaskPage from "@/app/tasks/TaskPage";

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState("projects");

  const sidebarItems = [
    {
      id: "projects",
      icon: FolderKanban,
      label: "Projects",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "employees",
      icon: Users,
      label: "Employees",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "tasks",
      icon: ListTodo,
      label: "Tasks",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "ratings",
      icon: Star,
      label: "Ratings",
      color: "from-orange-500 to-yellow-500",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "employees":
        return <EmployeePage />;
      case "ratings":
        return <Rating />;
      case "projects":
        return <ProjectManagement />;
      case "tasks":
        return <TaskPage />;

      case "employees":
        return (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Employees</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <p className="text-gray-600">
                Employees content will be displayed here
              </p>
            </div>
          </div>
        );
      case "tasks":
        return (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Tasks</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <p className="text-gray-600">
                Tasks content will be displayed here
              </p>
            </div>
          </div>
        );
      case "ratings":
        return (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Ratings</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <p className="text-gray-600">
                Ratings content will be displayed here
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            METRICS
          </h1>
        </div>
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === item.id
                    ? `bg-gradient-to-r ${item.color} shadow-lg scale-105`
                    : "hover:bg-gray-700/50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{renderContent()}</div>
      </div>
    </div>
  );
}
