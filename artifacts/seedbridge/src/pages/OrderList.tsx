import React, { useState } from 'react';
import { useListOrders, useUpdateOrderStatus, OrderStatusUpdateStatus } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Tabs, TabsList, TabsTrigger } from '@/components/ui';
import { Package, Truck, CheckCircle2, AlertCircle, Sprout, ShoppingBag } from 'lucide-react';
import { formatCurrency, formatWeight, CROP_EMOJIS, CROP_LABELS } from '@/lib/utils';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function OrderList() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  
  const { data, isLoading, refetch } = useListOrders({ 
    status: activeTab === 'all' ? undefined : activeTab 
  });
  
  const updateStatus = useUpdateOrderStatus();

  const handleUpdateStatus = (id: string, status: OrderStatusUpdateStatus) => {
    updateStatus.mutate({ id, data: { status } }, {
      onSuccess: () => {
        toast({ title: "Order Updated", description: `Order status changed to ${status.replace('_', ' ')}` });
        refetch();
      },
      onError: (err) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    });
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <Package className="h-5 w-5 text-muted-foreground" />;
      case 'in_transit': return <Truck className="h-5 w-5 text-primary" />;
      case 'delivered': return <CheckCircle2 className="h-5 w-5 text-secondary" />;
      case 'cancelled': return <AlertCircle className="h-5 w-5 text-destructive" />;
      default: return <Package className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex-1 bg-muted/30 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Your Orders</h1>
          <p className="text-muted-foreground mt-1">Track and manage your produce transactions.</p>
        </div>

        <Tabs className="w-full">
          <TabsList className="bg-background border justify-start w-full overflow-x-auto hide-scrollbar">
            <TabsTrigger active={activeTab === 'all'} onClick={() => setActiveTab('all')}>All Orders</TabsTrigger>
            <TabsTrigger active={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>Pending</TabsTrigger>
            <TabsTrigger active={activeTab === 'in_transit'} onClick={() => setActiveTab('in_transit')}>In Transit</TabsTrigger>
            <TabsTrigger active={activeTab === 'delivered'} onClick={() => setActiveTab('delivered')}>Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : data && data.length > 0 ? (
          <div className="space-y-4">
            {data.map(order => (
              <Card key={order.id} className="overflow-hidden transition-shadow hover:shadow-md">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="bg-muted/30 p-6 flex flex-col justify-center items-center md:border-r border-b md:border-b-0 min-w-[160px]">
                      <div className="h-16 w-16 bg-background rounded-2xl flex items-center justify-center text-3xl shadow-sm border mb-3">
                        {CROP_EMOJIS[order.crop] || "📦"}
                      </div>
                      <Badge variant="outline" className="uppercase tracking-wider text-xs">
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-serif font-bold text-xl">{formatWeight(order.quantityKg)} {CROP_LABELS[order.crop] || order.crop}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              {user?.role === 'farmer' ? <ShoppingBag className="h-3.5 w-3.5" /> : <Sprout className="h-3.5 w-3.5" />}
                              {user?.role === 'farmer' ? `Buyer: ${order.buyerName}` : `Farmer: ${order.farmerName}`}
                            </span>
                            <span>•</span>
                            <span>{format(new Date(order.createdAt), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-xl">{formatCurrency(order.totalAmount)}</div>
                          <div className="text-xs text-muted-foreground">{formatCurrency(order.pricePerKg || 0)}/kg</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 mt-auto pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm">
                          {getStatusIcon(order.status)}
                          <span className="font-medium">
                            {order.status === 'pending' ? 'Awaiting confirmation' : 
                             order.status === 'in_transit' ? 'On the way to destination' : 
                             order.status === 'delivered' ? 'Successfully delivered' : 'Order closed'}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          {user?.role === 'farmer' && order.status === 'pending' && (
                            <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'confirmed' as any)}>Confirm Order</Button>
                          )}
                          {user?.role === 'buyer' && order.status === 'in_transit' && (
                            <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'delivered' as any)}>Mark Delivered</Button>
                          )}
                          {/* Add more status progression buttons as needed */}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-xl border border-dashed">
            <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-serif font-bold mb-2">No orders found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              You don't have any orders matching this filter yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
