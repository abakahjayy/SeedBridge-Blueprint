import { useParams, Link } from "wouter";
import { useGetOrder, useUpdateOrderStatus, getGetOrderQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatWeight, CROP_EMOJIS, CROP_LABELS } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowLeft, Package, Truck, CheckCircle2, ShieldCheck, MapPin } from "lucide-react";
function OrderDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: order, isLoading, refetch } = useGetOrder(id || "", {
    query: { enabled: !!id, queryKey: getGetOrderQueryKey(id || "") }
  });
  const updateStatus = useUpdateOrderStatus();
  const handleUpdateStatus = (status) => {
    if (!id) return;
    updateStatus.mutate({ id, data: { status } }, {
      onSuccess: () => {
        toast({ title: "Order Updated", description: `Status changed to ${status.replace("_", " ")}` });
        refetch();
      },
      onError: (err) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    });
  };
  const steps = ["pending", "confirmed", "in_transit", "delivered", "completed"];
  if (isLoading || !order) {
    return <div className="flex-1 bg-muted/30 p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          <div className="h-64 bg-muted animate-pulse rounded-xl" />
        </div>
      </div>;
  }
  const currentStep = Math.max(0, steps.indexOf(order.status));
  return <div className="flex-1 bg-muted/30 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/orders" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors font-medium">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Link>

        <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-primary/5 border-b p-6 flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Order #{order.id.slice(-8).toUpperCase()}</div>
              <h1 className="text-2xl font-serif font-bold">{formatWeight(order.quantityKg)} {CROP_LABELS[order.crop] || order.crop}</h1>
            </div>
            <div className="text-3xl">{CROP_EMOJIS[order.crop] || "\u{1F4E6}"}</div>
          </div>

          {
    /* Status Timeline */
  }
          <div className="p-6 border-b">
            <h2 className="font-serif font-bold text-lg mb-4">Order Progress</h2>
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted z-0" />
              <div
    className="absolute top-5 left-0 h-0.5 bg-primary z-0 transition-all duration-500"
    style={{ width: `${currentStep / (steps.length - 1) * 100}%` }}
  />
              {steps.map((step, i) => <div key={step} className="flex flex-col items-center relative z-10 flex-1">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${i <= currentStep ? "bg-primary border-primary text-primary-foreground" : "bg-background border-muted-foreground/30 text-muted-foreground"}`}>
                    {i < currentStep ? <CheckCircle2 className="h-5 w-5" /> : i === 1 ? <Package className="h-4 w-4" /> : i === 2 ? <Truck className="h-4 w-4" /> : i === 3 ? <MapPin className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                  </div>
                  <span className={`text-xs mt-2 font-medium capitalize text-center leading-tight ${i <= currentStep ? "text-primary" : "text-muted-foreground"}`}>
                    {step.replace("_", " ")}
                  </span>
                </div>)}
            </div>
          </div>

          {
    /* Order Details */
  }
          <div className="p-6 grid md:grid-cols-2 gap-6 border-b">
            <div className="space-y-3">
              <h3 className="font-serif font-bold">Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-medium">{formatWeight(order.quantityKg)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price/kg</span>
                  <span className="font-medium">{formatCurrency(order.pricePerKg ?? 0)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-primary">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-serif font-bold">Parties</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Farmer</span>
                  <span className="font-medium">{order.farmerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Buyer</span>
                  <span className="font-medium">{order.buyerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Placed</span>
                  <span className="font-medium">{format(new Date(order.createdAt), "MMM d, yyyy")}</span>
                </div>
              </div>
            </div>
          </div>

          {
    /* Escrow Status */
  }
          <div className="p-6 border-b bg-secondary/5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-secondary" />
              <div>
                <div className="font-serif font-bold">MoMo Escrow Status</div>
                <div className="text-sm text-muted-foreground capitalize">{order.paymentStatus?.replace("_", " ") || "Unpaid"}</div>
              </div>
            </div>
          </div>

          {
    /* Actions */
  }
          <div className="p-6 flex gap-3 justify-end">
            {user?.role === "farmer" && order.status === "pending" && <button
    onClick={() => handleUpdateStatus("confirmed")}
    disabled={updateStatus.isPending}
    className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
  >
                Confirm Order
              </button>}
            {user?.role === "farmer" && order.status === "confirmed" && <button
    onClick={() => handleUpdateStatus("in_transit")}
    disabled={updateStatus.isPending}
    className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
  >
                Mark as Picked Up
              </button>}
            {user?.role === "buyer" && order.status === "in_transit" && <button
    onClick={() => handleUpdateStatus("delivered")}
    disabled={updateStatus.isPending}
    className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-xl font-semibold text-sm hover:bg-secondary/90 disabled:opacity-50 transition-colors"
  >
                Confirm Delivery
              </button>}
          </div>
        </div>
      </div>
    </div>;
}
export {
  OrderDetail
};
