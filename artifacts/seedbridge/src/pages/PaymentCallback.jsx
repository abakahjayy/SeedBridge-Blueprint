import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useFinalizeOrder } from "@/hooks/use-payment";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

// Paystack redirects here as: /payment/callback?reference=xxx&trxref=xxx
// (it sends both params with the same value — we just need one).
function PaymentCallback() {
  const [location, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const reference = params.get("reference") || params.get("trxref");

  const { data, isLoading, isError, error } = useFinalizeOrder(reference, {
    enabled: !!reference
  });

  useEffect(() => {
    if (data?.success && data.order) {
      // Give the success message a beat to render, then take them to the order.
      const timeout = setTimeout(() => {
        setLocation(`/orders/${data.order.id || data.order._id}`);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [data]);

  if (!reference) {
    return <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <XCircle className="h-12 w-12 text-destructive mx-auto" />
          <p className="font-semibold">No payment reference found.</p>
          <Link href="/marketplace" className="text-primary underline">Back to Marketplace</Link>
        </div>
      </div>;
  }

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
          <p className="font-semibold">Confirming your payment...</p>
          <p className="text-sm text-muted-foreground">This will only take a moment.</p>
        </div>
      </div>;
  }

  if (isError || !data?.success) {
    return <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <XCircle className="h-12 w-12 text-destructive mx-auto" />
          <p className="font-semibold">Payment could not be confirmed.</p>
          <p className="text-sm text-muted-foreground">
            {error?.message || `Status: ${data?.status || "unknown"}`}
          </p>
          <Link href="/marketplace" className="text-primary underline">Back to Marketplace</Link>
        </div>
      </div>;
  }

  return <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="text-center space-y-3">
        <CheckCircle2 className="h-12 w-12 text-secondary mx-auto" />
        <p className="font-semibold">Payment confirmed! Creating your order...</p>
      </div>
    </div>;
}

export { PaymentCallback };