import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useRegister } from "@workspace/api-client-react";
import { Button, Input, Label, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { useToast } from "@/hooks/use-toast";
import { Sprout } from "lucide-react";
function RegisterPage() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialRole = searchParams.get("role") || "farmer";
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    role: initialRole,
    region: "Eastern Region"
  });
  const { login } = useAuth();
  const { toast } = useToast();
  const registerMutation = useRegister();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.password) {
      toast({
        title: "Missing Fields",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }
    registerMutation.mutate({ data: formData }, {
      onSuccess: (data) => {
        login(data.user, data.token);
        toast({
          title: "Account Created",
          description: "Welcome to SeedBridge!"
        });
        setLocation(`/${data.user.role}/dashboard`);
      },
      onError: (err) => {
        toast({
          title: "Registration Failed",
          description: err.message || "Something went wrong. Please try again.",
          variant: "destructive"
        });
      }
    });
  };
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  return <div className="flex-1 flex flex-col items-center justify-center p-4 py-12 bg-muted/30">
      <Link href="/" className="mb-8 flex items-center gap-2 group">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
          <Sprout className="h-6 w-6" />
        </div>
        <span className="font-serif text-2xl font-bold tracking-tight text-foreground">SeedBridge</span>
      </Link>
      
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-serif">Create Account</CardTitle>
          <CardDescription className="text-base">
            Join the SeedBridge marketplace today.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>I am joining as a:</Label>
              <div className="grid grid-cols-3 gap-2">
                {["farmer", "buyer", "driver"].map((role) => <Button
    key={role}
    type="button"
    variant={formData.role === role ? "default" : "outline"}
    className="capitalize h-12"
    onClick={() => setFormData((prev) => ({ ...prev, role }))}
  >
                    {role}
                  </Button>)}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
    id="name"
    placeholder="e.g. Kwame Mensah"
    value={formData.name}
    onChange={handleChange}
    className="text-lg py-6"
    disabled={registerMutation.isPending}
  />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (MoMo connected)</Label>
              <Input
    id="phone"
    type="tel"
    placeholder="e.g. 054 123 4567"
    value={formData.phone}
    onChange={handleChange}
    className="text-lg py-6"
    disabled={registerMutation.isPending}
  />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select
    value={formData.region}
    onValueChange={(val) => setFormData((prev) => ({ ...prev, region: val }))}
  >
                <SelectTrigger className="h-14 text-lg">
                  <SelectValue placeholder="Select a region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Eastern Region">Eastern Region (Active)</SelectItem>
                  <SelectItem value="Greater Accra">Greater Accra</SelectItem>
                  <SelectItem value="Ashanti Region">Ashanti Region</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
    id="password"
    type="password"
    value={formData.password}
    onChange={handleChange}
    className="text-lg py-6"
    disabled={registerMutation.isPending}
  />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-4">
            <Button
    type="submit"
    className="w-full text-lg h-14"
    disabled={registerMutation.isPending}
  >
              {registerMutation.isPending ? "Creating Account..." : "Create Account"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Log in here
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>;
}
export {
  RegisterPage
};
