import { useAuth } from "@/contexts/AuthContext";
import { useGetFarmerDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { PlusCircle, Wallet, Sprout, TrendingUp, Package, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { formatCurrency, formatWeight, CROP_EMOJIS, CROP_LABELS } from "@/lib/utils";
import { format } from "date-fns";
function FarmerDashboard() {
  const { user } = useAuth();
  const { data: dashboard, isLoading } = useGetFarmerDashboard();
  if (isLoading) {
    return <div className="p-8">Loading dashboard...</div>;
  }
  if (!dashboard) return null;
  return <div className="flex-1 bg-muted/30 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Welcome back, {user?.name.split(" ")[0]}</h1>
            <p className="text-muted-foreground mt-1">Here's what's happening with your farm today.</p>
          </div>
          <Link href="/farmer/listings/new">
            <Button size="lg" className="w-full md:w-auto shadow-md">
              <PlusCircle className="mr-2 h-5 w-5" /> New Listing
            </Button>
          </Link>
        </div>

        {
    /* Top Stats */
  }
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-primary text-primary-foreground border-transparent shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-primary-foreground/80 font-medium">Total Revenue</span>
                <Wallet className="h-5 w-5 opacity-80" />
              </div>
              <div className="text-3xl font-serif font-bold">{formatCurrency(dashboard.totalRevenue)}</div>
              <div className="mt-2 text-sm text-primary-foreground/80 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" /> +12% this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground font-medium">MoMo Balance</span>
                <Wallet className="h-5 w-5 text-accent" />
              </div>
              <div className="text-3xl font-serif font-bold text-foreground">{formatCurrency(dashboard.momoBalance || 0)}</div>
              <div className="mt-2 text-sm text-muted-foreground">Ready to withdraw</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground font-medium">Active Listings</span>
                <Sprout className="h-5 w-5 text-secondary" />
              </div>
              <div className="text-3xl font-serif font-bold text-foreground">{dashboard.activeListings}</div>
              <div className="mt-2 text-sm text-muted-foreground">Out of {dashboard.totalListings} total</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground font-medium">Pending Orders</span>
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div className="text-3xl font-serif font-bold text-foreground">{dashboard.pendingOrders}</div>
              <div className="mt-2 text-sm text-muted-foreground">{dashboard.completedOrders} completed</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {
    /* Main Content Area */
  }
          <div className="lg:col-span-2 space-y-8">
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
                              <p className="text-sm text-muted-foreground">{order.buyerName} • {format(new Date(order.createdAt), "MMM d, yyyy")}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-foreground">{formatCurrency(order.totalAmount)}</p>
                            <Badge variant="outline" className="mt-1 capitalize">{order.status.replace("_", " ")}</Badge>
                          </div>
                        </div>
                      </Link>)}
                  </div> : <div className="p-8 text-center text-muted-foreground">
                    No recent orders.
                  </div>}
              </CardContent>
            </Card>
          </div>

          {
    /* Sidebar Area */
  }
          <div className="space-y-8">
            <Card className="border-secondary/20 shadow-sm overflow-hidden">
              <div className="bg-secondary/10 px-6 py-4 border-b border-secondary/20">
                <h3 className="font-serif font-bold text-lg text-secondary-foreground">Upcoming Pickups</h3>
              </div>
              <CardContent className="p-0">
                {dashboard.upcomingPickups && dashboard.upcomingPickups.length > 0 ? <div className="divide-y">
                    {dashboard.upcomingPickups.map((pickup, idx) => <div key={idx} className="p-4 flex gap-4">
                        <div className="flex flex-col items-center justify-center bg-muted rounded-md p-2 w-14 shrink-0 text-center">
                          <span className="text-xs font-bold text-muted-foreground uppercase">{format(new Date(pickup.scheduledDate), "MMM")}</span>
                          <span className="text-lg font-bold text-foreground leading-none">{format(new Date(pickup.scheduledDate), "d")}</span>
                        </div>
                        <div>
                          <p className="font-bold text-sm">{formatWeight(pickup.quantityKg)} {CROP_LABELS[pickup.crop] || pickup.crop}</p>
                          <p className="text-xs text-muted-foreground mt-1">For {pickup.buyerName}</p>
                          <p className="text-xs font-medium text-primary mt-1">{pickup.pickupPoint || "Farm Gate"}</p>
                        </div>
                      </div>)}
                  </div> : <div className="p-6 text-center text-sm text-muted-foreground">
                    No upcoming pickups scheduled.
                  </div>}
              </CardContent>
            </Card>

            {dashboard.cropBreakdown && dashboard.cropBreakdown.length > 0 && <Card>
                <CardHeader className="pb-3 border-b bg-muted/10">
                  <CardTitle className="text-lg font-serif">Crop Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {dashboard.cropBreakdown.map((stat, idx) => <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium flex items-center gap-2">
                            <span>{CROP_EMOJIS[stat.crop] || "\u{1F4E6}"}</span> {CROP_LABELS[stat.crop] || stat.crop}
                          </span>
                          <span className="font-bold">{formatCurrency(stat.revenue)}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
    className="bg-primary h-2 rounded-full"
    style={{ width: `${Math.max(10, stat.revenue / dashboard.totalRevenue * 100)}%` }}
  />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>{formatWeight(stat.totalKg)} sold</span>
                          <span>{stat.orders} orders</span>
                        </div>
                      </div>)}
                  </div>
                </CardContent>
              </Card>}
          </div>
        </div>
      </div>
    </div>;
}
export {
  FarmerDashboard
};
