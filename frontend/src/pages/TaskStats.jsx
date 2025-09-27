"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, AlertCircle, TrendingUp, Calendar } from "lucide-react"

export function TaskStats({ tasks }) {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length
  const todoTasks = tasks.filter((task) => task.status === "todo").length

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate || task.status === "completed") return false
    return new Date(task.dueDate) < new Date()
  }).length

  const highPriorityTasks = tasks.filter((task) => task.priority === "high" && task.status !== "completed").length

  return (
    <div className="space-y-4">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Overview</CardTitle>
          <CardDescription>Your task summary</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completion Rate</span>
              <span className="font-medium">{Math.round(completionRate)}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-foreground">{totalTasks}</div>
              <div className="text-xs text-muted-foreground">Total Tasks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Completed</span>
            </div>
            <span className="font-medium">{completedTasks}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm">In Progress</span>
            </div>
            <span className="font-medium">{inProgressTasks}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <span className="text-sm">To Do</span>
            </div>
            <span className="font-medium">{todoTasks}</span>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {(overdueTasks > 0 || highPriorityTasks > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-orange-600">Attention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overdueTasks > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Overdue</span>
                </div>
                <span className="font-medium text-red-600">{overdueTasks}</span>
              </div>
            )}

            {highPriorityTasks > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">High Priority</span>
                </div>
                <span className="font-medium text-orange-600">{highPriorityTasks}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
