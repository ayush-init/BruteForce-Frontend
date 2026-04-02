"use client";

import Link from 'next/link';
import { MapPin, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div>
              <h3 className="font-serif italic text-2xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Brute<span className="text-primary">Force</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-2 font-medium">
                Solve Faster.<br />
                Rank Higher.<br />
                Stay Ahead.
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>PW Institute of Innovation</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <nav className="space-y-2">
              <Link href="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/topics" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Topics
              </Link>
              <Link href="/leaderboard" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Leaderboard
              </Link>
              <Link href="/profile" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Profile
              </Link>
            </nav>
          </div>

          {/* Origin Story - HIGHLIGHTED */}
          <div className="relative">
            {/* Glow effect background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg blur-xl"></div>
            
            <div className="relative space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <h4 className="font-semibold text-foreground">Our Story</h4>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                Discover the journey behind Brute Force - how two students transformed their DSA struggles into a platform for thousands.
              </p>
              
              <Link 
                href="/origin" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
              >
                <span className="relative">
                  Read Our Origin
                  <span className="absolute inset-0 bg-primary/20 rounded-lg animate-ping"></span>
                </span>
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Study Material:</span> Comprehensive Class Notes
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Practice Problems:</span> 1000+ DSA Questions
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Progress Tracking:</span> Real-time analytics
              </p>
              
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 BruteForce. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            Built with <Heart className="w-4 h-4 text-primary fill-primary" /> at PW Institute of Innovation
          </p>
        </div>
      </div>
    </footer>
  );
}
