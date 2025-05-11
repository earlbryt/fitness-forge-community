
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ModernAppLayout from "./components/layout/ModernAppLayout";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Challenges from "./pages/Challenges";
import Leaderboard from "./pages/Leaderboard";
import TipsAndTricks from "./pages/TipsAndTricks";
import Social from "./pages/Social";
import Reminders from "./pages/Reminders";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import SupabaseTest from "./pages/SupabaseTest";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from "./lib/auth";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/app" element={<ModernAppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="workouts" element={<Workouts />} />
                <Route path="challenges" element={<Challenges />} />
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="tips" element={<TipsAndTricks />} />
                <Route path="social" element={<Social />} />
                <Route path="reminders" element={<Reminders />} />
                <Route path="supabase" element={<SupabaseTest />} />
              </Route>
            </Route>
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
