import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Building2, HandHeart } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();

  const handleLogin = (role: "donor" | "ngo") => {
    // Store selected role in local storage so we can set it after Replit Auth callback
    localStorage.setItem("foodbridge_selected_role", role);
    window.location.href = "/api/login";
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-emerald-50/30">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-12">
          <motion.h2 variants={item} className="text-4xl font-display font-bold text-primary mb-4">Choose your role</motion.h2>
          <motion.p variants={item} className="text-muted-foreground text-lg">Select how you want to contribute to the community</motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.button
            variants={item}
            onClick={() => handleLogin("donor")}
            className="group relative flex flex-col items-center p-12 bg-white rounded-3xl border-2 border-transparent hover:border-accent shadow-xl shadow-emerald-900/5 hover:shadow-2xl hover:shadow-accent/10 transition-all duration-300 text-left"
          >
            <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Building2 className="w-10 h-10 text-accent" />
            </div>
            <h3 className="text-2xl font-bold font-display text-foreground mb-2">Food Donor</h3>
            <p className="text-center text-muted-foreground">I represent a restaurant, hotel, or business with surplus food to share.</p>
          </motion.button>

          <motion.button
            variants={item}
            onClick={() => handleLogin("ngo")}
            className="group relative flex flex-col items-center p-12 bg-white rounded-3xl border-2 border-transparent hover:border-primary shadow-xl shadow-emerald-900/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 text-left"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <HandHeart className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold font-display text-foreground mb-2">NGO Partner</h3>
            <p className="text-center text-muted-foreground">I represent a non-profit organization distributing food to those in need.</p>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
