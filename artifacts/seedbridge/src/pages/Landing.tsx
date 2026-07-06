import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, ShieldCheck, Sprout, Truck, Users } from 'lucide-react';
import { useGetMarketOverview } from '@workspace/api-client-react';

export function LandingPage() {
  const { data: marketData, isLoading } = useGetMarketOverview();

  return (
    <div className="flex-1 w-full bg-background flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32 pb-20 md:pb-32 px-4 border-b">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
        
        <div className="container mx-auto relative z-10 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20 text-sm font-semibold tracking-wide uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              Live in Eastern Region, Ghana
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground leading-[1.1]">
              The Bridge Between <span className="text-primary italic">Harvest</span> and <span className="text-secondary italic">Market</span>.
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-medium">
              SeedBridge connects smallholder farmers directly to buyers, traditional Market Queens, and local drivers. Fresh produce, fair prices, guaranteed logistics.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-lg gap-2 shadow-xl shadow-primary/20">
                  Join the Marketplace <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/marketplace" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg bg-background/50 backdrop-blur">
                  Browse Produce
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Market Ticker */}
      <section className="bg-foreground text-background py-6 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-8 justify-center sm:justify-between items-center text-center">
            {isLoading ? (
              <div className="animate-pulse text-muted flex gap-8 w-full justify-center">
                <div className="h-6 w-24 bg-muted/20 rounded"></div>
                <div className="h-6 w-24 bg-muted/20 rounded"></div>
                <div className="h-6 w-24 bg-muted/20 rounded"></div>
              </div>
            ) : marketData ? (
              <>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-serif font-bold text-primary">{marketData.activeFarmers}</span>
                  <span className="text-xs uppercase tracking-wider opacity-70">Active Farmers</span>
                </div>
                <div className="w-px h-8 bg-border/20 hidden sm:block"></div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-serif font-bold text-secondary">{marketData.activeListings}</span>
                  <span className="text-xs uppercase tracking-wider opacity-70">Live Listings</span>
                </div>
                <div className="w-px h-8 bg-border/20 hidden sm:block"></div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-serif font-bold text-accent">{marketData.totalOrdersToday}</span>
                  <span className="text-xs uppercase tracking-wider opacity-70">Orders Today</span>
                </div>
                <div className="w-px h-8 bg-border/20 hidden sm:block"></div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-serif font-bold text-destructive">{marketData.freshRescueActive}</span>
                  <span className="text-xs uppercase tracking-wider opacity-70">Rescue Alerts</span>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </section>

      {/* Role Selection / Value Props */}
      <section className="py-20 md:py-32 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">A Marketplace Built for You</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Choose your path to enter the SeedBridge ecosystem.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl p-8 border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="h-14 w-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Sprout className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">Farmers</h3>
              <p className="text-muted-foreground mb-6">List your harvest before it's picked, secure deposits via MoMo Escrow, and reduce post-harvest loss with Fresh Rescue pricing.</p>
              <Link href="/register?role=farmer">
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                  I am a Farmer
                </Button>
              </Link>
            </div>

            <div className="bg-card rounded-2xl p-8 border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="h-14 w-14 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-6">
                <ShoppingBag className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">Buyers</h3>
              <p className="text-muted-foreground mb-6">Source fresh produce directly from the farm. Track your orders, secure payments, and capitalize on deep discounts for urgent stock.</p>
              <Link href="/register?role=buyer">
                <Button variant="outline" className="w-full group-hover:bg-secondary group-hover:text-white transition-colors">
                  I am a Buyer
                </Button>
              </Link>
            </div>

            <div className="bg-card rounded-2xl p-8 border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="h-14 w-14 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-6">
                <Truck className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">Drivers</h3>
              <p className="text-muted-foreground mb-6">Optimize your routes with our Milk-Run logistics. Pick up from multiple farms and fill backhaul slots to maximize daily earnings.</p>
              <Link href="/register?role=driver">
                <Button variant="outline" className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  I am a Driver
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ShoppingBag(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
}
