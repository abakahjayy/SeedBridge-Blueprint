import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useListProduce, useDeleteProduce, getListProduceQueryKey } from '@workspace/api-client-react';
import { Card, CardContent, Button, Badge, Skeleton, Tabs, TabsList, TabsTrigger } from '@/components/ui';
import { PlusCircle, Edit2, Trash2, Sprout, MapPin, Clock } from 'lucide-react';
import { Link } from 'wouter';
import { formatCurrency, formatWeight, CROP_EMOJIS, CROP_LABELS } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export function FarmerListings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('active');
  
  const params = { farmerId: user?.id, status: activeTab === 'active' ? 'available' : undefined };
  const { data, isLoading, refetch } = useListProduce(params, { 
    query: { enabled: !!user?.id, queryKey: getListProduceQueryKey(params) }
  });

  const deleteProduce = useDeleteProduce();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      deleteProduce.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Deleted", description: "Listing removed successfully." });
          refetch();
        },
        onError: (err) => {
          toast({ title: "Error", description: err.message, variant: "destructive" });
        }
      });
    }
  };

  return (
    <div className="flex-1 bg-muted/30 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Your Harvest Listings</h1>
            <p className="text-muted-foreground mt-1">Manage what you're selling on the marketplace.</p>
          </div>
          <Link href="/farmer/listings/new">
            <Button className="w-full md:w-auto shadow-md">
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Crop
            </Button>
          </Link>
        </div>

        <Tabs className="w-full">
          <TabsList className="bg-background border">
            <TabsTrigger active={activeTab === 'active'} onClick={() => setActiveTab('active')}>Active Listings</TabsTrigger>
            <TabsTrigger active={activeTab === 'all'} onClick={() => setActiveTab('all')}>All History</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : data?.items && data.items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.items.map(produce => (
              <Card key={produce.id} className="overflow-hidden flex flex-col group">
                <div className="bg-muted/50 p-6 flex justify-center items-center border-b relative">
                  <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    {CROP_EMOJIS[produce.crop] || "📦"}
                  </div>
                  {produce.isPreHarvest && (
                    <Badge variant="secondary" className="absolute top-3 right-3">Pre-Harvest</Badge>
                  )}
                  {produce.freshnessAlert && (
                    <Badge variant="destructive" className="absolute top-3 left-3">Rescue Mode</Badge>
                  )}
                </div>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-serif font-bold text-xl">{CROP_LABELS[produce.crop] || produce.crop}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{produce.status.replace('_', ' ')}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-primary">{formatCurrency(produce.pricePerKg)}/kg</div>
                      <div className="text-sm font-medium">{formatWeight(produce.availableKg || produce.quantityKg)} left</div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-auto pt-4 border-t border-dashed">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{produce.pickupPoint || produce.community || produce.region}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{produce.isPreHarvest ? 'Harvest on: ' : 'Listed: '} {format(new Date(produce.harvestDate), 'MMM d, yyyy')}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button variant="outline" className="flex-1" size="sm" asChild>
                      <Link href={`/farmer/listings/${produce.id}/edit`}>
                        <Edit2 className="mr-2 h-4 w-4" /> Edit
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-none text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/30" 
                      size="sm"
                      onClick={() => handleDelete(produce.id)}
                      disabled={deleteProduce.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-xl border border-dashed">
            <Sprout className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-serif font-bold mb-2">No listings found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              You haven't listed any produce yet. Add your first crop to start selling.
            </p>
            <Link href="/farmer/listings/new">
              <Button>Add New Crop</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
