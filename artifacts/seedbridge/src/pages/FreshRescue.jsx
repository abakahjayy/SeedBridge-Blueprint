import { Link } from "wouter";
import { useListFreshRescue } from "@workspace/api-client-react";
import { formatCurrency, formatWeight, CROP_EMOJIS, CROP_LABELS } from "@/lib/utils";
import { Timer, ArrowLeft, Zap } from "lucide-react";
function FreshRescue() {
  const { data: listings, isLoading } = useListFreshRescue();
  return <div className="flex-1 bg-destructive/5 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href="/marketplace" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors font-medium">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplace
        </Link>

        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center">
              <Zap className="h-5 w-5 text-destructive-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-destructive">Fresh Rescue</h1>
              <p className="text-muted-foreground">Heavily discounted produce near shelf-life. Perfect for processors, canteens, and bulk buyers.</p>
            </div>
          </div>
        </div>

        {isLoading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <div key={i} className="h-56 bg-muted animate-pulse rounded-xl" />)}
          </div> : listings && listings.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((produce) => <Link key={produce.id} href={`/produce/${produce.id}`}>
                <div className="bg-card border border-destructive/20 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 group cursor-pointer">
                  <div className="bg-destructive/10 p-6 flex flex-col items-center border-b relative">
                    <div className="text-5xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {CROP_EMOJIS[produce.crop] || "\u{1F4E6}"}
                    </div>
                    {produce.hoursToExpiry != null && <div className="flex items-center gap-1.5 text-destructive font-bold text-sm animate-pulse">
                        <Timer className="h-4 w-4" />
                        {produce.hoursToExpiry}h remaining
                      </div>}
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif font-bold text-lg">{CROP_LABELS[produce.crop] || produce.crop}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{produce.region} · {formatWeight(produce.availableKg ?? produce.quantityKg)} available</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-destructive">{formatCurrency(produce.pricePerKg)}/kg</span>
                      {produce.originalPricePerKg && <span className="text-sm line-through text-muted-foreground">{formatCurrency(produce.originalPricePerKg)}</span>}
                    </div>
                  </div>
                </div>
              </Link>)}
          </div> : <div className="text-center py-20 bg-card rounded-xl border border-dashed">
            <Timer className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-serif font-bold mb-2">No Fresh Rescue listings right now</h3>
            <p className="text-muted-foreground">Check back soon — urgent deals appear here when produce nears its shelf-life.</p>
          </div>}
      </div>
    </div>;
}
export {
  FreshRescue
};
