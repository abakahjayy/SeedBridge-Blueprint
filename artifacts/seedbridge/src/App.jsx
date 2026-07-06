import { Route, Switch, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import { LandingPage } from "@/pages/Landing";
import { LoginPage } from "@/pages/Login";
import { RegisterPage } from "@/pages/Register";
import { Marketplace } from "@/pages/Marketplace";
import { FarmerDashboard } from "@/pages/FarmerDashboard";
import { BuyerDashboard } from "@/pages/BuyerDashboard";
import { DriverDashboard } from "@/pages/DriverDashboard";
import { OrderList } from "@/pages/OrderList";
import { OrderDetail } from "@/pages/OrderDetail";
import { ProduceDetail } from "@/pages/ProduceDetail";
import { FarmerListings } from "@/pages/FarmerListings";
import { NewListing } from "@/pages/NewListing";
import { FreshRescue } from "@/pages/FreshRescue";
import { PreHarvest } from "@/pages/PreHarvest";
import NotFound from "@/pages/not-found";
const queryClient = new QueryClient();
function Router() {
  return <AppLayout>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/marketplace" component={Marketplace} />
        
        <Route path="/produce/:id" component={ProduceDetail} />
        
        <Route path="/farmer/dashboard">
          <ProtectedRoute allowedRoles={["farmer"]}><FarmerDashboard /></ProtectedRoute>
        </Route>
        <Route path="/farmer/listings">
          <ProtectedRoute allowedRoles={["farmer"]}><FarmerListings /></ProtectedRoute>
        </Route>
        <Route path="/farmer/listings/new">
          <ProtectedRoute allowedRoles={["farmer"]}><NewListing /></ProtectedRoute>
        </Route>
        
        <Route path="/buyer/dashboard">
          <ProtectedRoute allowedRoles={["buyer"]}><BuyerDashboard /></ProtectedRoute>
        </Route>
        
        <Route path="/driver/dashboard">
          <ProtectedRoute allowedRoles={["driver"]}><DriverDashboard /></ProtectedRoute>
        </Route>
        
        <Route path="/marketplace/fresh-rescue" component={FreshRescue} />
        <Route path="/marketplace/pre-harvest" component={PreHarvest} />

        <Route path="/orders">
          <ProtectedRoute><OrderList /></ProtectedRoute>
        </Route>
        <Route path="/orders/:id">
          <ProtectedRoute><OrderDetail /></ProtectedRoute>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </AppLayout>;
}
function App() {
  return <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>;
}
var stdin_default = App;
export {
  stdin_default as default
};
