import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useLogin } from "@workspace/api-client-react";
import { Button, Input, Label, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui";
import { useToast } from "@/hooks/use-toast";
import { Sprout } from "lucide-react";
function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const loginMutation = useLogin();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone || !password) {
      toast({
        title: "Missing Fields",
        description: "Please enter both phone and password.",
        variant: "destructive"
      });
      return;
    }
    loginMutation.mutate({ data: { phone, password } }, {
      onSuccess: (data) => {
        login(data.user, data.token);
        toast({
          title: "Welcome back!",
          description: "Successfully logged in."
        });
        setLocation(`/${data.user.role}/dashboard`);
      },
      onError: (err) => {
        toast({
          title: "Login Failed",
          description: err.message || "Invalid credentials. Please try again.",
          variant: "destructive"
        });
      }
    });
  };
  return <div className="flex-1 flex flex-col items-center justify-center p-4 bg-muted/30">
      <Link href="/" className="mb-8 flex items-center gap-2 group">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
          <Sprout className="h-6 w-6" />
        </div>
        <span className="font-serif text-2xl font-bold tracking-tight text-foreground">SeedBridge</span>
      </Link>
      
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-serif">Welcome Back</CardTitle>
          <CardDescription className="text-base">
            Enter your phone number to access your account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
    id="phone"
    type="tel"
    placeholder="e.g. 054 123 4567"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    className="text-lg py-6"
    disabled={loginMutation.isPending}
  />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
    id="password"
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="text-lg py-6"
    disabled={loginMutation.isPending}
  />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-4">
            <Button
    type="submit"
    className="w-full text-lg h-14"
    disabled={loginMutation.isPending}
  >
              {loginMutation.isPending ? "Logging in..." : "Log In"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary font-semibold hover:underline">
                Register here
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>;
}
export {
  LoginPage
};
