import { Link } from "wouter";
function NotFound() {
  return <div className="flex-1 flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-8xl font-serif font-bold text-primary">404</h1>
        <h2 className="text-2xl font-serif font-medium text-foreground">Lost in the fields?</h2>
        <p className="text-muted-foreground">
          We couldn't find the page you're looking for. The harvest might have moved or the route changed.
        </p>
        <Link href="/" className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
          Return Home
        </Link>
      </div>
    </div>;
}
export {
  NotFound as default
};
