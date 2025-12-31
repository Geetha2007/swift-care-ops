import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Sparkles, Mail, Lock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Welcome back!",
      description: "You have successfully logged in to Salon Smart.",
    });
    
    setIsLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden gradient-hero">
        {/* Abstract shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-32 right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          {/* Gold accent circles */}
          <div className="absolute top-40 right-32 w-24 h-24 rounded-full border-2 border-white/20" />
          <div className="absolute bottom-48 left-32 w-16 h-16 rounded-full border border-white/15" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-primary-foreground">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur shadow-luxury">
              <Sparkles className="h-8 w-8" />
            </div>
            <div>
              <span className="text-3xl font-heading font-bold">Salon Smart</span>
              <p className="text-sm text-white/70">Premium Management</p>
            </div>
          </div>
          
          <h1 className="text-4xl font-heading font-bold mb-4 leading-tight">
            Elevate Your<br />Beauty Business
          </h1>
          <p className="text-lg text-white/80 max-w-md leading-relaxed">
            The premium salon management platform trusted by top beauty professionals. 
            Streamline bookings, delight clients, and grow your revenue.
          </p>
          
          <div className="mt-12 flex gap-8">
            <div>
              <p className="text-3xl font-bold">5K+</p>
              <p className="text-white/70 text-sm">Premium Salons</p>
            </div>
            <div>
              <p className="text-3xl font-bold">1M+</p>
              <p className="text-white/70 text-sm">Happy Clients</p>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-white" />
              <p className="text-3xl font-bold">4.9</p>
              <p className="text-white/70 text-sm ml-1">Rating</p>
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-12 p-6 rounded-2xl bg-white/10 backdrop-blur border border-white/20 max-w-md">
            <p className="text-white/90 italic mb-4">
              "Salon Smart transformed how we run our spa. Bookings are up 40% and our clients love the seamless experience."
            </p>
            <div className="flex items-center gap-3">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" 
                alt="Client" 
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-sm">Victoria Rose</p>
                <p className="text-xs text-white/60">Owner, Luxe Beauty Studio</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-luxury">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <span className="text-2xl font-heading font-bold text-foreground">Salon Smart</span>
              <p className="text-xs text-muted-foreground">Premium Management</p>
            </div>
          </div>
          
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-heading font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground mt-2">
              Sign in to manage your salon
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@salon.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              <Button variant="link" className="px-0 text-primary">
                Forgot password?
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary hover:opacity-90 transition-opacity shadow-luxury"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                New to Salon Smart?
              </span>
            </div>
          </div>

          <Button variant="outline" className="w-full" size="lg">
            Start your free trial
          </Button>
        </div>
      </div>
    </div>
  );
}
