import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./components/AuthLayout";
import Login from "./pages/Login";
import Index from "./pages/Index";
import ProjectDetail from "./pages/ProjectDetail";
import ConsultantDetail from "./pages/ConsultantDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AuthLayout><Index /></AuthLayout>} />
          <Route path="/project/:id" element={<AuthLayout><ProjectDetail /></AuthLayout>} />
          <Route path="/consultant/:email" element={<AuthLayout><ConsultantDetail /></AuthLayout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;