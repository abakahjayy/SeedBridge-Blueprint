import React from 'react';
import { Link } from 'wouter';
import { useListPreHarvest } from '@workspace/api-client-react';
import { formatCurrency, formatWeight, CROP_EMOJIS, CROP_LABELS } from '@/lib/utils';
import { Sprout, ArrowLeft, Calendar, Coins } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

export function PreHarvest() {
  const { data: listings, isLoading } = useListPreHarvest();

  return (
    <div className="flex-1 bg-secondary/5 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href="/marketplace" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors font-medium">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplace
        </Link>

        <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <Sprout className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-secondary">Pre-Harvest</h1>
              <p className="text-muted-foreground">Lock in produce before it's harvested. Pay a small deposit to guarantee your order.</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-56 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(produce => {
              const daysUntil = differenceInDays(new Date(produce.harvestDate), new Date());
              return (
                <Link key={produce.id} href={`/produce/${produce.id}`}>
                  <div className="bg-card border border-secondary/20 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 group cursor-pointer">
                    <div className="bg-secondary/10 p-6 flex flex-col items-center border-b">
                      <div className="text-5xl mb-2 group-hover:scale-110 transition-transform duration-300">
                        {CROP_EMOJIS[produce.crop] || '📦'}
                      </div>
                      <div className="flex items-center gap-1.5 text-secondary font-bold text-sm">
                        <Calendar className="h-4 w-4" />
                        {daysUntil > 0 ? `${daysUntil} days to harvest` : 'Harvesting soon'}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif font-bold text-lg">{CROP_LABELS[produce.crop] || produce.crop}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {produce.region} · {formatWeight(produce.quantityKg)} expected
                      </p>
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-2xl font-bold text-primary">{formatCurrency(produce.pricePerKg)}/kg</span>
                      </div>
                      {produce.depositRequired && (
                        <div className="flex items-center gap-1.5 text-sm font-medium text-secondary bg-secondary/10 rounded-lg px-3 py-1.5">
                          <Coins className="h-4 w-4" />
                          {produce.depositRequired}% deposit to reserve
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-2">
                        Harvest: {format(new Date(produce.harvestDate), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-xl border border-dashed">
            <Sprout className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-serif font-bold mb-2">No pre-harvest listings available</h3>
            <p className="text-muted-foreground">Farmers will post upcoming harvests here. Come back soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
