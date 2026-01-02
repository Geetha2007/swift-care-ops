import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Sparkles, Mail, Lock, Star, User, ArrowRight, Scissors, Heart, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login delay for UI demo
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: isSignUp ? "Account created!" : "Welcome back!",
        description: isSignUp 
          ? "Welcome to Salon Smart. Redirecting to dashboard..." 
          : "You have successfully logged in to Salon Smart.",
      });
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden gradient-hero">
        {/* Animated background shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl animate-pulse" />
          <div className="absolute bottom-32 right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-white/10 blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Decorative circles */}
          <div className="absolute top-40 right-32 w-24 h-24 rounded-full border-2 border-white/20 animate-spin" style={{ animationDuration: '20s' }} />
          <div className="absolute bottom-48 left-32 w-16 h-16 rounded-full border border-white/15 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
          
          {/* Floating icons */}
          <div className="absolute top-1/4 right-1/4 opacity-20">
            <Scissors className="h-16 w-16 text-white animate-bounce" style={{ animationDuration: '3s' }} />
          </div>
          <div className="absolute bottom-1/4 left-1/4 opacity-15">
            <Heart className="h-12 w-12 text-white animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
          </div>
          <div className="absolute top-1/3 left-1/5 opacity-10">
            <Crown className="h-20 w-20 text-white animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-primary-foreground">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12 animate-fade-in">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-lg shadow-luxury border border-white/20">
              <Sparkles className="h-9 w-9" />
            </div>
            <div>
              <span className="text-4xl font-heading font-bold tracking-tight">Salon Smart</span>
              <p className="text-sm text-white/70 font-medium tracking-wide">Premium Management</p>
            </div>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl font-heading font-bold mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Elevate Your<br />
            <span className="font-display italic">Beauty Business</span>
          </h1>
          <p className="text-xl text-white/80 max-w-md leading-relaxed mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            The premium salon management platform trusted by top beauty professionals worldwide.
          </p>

          {/* Stats */}
          <div className="flex gap-10 mb-14 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-center">
              <p className="text-4xl font-bold font-heading">5K+</p>
              <p className="text-white/60 text-sm font-medium mt-1">Premium Salons</p>
            </div>
            <div className="h-12 w-px bg-white/20" />
            <div className="text-center">
              <p className="text-4xl font-bold font-heading">1M+</p>
              <p className="text-white/60 text-sm font-medium mt-1">Happy Clients</p>
            </div>
            <div className="h-12 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6 fill-white" />
              <div>
                <p className="text-4xl font-bold font-heading">4.9</p>
                <p className="text-white/60 text-sm font-medium mt-1">Rating</p>
              </div>
            </div>
          </div>

          {/* Testimonial Card */}
          <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 max-w-lg shadow-luxury animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <p className="text-white/95 text-lg italic mb-6 leading-relaxed">
              "Salon Smart transformed how we run our spa. Bookings are up 40% and our clients love the seamless experience."
            </p>
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
                alt="Client"
                className="w-14 h-14 rounded-full object-cover ring-2 ring-white/30"
              />
              <div>
                <p className="font-semibold text-lg">Victoria Rose</p>
                <p className="text-sm text-white/60">Owner, Luxe Beauty Studio</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-background via-background to-muted/30">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl gradient-primary shadow-luxury">
              <Sparkles className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <span className="text-2xl font-heading font-bold text-foreground">Salon Smart</span>
              <p className="text-xs text-muted-foreground">Premium Management</p>
            </div>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left space-y-3">
            <h2 className="text-3xl font-heading font-bold text-foreground">
              {isSignUp ? "Create an account" : "Welcome back"}
            </h2>
            <p className="text-muted-foreground text-lg">
              {isSignUp ? "Sign up to start managing your salon" : "Sign in to access your dashboard"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-12 h-12 text-base bg-muted/30 border-border/50 focus:border-primary focus:bg-background transition-all"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-12 h-12 text-base bg-muted/30 border-border/50 focus:border-primary focus:bg-background transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                {!isSignUp && (
                  <Button variant="link" className="px-0 h-auto text-sm text-primary hover:text-primary/80">
                    Forgot password?
                  </Button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-12 pr-12 h-12 text-base bg-muted/30 border-border/50 focus:border-primary focus:bg-background transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 hover:bg-transparent text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold gradient-primary hover:opacity-90 transition-all shadow-luxury group"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isSignUp ? "Creating account..." : "Signing in..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isSignUp ? "Create Account" : "Sign in"}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-4 text-muted-foreground">
                {isSignUp ? "Already have an account?" : "New to Salon Smart?"}
              </span>
            </div>
          </div>

          {/* Toggle Sign Up / Sign In */}
          <Button
            variant="outline"
            className="w-full h-12 text-base font-medium border-2 hover:bg-primary/5 hover:border-primary/30 transition-all"
            size="lg"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Sign in instead" : "Create an account"}
          </Button>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <Button variant="link" className="px-1 h-auto text-sm text-primary">Terms of Service</Button>
            {" "}and{" "}
            <Button variant="link" className="px-1 h-auto text-sm text-primary">Privacy Policy</Button>
          </p>
        </div>
      </div>
    </div>
  );
}
