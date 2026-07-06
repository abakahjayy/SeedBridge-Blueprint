import React, { useState } from 'react';
import { Link } from 'wouter';
import { useListProduce } from '@workspace/api-client-react';
import { Button, Badge, Card, CardContent, CardFooter, Skeleton } from '@/components/ui';
import { MapPin, Clock, Timer, Sprout } from 'lucide-react';
import { CROP_EMOJIS, CROP_LABELS, formatCurrency, formatWeight } from '@/lib/utils';
import { Produce } from '@workspace/api-client-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Placeholder images map
const CROP_IMAGES: Record<string, string> = {
  tomatoes: "/src/assets/tomatoes.jpg",
  garden_eggs: "/src/assets/garden_eggs.jpg",
  okra: "/src/assets/okra.jpg",
  peppers: "/src/assets/peppers.jpg",
  leafy_greens: "/src/assets/leafy_greens.jpg",
};

export function Marketplace() {
  const [activeTab, setActiveTab] = useState('all');
  
  // Build query params based on active tab
  const queryParams = {
    status: 'available',
    ...(activeTab === 'fresh_rescue' && { freshnessAlert: true }),
  };

  const { data, isLoading } = useListProduce(queryParams);
  const produces = data?.items || [];

  // Filter out pre-harvest if not on pre-harvest tab
  const displayProduces = produces.filter(p => {
    if (activeTab === 'pre_harvest') return p.isPreHarvest;
    if (activeTab === 'fresh_rescue') return p.freshnessAlert;
    return !p.isPreHarvest && !p.freshnessAlert; // Standard available
  });

  return (
    <div className="flex-1 w-full bg-background flex flex-col">
      <div className="bg-muted/30 border-b pt-8 pb-0 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-serif font-bold text-foreground mb-3">Live Marketplace</h1>
              <p className="text-muted-foreground text-lg">Browse fresh produce directly from farmers in the Eastern Region.</p>
            </div>
            
            <div className="flex items-center space-x-2 pb-1">
              <Tabs className="w-full overflow-x-auto pb-2 -mb-2 hide-scrollbar">
                <TabsList className="bg-background border w-full justify-start md:justify-center p-1">
                  <TabsTrigger 
                    active={activeTab === 'all'} 
                    onClick={() => setActiveTab('all')}
                  >
                    Fresh Harvest
                  </TabsTrigger>
                  <TabsTrigger 
                    active={activeTab === 'pre_harvest'} 
                    onClick={() => setActiveTab('pre_harvest')}
                    className="gap-2"
                  >
                    <Sprout className="h-4 w-4" /> Pre-Harvest
                  </TabsTrigger>
                  <TabsTrigger 
                    active={activeTab === 'fresh_rescue'} 
                    onClick={() => setActiveTab('fresh_rescue')}
                    className="text-destructive data-[state=active]:bg-destructive/10 data-[state=active]:text-destructive gap-2"
                  >
                    <Timer className="h-4 w-4" /> Fresh Rescue
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {activeTab === 'fresh_rescue' && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
            <div className="h-16 w-16 bg-destructive/20 rounded-full flex items-center justify-center text-destructive shrink-0">
              <Timer className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-destructive mb-1">Urgent: Fresh Rescue</h3>
              <p className="text-destructive/80 font-medium">
                These items are nearing peak ripeness. Help reduce post-harvest loss by claiming these deep discounts. Perfect for agro-processors and canteens.
              </p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : displayProduces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayProduces.map((produce) => (
              <ProduceCard key={produce.id} produce={produce} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-card rounded-2xl border border-dashed">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Sprout className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-serif font-bold mb-2">No listings found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              There are currently no produce listings in this category. Check back soon as farmers update their inventory daily.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProduceCard({ produce }: { produce: Produce }) {
  const isRescue = produce.freshnessAlert;
  const isPreHarvest = produce.isPreHarvest;
  
  const getBadge = () => {
    if (isRescue) return <Badge variant="destructive" className="animate-pulse absolute top-3 right-3 shadow-md">Fresh Rescue</Badge>;
    if (isPreHarvest) return <Badge variant="secondary" className="absolute top-3 right-3 shadow-md">Pre-Harvest</Badge>;
    return null;
  };

  // Generate deterministic placeholder if no imageUrl
  const imgSrc = produce.imageUrl || CROP_IMAGES[produce.crop] || `https://images.unsplash.com/photo-1596199050105-6d5d32222916?auto=format&fit=crop&q=80&w=600`;

  return (
    <Link href={`/produce/${produce.id}`} className="group h-full">
      <Card className="h-full overflow-hidden flex flex-col transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary/50">
        <div className="relative h-48 w-full bg-muted overflow-hidden">
          <img 
            src={imgSrc} 
            alt={produce.crop} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1596199050105-6d5d32222916?auto=format&fit=crop&q=80&w=600';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {getBadge()}
          <div className="absolute bottom-3 left-3 text-white">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{CROP_EMOJIS[produce.crop] || CROP_EMOJIS.other}</span>
              <span className="font-serif font-bold text-xl">{CROP_LABELS[produce.crop] || produce.crop}</span>
            </div>
          </div>
        </div>
        
        <CardContent className="flex-1 p-5 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-2xl font-bold font-serif text-foreground">
                {formatCurrency(produce.pricePerKg)} <span className="text-sm font-sans text-muted-foreground font-normal">/ kg</span>
              </div>
              {produce.originalPricePerKg && isRescue && (
                <div className="text-sm text-destructive line-through decoration-destructive/50">
                  {formatCurrency(produce.originalPricePerKg)} / kg
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">{formatWeight(produce.availableKg || produce.quantityKg)}</div>
              <div className="text-xs text-muted-foreground">Available</div>
            </div>
          </div>

          <div className="space-y-2 mt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0 text-primary" />
              <span className="truncate">{produce.community || produce.region}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 shrink-0 text-secondary" />
              <span className="truncate">
                {isPreHarvest ? `Harvest: ${new Date(produce.harvestDate).toLocaleDateString()}` : `By ${produce.farmerName}`}
              </span>
            </div>
            
            {isRescue && produce.hoursToExpiry && (
              <div className="flex items-center gap-2 text-sm font-medium text-destructive bg-destructive/10 px-2 py-1 rounded">
                <Timer className="h-4 w-4 shrink-0" />
                <span>~{produce.hoursToExpiry} hrs left</span>
              </div>
            )}
          </div>
        </CardContent>
        
        <div className="p-4 pt-0 mt-auto border-t bg-muted/10">
          <Button variant="default" className="w-full font-medium" asChild>
            <span>{isPreHarvest ? "Secure with Deposit" : "Order Now"}</span>
          </Button>
        </div>
      </Card>
    </Link>
  );
}
