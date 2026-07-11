import React, { useState } from "react";
import { useGetProduce, getGetProduceQueryKey } from "@workspace/api-client-react";
import { useInitializeCheckout } from "@/hooks/use-payment";
import { useParams, Link, useLocation } from "wouter";
import { Card, CardContent, Button, Badge, Skeleton, Label, Input } from "@/components/ui";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { CROP_EMOJIS, CROP_LABELS, formatCurrency, formatWeight } from "@/lib/utils";
import { MapPin, Clock, Star, ShieldCheck, ArrowLeft, Timer } from "lucide-react";
import { format } from "date-fns";
const CROP_IMAGES = {
  tomatoes: "/src/assets/tomatoes.jpg",
  garden_eggs: "/src/assets/garden_eggs.jpg",
  okra: "/src/assets/okra.jpg",
  peppers: "/src/assets/peppers.jpg",
  leafy_greens: "/src/assets/leafy_greens.jpg"
};
function ProduceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: produce, isLoading } = useGetProduce(id || "", {
    query: { enabled: !!id, queryKey: getGetProduceQueryKey(id || "") }
  });
  const initializeCheckout = useInitializeCheckout();
  const [orderQty, setOrderQty] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  React.useEffect(() => {
    if (produce && orderQty === 0) {
      setOrderQty(Math.min(50, produce.availableKg || produce.quantityKg));
    }
  }, [produce]);
  if (isLoading || !produce) {
    return <div className="container max-w-5xl mx-auto p-4 md:p-8 space-y-8">
        <Skeleton className="h-10 w-32 mb-8" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-[400px] rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>;
  }
  const isRescue = produce.freshnessAlert;
  const isPreHarvest = produce.isPreHarvest;
  const imgSrc = produce.imageUrl || CROP_IMAGES[produce.crop] || `https://images.unsplash.com/photo-1596199050105-6d5d32222916?auto=format&fit=crop&q=80&w=1200`;
  const available = produce.availableKg ?? produce.quantityKg;
  const totalAmount = orderQty * produce.pricePerKg;
  const handleOrder = () => {
    if (!user) {
      setLocation(`/login?redirect=/produce/${id}`);
      return;
    }
    if (user.role === "farmer") {
      toast({ title: "Not Allowed", description: "Farmers cannot buy produce.", variant: "destructive" });
      return;
    }
    if (!deliveryAddress && !produce.pickupPoint) {
      toast({ title: "Missing info", description: "Please provide a delivery address.", variant: "destructive" });
      return;
    }
    initializeCheckout.mutate({
      produceId: produce.id,
      quantityKg: orderQty,
      deliveryAddress: deliveryAddress || produce.pickupPoint || "Farm Gate",
      isDeposit: isPreHarvest
    }, {
      onSuccess: (data) => {
        // Full-page redirect — Paystack's checkout is an external hosted
        // page, not a route in this app, so this can't be a SPA navigation.
        window.location.href = data.authorizationUrl;
      },
      onError: (err) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    });
  };
  return <div className="flex-1 bg-background pb-20">
      <div className="container max-w-5xl mx-auto p-4 md:p-8">
        <Link href="/marketplace" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6 font-medium">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Market
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {
    /* Left: Image & Farmer Info */
  }
          <div className="space-y-6">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] md:aspect-auto md:h-[500px] border shadow-sm">
              <img
    src={imgSrc}
    alt={produce.crop}
    className="w-full h-full object-cover"
    onError={(e) => {
      e.target.src = "https://images.unsplash.com/photo-1596199050105-6d5d32222916?auto=format&fit=crop&q=80&w=1200";
    }}
  />
              {isRescue && <div className="absolute top-4 right-4 animate-pulse">
                  <Badge variant="destructive" className="text-sm py-1 px-3 shadow-lg">
                    <Timer className="mr-1.5 h-4 w-4" /> Fresh Rescue
                  </Badge>
                </div>}
              {isPreHarvest && <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="text-sm py-1 px-3 shadow-lg">Pre-Harvest</Badge>
                </div>}
            </div>

            <Card className="bg-muted/30 border-dashed">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xl font-bold">
                    {produce.farmerName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif font-bold text-lg">{produce.farmerName}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Star className="h-4 w-4 text-accent fill-accent mr-1" />
                      <span>{produce.farmerRating || "4.8"} Rating</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View Profile</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {
    /* Right: Details & Order Form */
  }
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                <span className="text-2xl">{CROP_EMOJIS[produce.crop] || "\u{1F4E6}"}</span>
                <span className="font-medium">{produce.region}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                {CROP_LABELS[produce.crop] || produce.crop}
              </h1>
              
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-primary">{formatCurrency(produce.pricePerKg)}</span>
                <span className="text-muted-foreground">/ kg</span>
                
                {isRescue && produce.originalPricePerKg && <span className="ml-2 text-lg text-destructive line-through decoration-destructive/50">
                    {formatCurrency(produce.originalPricePerKg)}
                  </span>}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-muted/50 rounded-xl p-4 border">
                  <div className="text-sm text-muted-foreground mb-1">Available Quantity</div>
                  <div className="font-bold text-lg">{formatWeight(available)}</div>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 border">
                  <div className="text-sm text-muted-foreground mb-1">
                    {isPreHarvest ? "Est. Harvest" : "Listed On"}
                  </div>
                  <div className="font-bold text-lg flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-secondary" />
                    {format(new Date(produce.harvestDate), "MMM d, yyyy")}
                  </div>
                </div>
              </div>

              {produce.description && <div className="mb-8">
                  <h3 className="font-serif font-bold text-lg mb-2">About this harvest</h3>
                  <p className="text-muted-foreground leading-relaxed">{produce.description}</p>
                </div>}
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Pickup: <strong className="text-foreground">{produce.pickupPoint || produce.community || "Farm Gate"}</strong></span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <ShieldCheck className="h-5 w-5 text-secondary" />
                  <span>Payments secured by <strong>SeedBridge MoMo Escrow</strong></span>
                </div>
              </div>
            </div>

            <Card className="mt-auto shadow-lg border-primary/20 bg-card overflow-hidden">
              <div className="bg-primary/5 p-4 border-b border-primary/10">
                <h3 className="font-serif font-bold text-lg text-primary">
                  {isPreHarvest ? "Secure with Deposit" : "Place Order"}
                </h3>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <Label htmlFor="qty" className="text-base">Quantity (kg)</Label>
                    <span className="text-sm text-muted-foreground font-mono">{orderQty} / {available} kg</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Input
    id="qty"
    type="range"
    min={10}
    max={available}
    step={10}
    value={orderQty}
    onChange={(e) => setOrderQty(Number(e.target.value))}
    className="flex-1"
  />
                    <Input
    type="number"
    value={orderQty}
    onChange={(e) => setOrderQty(Math.min(available, Math.max(10, Number(e.target.value))))}
    className="w-24 text-center font-bold text-lg"
  />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address (Optional if picking up)</Label>
                  <Input
    id="address"
    placeholder="e.g. Accra Central Market, Stall 4B"
    value={deliveryAddress}
    onChange={(e) => setDeliveryAddress(e.target.value)}
  />
                </div>

                <div className="border-t pt-4 flex items-end justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Total Amount</div>
                    <div className="text-3xl font-serif font-bold">{formatCurrency(totalAmount)}</div>
                    {isPreHarvest && produce.depositRequired && <div className="text-sm font-medium text-secondary mt-1">
                        Deposit required: {formatCurrency(totalAmount * (produce.depositRequired / 100))}
                      </div>}
                  </div>
                  <Button
    size="lg"
    onClick={handleOrder}
    disabled={initializeCheckout.isPending || orderQty <= 0}
    className="px-8 shadow-md"
  >
                    {initializeCheckout.isPending ? "Redirecting to payment..." : isPreHarvest ? "Pay Deposit" : "Pay via Escrow"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>;
}
export {
  ProduceDetail
};
