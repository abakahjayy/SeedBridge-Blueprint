import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGetDriverDashboard } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { Truck, MapPin, Wallet, Navigation, Clock, Package } from 'lucide-react';
import { Link } from 'wouter';
import { formatCurrency, formatWeight } from '@/lib/utils';
import { format } from 'date-fns';

export function DriverDashboard() {
  const { user } = useAuth();
  const { data: dashboard, isLoading } = useGetDriverDashboard();

  if (isLoading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  if (!dashboard) return null;

  return (
    <div className="flex-1 bg-muted/30 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Welcome back, {user?.name.split(' ')[0]}</h1>
            <p className="text-muted-foreground mt-1">Ready to hit the road? Here are your logistics updates.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/driver/routes">
              <Button size="lg" className="w-full md:w-auto shadow-md">
                <Navigation className="mr-2 h-5 w-5" /> Find Routes
              </Button>
            </Link>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-accent text-accent-foreground border-transparent shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium opacity-80">Total Earnings</span>
                <Wallet className="h-5 w-5 opacity-80" />
              </div>
              <div className="text-3xl font-serif font-bold">{formatCurrency(dashboard.totalEarnings)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground font-medium">Deliveries Today</span>
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div className="text-3xl font-serif font-bold text-foreground">{dashboard.completedToday}</div>
              <div className="mt-2 text-sm text-muted-foreground">Out of {dashboard.activeDeliveries + dashboard.completedToday} scheduled</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground font-medium">Milk-Runs Available</span>
                <MapPin className="h-5 w-5 text-secondary" />
              </div>
              <div className="text-3xl font-serif font-bold text-foreground">{dashboard.milkRunsAvailable || 0}</div>
              <div className="mt-2 text-sm text-muted-foreground">In your region</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground font-medium">Backhaul Slots</span>
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-3xl font-serif font-bold text-foreground">{dashboard.backhaulSlots || 0}</div>
              <div className="mt-2 text-sm text-muted-foreground">Available to book</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/10 pb-4">
                <CardTitle className="text-xl font-serif">Active & Recent Deliveries</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {dashboard.recentDeliveries && dashboard.recentDeliveries.length > 0 ? (
                  <div className="divide-y">
                    {dashboard.recentDeliveries.map(delivery => (
                      <Link key={delivery.id} href={`/logistics/${delivery.id}`}>
                        <div className="p-4 hover:bg-muted/50 transition-colors group">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant={
                              delivery.status === 'pending' ? 'secondary' :
                              delivery.status === 'in_transit' ? 'default' :
                              delivery.status === 'completed' ? 'outline' : 'default'
                            } className="uppercase">
                              {delivery.status.replace('_', ' ')}
                            </Badge>
                            <span className="font-bold text-foreground">{formatCurrency(delivery.agreedFee || delivery.estimatedFee || 0)}</span>
                          </div>
                          
                          <div className="flex items-start gap-4 mt-4">
                            <div className="flex flex-col items-center gap-1 shrink-0 mt-1">
                              <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20"></div>
                              <div className="w-0.5 h-8 bg-border"></div>
                              <div className="w-3 h-3 rounded-full border-2 border-secondary bg-background"></div>
                            </div>
                            
                            <div className="flex-1 space-y-3">
                              <div>
                                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">Pickup</p>
                                <p className="font-medium text-sm">{delivery.pickupCommunity || delivery.pickupRegion}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">Drop-off</p>
                                <p className="font-medium text-sm">{delivery.dropoffLocation}</p>
                              </div>
                            </div>
                            
                            <div className="shrink-0 text-right space-y-1">
                              <div className="flex items-center justify-end text-sm font-medium gap-1">
                                <Package className="h-4 w-4 text-muted-foreground" />
                                {formatWeight(delivery.totalWeightKg || 0)}
                              </div>
                              <div className="flex items-center justify-end text-sm text-muted-foreground gap-1">
                                <Clock className="h-4 w-4" />
                                {format(new Date(delivery.scheduledDate), 'MMM d')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                    <Truck className="h-12 w-12 text-muted-foreground/30 mb-3" />
                    <p>No active deliveries found.</p>
                    <Link href="/driver/routes" className="mt-4">
                      <Button variant="outline">Find Routes</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
