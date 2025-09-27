"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TaskForm } from "./task-form"
import { TaskList } from "./task-list"
import { TaskStats } from "./task-stats"
import { UserProfile } from "./user-profile"
import { CheckSquare, Plus, LogOut, User, Filter } from "lucide-react"

export function TaskDashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([])
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all") // "all" | "todo" | "in-progress" | "completed"
  const [editingTask, setEditingTask] = useState(null)

  useEffect(() => {
    // Load tasks from localStorage
    const savedTasks = localStorage.getItem("taskManager_tasks")
    if (savedTasks) {
      const allTasks = JSON.parse(savedTasks)
      setTasks(allTasks.filter((task) => task.userId === user.id))
    }
  }, [user.id])

  const saveTasks = (updatedTasks) => {
    const allTasks = JSON.parse(localStorage.getItem("taskManager_tasks") || "[]")
    const otherUsersTasks = allTasks.filter((task) => task.userId !== user.id)
    const newAllTasks = [...otherUsersTasks, ...updatedTasks]
    localStorage.setItem("taskManager_tasks", JSON.stringify(newAllTasks))
    setTasks(updatedTasks)
  }

  const handleCreateTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      userId: user.id,
    }
    const updatedTasks = [...tasks, newTask]
    saveTasks(updatedTasks)
    setShowTaskForm(false)
  }

  const handleUpdateTask = (taskData) => {
    if (!editingTask) return
    const updatedTask = { ...editingTask, ...taskData }
    const updatedTasks = tasks.map((task) =>
      task.id === editingTask.id ? updatedTask : task
    )
    saveTasks(updatedTasks)
    setEditingTask(null)
    setShowTaskForm(false)
  }

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId)
    saveTasks(updatedTasks)
  }

  const handleStatusChange = (taskId, status) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status } : task
    )
    saveTasks(updatedTasks)
  }

  const filteredTasks =
    filterStatus === "all"
      ? tasks
      : tasks.filter((task) => task.status === filterStatus)

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()

  if (showProfile) {
    return (
      <UserProfile
        user={user}
        onBack={() => setShowProfile(false)}
        onLogout={onLogout}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckSquare className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">TaskFlow</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {user.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProfile(true)}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Profile
              </Button>

              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>

              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Stats Sidebar */}
          <div className="lg:col-span-1">
            <TaskStats tasks={tasks} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <div className="flex gap-2">
                  {["all", "todo", "in-progress", "completed"].map((status) => (
                    <Button
                      key={status}
                      variant={filterStatus === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus(status)}
                      className="capitalize"
                    >
                      {status === "all" ? "All Tasks" : status.replace("-", " ")}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => {
                  setEditingTask(null)
                  setShowTaskForm(true)
                }}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Task
              </Button>
            </div>

            {/* Task Form */}
            {showTaskForm && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingTask ? "Edit Task" : "Create New Task"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TaskForm
                    task={editingTask}
                    onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                    onCancel={() => {
                      setShowTaskForm(false)
                      setEditingTask(null)
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Task List */}
            <TaskList
              tasks={filteredTasks}
              onEdit={(task) => {
                setEditingTask(task)
                setShowTaskForm(true)
              }}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
