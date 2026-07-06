import { useAuth } from "@/contexts/AuthContext";
import { useGetBuyerDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { ShoppingCart, Timer, Wallet, Star, ChevronRight, Sprout } from "lucide-react";
import { Link } from "wouter";
import { formatCurrency, formatWeight, CROP_EMOJIS, CROP_LABELS } from "@/lib/utils";
import { format } from "date-fns";
function BuyerDashboard() {
  const { user } = useAuth();
  const { data: dashboard, isLoading } = useGetBuyerDashboard();
  if (isLoading) {
    return <div className="p-8">Loading dashboard...</div>;
  }
  if (!dashboard) return null;
  return <div className="flex-1 bg-muted/30 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Welcome back, {user?.name.split(" ")[0]}</h1>
            <p className="text-muted-foreground mt-1">Manage your supply chain and orders.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/marketplace">
              <Button size="lg" className="w-full md:w-auto shadow-md">
                <ShoppingCart className="mr-2 h-5 w-5" /> Browse Market
              </Button>
            </Link>
          </div>
        </div>

        {
    /* Top Stats */
  }
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground font-medium">Total Spent</span>
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div className="text-3xl font-serif font-bold text-foreground">{formatCurrency(dashboard.totalSpent)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground font-medium">Active Orders</span>
                <ShoppingCart className="h-5 w-5 text-secondary" />
              </div>
              <div className="text-3xl font-serif font-bold text-foreground">{dashboard.activeOrders}</div>
              <div className="mt-2 text-sm text-muted-foreground">Out of {dashboard.totalOrders} total</div>
            </CardContent>
          </Card>

          <Card className="bg-destructive/10 border-destructive/20 relative overflow-hidden group">
            <Link href="/marketplace?tab=fresh_rescue" className="absolute inset-0 z-10" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-destructive font-medium">Fresh Rescue Alerts</span>
                <Timer className="h-5 w-5 text-destructive animate-pulse" />
              </div>
              <div className="text-3xl font-serif font-bold text-destructive">{dashboard.freshRescueAlerts}</div>
              <div className="mt-2 text-sm font-medium text-destructive/80 flex items-center group-hover:underline">
                View deals <ChevronRight className="h-3 w-3 ml-1" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground font-medium">Saved Farmers</span>
                <Star className="h-5 w-5 text-accent fill-accent" />
              </div>
              <div className="text-3xl font-serif font-bold text-foreground">{dashboard.savedFarmers || 0}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/10 pb-4">
                <CardTitle className="text-xl font-serif">Recent Orders</CardTitle>
                <Link href="/orders" className="text-sm font-medium text-primary flex items-center hover:underline">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                {dashboard.recentOrders && dashboard.recentOrders.length > 0 ? <div className="divide-y">
                    {dashboard.recentOrders.map((order) => <Link key={order.id} href={`/orders/${order.id}`}>
                        <div className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center text-xl shadow-sm border border-secondary/20">
                              {CROP_EMOJIS[order.crop] || "\u{1F4E6}"}
                            </div>
                            <div>
                              <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                                {formatWeight(order.quantityKg)} {CROP_LABELS[order.crop] || order.crop}
                              </p>
                              <p className="text-sm text-muted-foreground">From: {order.farmerName} • {format(new Date(order.createdAt), "MMM d, yyyy")}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-foreground">{formatCurrency(order.totalAmount)}</p>
                            <Badge variant={order.status === "delivered" || order.status === "completed" ? "secondary" : order.status === "cancelled" ? "destructive" : "default"} className="mt-1 capitalize">
                              {order.status.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>
                      </Link>)}
                  </div> : <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mb-3" />
                    <p>No recent orders found.</p>
                    <Link href="/marketplace" className="mt-4">
                      <Button variant="outline">Browse Marketplace</Button>
                    </Link>
                  </div>}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
             {
    /* Sourcing regions or recommended */
  }
             <Card>
                <CardHeader className="pb-3 border-b bg-muted/10">
                  <CardTitle className="text-lg font-serif flex items-center gap-2">
                    <Sprout className="h-5 w-5 text-secondary" /> Preferred Regions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {dashboard.favoriteRegions && dashboard.favoriteRegions.length > 0 ? dashboard.favoriteRegions.map((region) => <Badge key={region} variant="secondary" className="px-3 py-1 font-medium">{region}</Badge>) : <span className="text-sm text-muted-foreground">No preferred regions set.</span>}
                  </div>
                </CardContent>
              </Card>
          </div>
        </div>
      </div>
    </div>;
}
export {
  BuyerDashboard
};
