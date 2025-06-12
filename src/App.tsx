import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LoginPage } from "@/components/LoginPage";
import { SignupPage } from "@/components/SignupPage";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/components/Dashboard";
import { PurchasesPage } from "@/components/PurchasesPage";
import { TransferPage } from "@/components/TransferPage";
import { AssignmentsPage } from "@/components/AssignmentsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="purchases" element={<PurchasesPage />} />
              <Route path="transfers" element={<TransferPage />} />
              <Route path="assignments" element={
                <ProtectedRoute requiredRole={['admin', 'base_commander']}>
                  <AssignmentsPage />
                </ProtectedRoute>
              } />
              <Route path="reports" element={
                <ProtectedRoute requiredRole={['admin', 'base_commander']}>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold mb-4">Reports</h1>
                    <p className="text-slate-600">Reporting interface coming soon</p>
                  </div>
                </ProtectedRoute>
              } />
            </Route>
            
            <Route path="/unauthorized" element={
              <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4 text-red-600">Access Denied</h1>
                  <p className="text-xl text-slate-600 mb-4">You don't have permission to access this resource</p>
                  <a href="/dashboard" className="text-blue-500 hover:text-blue-700 underline">
                    Return to Dashboard
                  </a>
                </div>
              </div>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
