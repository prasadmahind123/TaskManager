"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TaskForm } from "./TaskForm"
import { TaskList } from "./TaskList"
import { TaskStats } from "./TaskStats"
import { UserProfile } from "./UseraProfile"
import { CheckSquare, Plus, LogOut, User, Filter } from "lucide-react"
import axios from "axios";
import { getTasks, createTask, updateTask, deleteTask } from "../context/AppContext.jsx" // Adjust the import path as necessary

export function TaskDashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([])
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all") // "all" | "todo" | "in-progress" | "completed"
  const [editingTask, setEditingTask] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        const data = await getTasks()
        console.log("Fetched tasks:", data)
        setTasks(data)
      } catch (err) {
        console.error("Error fetching tasks:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [])


  const saveTasks = (updatedTasks) => {
    const allTasks = JSON.parse(localStorage.getItem("taskManager_tasks") || "[]")
    const otherUsersTasks = allTasks.filter((task) => task.userId !== user.id)
    const newAllTasks = [...otherUsersTasks, ...updatedTasks]
    localStorage.setItem("taskManager_tasks", JSON.stringify(newAllTasks))
    setTasks(updatedTasks)
  }

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await createTask(taskData)
      setTasks((prev) => [...prev, newTask])
      setShowTaskForm(false)
    } catch (err) {
      console.error("Error creating task:", err)
    }
  }


  const handleUpdateTask = async (taskData) => {
    if (!editingTask) return
    try {
      const updated = await updateTask(editingTask.id, taskData)
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? updated : t))
      )
      setEditingTask(null)
      setShowTaskForm(false)
    } catch (err) {
      console.error("Error updating task:", err)
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId)
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
    } catch (err) {
      console.error("Error deleting task:", err)
    }
  }

  const handleStatusChange = async (taskId, status) => {
    try {
      const task = tasks.find((t) => t.id === taskId)
      const updated = await updateTask(taskId, { ...task, status })
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updated : t))
      )
    } catch (err) {
      console.error("Error updating status:", err)
    }
  }

  const filteredTasks = tasks.filter(
    (task) => filterStatus === "all" || task.status === filterStatus
  )

  // const getInitials = (name) =>
  //   name
  //     .split(" ")
  //     .map((n) => n[0])
  //     .join("")
  //     .toUpperCase()

  if (showProfile) {
    return <UserProfile user={user} onBack={() => setShowProfile(false)} onLogout={onLogout} />
  }

  return (
   <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckSquare className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">TaskFlow</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {user.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setShowProfile(true)} className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </Button>

            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">{(user.name)}</AvatarFallback>
            </Avatar>

            <Button variant="ghost" size="sm" onClick={onLogout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <TaskStats tasks={tasks} />
          </div>

          <div className="lg:col-span-3 space-y-6">
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

            {showTaskForm && (
              <Card>
                <CardHeader>
                  <CardTitle>{editingTask ? "Edit Task" : "Create New Task"}</CardTitle>
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
