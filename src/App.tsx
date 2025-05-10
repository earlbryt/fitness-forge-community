
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Challenges from "./pages/Challenges";
import Leaderboard from "./pages/Leaderboard";
import TipsAndTricks from "./pages/TipsAndTricks";
import Social from "./pages/Social";
import Reminders from "./pages/Reminders";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="workouts" element={<Workouts />} />
            <Route path="challenges" element={<Challenges />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="tips" element={<TipsAndTricks />} />
            <Route path="social" element={<Social />} />
            <Route path="reminders" element={<Reminders />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
