import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-emerald-50/50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          <motion.div 
            initial="initial"
            animate="animate"
            variants={stagger}
            className="max-w-2xl"
          >
            <motion.div variants={fadeIn}>
              <span className="inline-block py-1 px-3 rounded-full bg-accent/10 text-accent-foreground text-sm font-semibold tracking-wide mb-6">
                Sustainable Food Sharing
              </span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl lg:text-7xl font-display font-bold text-primary leading-[1.1] mb-6">
              Bridging the Gap Between <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Surplus</span> & Scarcity.
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-lg">
              Connect surplus food from businesses and events with NGOs who can distribute it to those in need. Simple, fast, and impactful.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-wrap gap-4">
              <Link href="/login">
                <Button size="lg" className="h-14 px-8 rounded-2xl text-lg bg-accent hover:bg-accent/90 text-accent-foreground shadow-xl shadow-accent/20 transition-all hover:-translate-y-1">
                  Start Donating <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl text-lg border-2 hover:bg-emerald-50/50">
                  I'm an NGO
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative hidden lg:block"
          >
            {/* Abstract visual representation instead of stock photo */}
            <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-primary/5 to-accent/5 border border-white shadow-2xl p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -ml-16 -mb-16" />
              
              <div className="grid grid-cols-2 gap-6 h-full">
                <div className="space-y-6 self-end">
                   <div className="bg-white p-6 rounded-2xl shadow-lg shadow-emerald-900/5">
                     <Heart className="w-8 h-8 text-rose-500 mb-2" />
                     <div className="text-3xl font-bold font-display text-foreground">2.4k+</div>
                     <div className="text-sm text-muted-foreground">Meals Saved</div>
                   </div>
                </div>
                <div className="space-y-6 self-start mt-12">
                   <div className="bg-white p-6 rounded-2xl shadow-lg shadow-emerald-900/5">
                     <Users className="w-8 h-8 text-primary mb-2" />
                     <div className="text-3xl font-bold font-display text-foreground">150+</div>
                     <div className="text-sm text-muted-foreground">Active NGOs</div>
                   </div>
                   <div className="bg-white p-6 rounded-2xl shadow-lg shadow-emerald-900/5">
                     <Globe className="w-8 h-8 text-blue-500 mb-2" />
                     <div className="text-3xl font-bold font-display text-foreground">12</div>
                     <div className="text-sm text-muted-foreground">Cities Covered</div>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
