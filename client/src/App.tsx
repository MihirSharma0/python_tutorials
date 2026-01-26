import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Navbar } from "@/components/Navbar";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import DonorDashboard from "@/pages/DonorDashboard";
import NgoDashboard from "@/pages/NgoDashboard";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

// Protected Route Wrapper
function ProtectedRoute({ 
  component: Component, 
  allowedRole 
}: { 
  component: React.ComponentType, 
  allowedRole?: "donor" | "ngo" 
}) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) {
      setLocation("/login");
    } else if (allowedRole && user.role !== allowedRole) {
      // Redirect to correct dashboard if wrong role
      setLocation(user.role === "donor" ? "/donor" : "/ngo");
    }
  }, [user, allowedRole, setLocation]);

  if (!user || (allowedRole && user.role !== allowedRole)) return null;

  return <Component />;
}

function Router() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main>
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/login" component={Login} />
          
          <Route path="/donor">
            <ProtectedRoute component={DonorDashboard} allowedRole="donor" />
          </Route>
          
          <Route path="/ngo">
            <ProtectedRoute component={NgoDashboard} allowedRole="ngo" />
          </Route>

          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
