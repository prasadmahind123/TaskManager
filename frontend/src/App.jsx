

import { useState, useEffect } from "react"
import { LoginForm } from "./components/LoginForm"
import { RegistrationForm } from "./components/RegistrationForm"
import { TaskDashboard } from "./pages/TaskDashboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare, Users, Calendar, BarChart3 } from "lucide-react"

export default function App() {
  const [user, setUser] = useState(null)
  const [showLogin, setShowLogin] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem("taskManager_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem("taskManager_user", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("taskManager_user")
    localStorage.removeItem("taskManager_tasks")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (user) {
    return <TaskDashboard user={user} onLogout={handleLogout} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckSquare className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">TaskFlow</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline your productivity with our intuitive task management platform
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>Team Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Work together seamlessly with shared tasks and real-time updates
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>Smart Scheduling</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Organize tasks with due dates, priorities, and custom categories
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor your productivity with detailed analytics and insights
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Auth Forms */}
        <div className="max-w-md mx-auto">
          <div className="flex gap-2 mb-6">
            <Button
              variant={showLogin ? "default" : "outline"}
              onClick={() => setShowLogin(true)}
              className="flex-1"
            >
              Sign In
            </Button>
            <Button
              variant={!showLogin ? "default" : "outline"}
              onClick={() => setShowLogin(false)}
              className="flex-1"
            >
              Sign Up
            </Button>
          </div>

          {showLogin ? (
            <LoginForm onLogin={handleLogin} />
          ) : (
            <RegistrationForm onRegister={handleLogin} />
          )}
        </div>
      </div>
    </div>
  )
}
