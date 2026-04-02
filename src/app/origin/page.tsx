"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Linkedin, Github, Mail, ArrowRight, Sparkles, Target, Code, Users, MousePointer, Zap, Trophy, BookOpen, Lightbulb, ChevronDown, Star, Rocket, Heart, MapPin } from 'lucide-react';

const Origin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showAbout, setShowAbout] = useState(false);
  const [showCreators, setShowCreators] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > 200 && !showAbout) {
        setShowAbout(true);
      }
      if (currentScroll > 800 && !showCreators) {
        setShowCreators(true);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showAbout, showCreators]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-8">
            <span className="text-white">Brute</span>
            <span className="text-[#ccff00] ml-3">Force</span>
          </h1>
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-[#ccff00] rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-[#ccff00] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-3 h-3 bg-[#ccff00] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden" ref={containerRef}>
      {/* Floating Dots Background */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#ccff00] rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              opacity: Math.random() * 0.6 + 0.2
            }}
          />
        ))}
      </div>

      {/* Glass Overlay Effect */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />
      
      {/* Mouse Follower */}
      <div 
        className="fixed w-32 h-32 pointer-events-none z-10"
        style={{
          left: mousePosition.x - 64,
          top: mousePosition.y - 64,
          background: 'radial-gradient(circle, rgba(204,255,0,0.1) 0%, transparent 70%)',
          filter: 'blur(20px)',
          transition: 'all 0.3s ease-out'
        }}
      />
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative">
        <div className="text-center z-10">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-full backdrop-blur-sm mb-6">
              <Sparkles className="w-4 h-4 text-[#ccff00]" />
              <span className="text-sm text-[#ccff00]">Our Origin Story</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex items-center justify-center gap-0" style={{ height: '120px' }}>
              <h1 
                className="text-7xl md:text-9xl font-bold"
                style={{ 
                  animation: 'wordType 4s ease-in-out infinite',
                  display: 'inline-block'
                }}
              >
                <span className="text-white">Brute</span>
                <span className="text-[#ccff00] ml-3">Force</span>
              </h1>
            </div>
          </div>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">Every coder starts somewhere. This is where we began our journey to transform DSA learning.</p>
          
          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="glass border border-[#ccff00]/30 rounded-2xl p-6 backdrop-blur-sm">
              <Code className="w-8 h-8 text-[#ccff00] mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">First Principles</h3>
              <p className="text-sm text-gray-300">Master the fundamentals before optimization</p>
            </div>
            <div className="glass border border-[#ccff00]/30 rounded-2xl p-6 backdrop-blur-sm">
              <Target className="w-8 h-8 text-[#ccff00] mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Problem Solving</h3>
              <p className="text-sm text-gray-300">Build logical thinking step by step</p>
            </div>
            <div className="glass border border-[#ccff00]/30 rounded-2xl p-6 backdrop-blur-sm">
              <Zap className="w-8 h-8 text-[#ccff00] mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Optimization</h3>
              <p className="text-sm text-gray-300">Evolve from brute to elegant solutions</p>
            </div>
          </div>
          
          <style jsx>{`
            @keyframes wordType {
              0%, 20% {
                opacity: 0;
                transform: translateY(30px) scale(0.8);
                filter: blur(8px);
              }
              25%, 60% {
                opacity: 1;
                transform: translateY(0) scale(1);
                filter: blur(0px);
              }
              65%, 100% {
                opacity: 0;
                transform: translateY(-30px) scale(0.9);
                filter: blur(5px);
              }
            }
          `}</style>
          
          <div className="flex justify-center">
            <ChevronDown className="w-6 h-6 text-[#ccff00] animate-bounce" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={`py-20 transition-all duration-1000 relative z-10 ${
        showAbout ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-full backdrop-blur-sm mb-6">
              <Lightbulb className="w-10 h-10 text-[#ccff00]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">The Philosophy</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-12">
              When every DSA journey begins, every coder first runs the brute force approach before moving to optimized solutions. Brute Force is not just a method—it's the core foundation of your problem-solving journey. We embrace this fundamental approach because it teaches you to think logically, understand constraints, and build from first principles.
            </p>
            
            {/* Philosophy Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="glass border border-[#ccff00]/30 rounded-2xl p-8 backdrop-blur-sm">
                <BookOpen className="w-12 h-12 text-[#ccff00] mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Learn the Basics</h3>
                <p className="text-gray-300 mb-4">Every expert was once a beginner. Start with the simplest approach, understand the problem deeply, then gradually improve your solution.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-[#ccff00]/20 border border-[#ccff00]/30 rounded-full text-xs text-[#ccff00]">Fundamentals</span>
                  <span className="px-3 py-1 bg-[#ccff00]/20 border border-[#ccff00]/30 rounded-full text-xs text-[#ccff00]">Logic Building</span>
                  <span className="px-3 py-1 bg-[#ccff00]/20 border border-[#ccff00]/30 rounded-full text-xs text-[#ccff00]">Problem Analysis</span>
                </div>
              </div>
              
              <div className="glass border border-[#ccff00]/30 rounded-2xl p-8 backdrop-blur-sm">
                <Rocket className="w-12 h-12 text-[#ccff00] mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Evolve & Optimize</h3>
                <p className="text-gray-300 mb-4">Once you master the basics, learn to optimize. Understand time complexity, space complexity, and write efficient code that scales.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-[#ccff00]/20 border border-[#ccff00]/30 rounded-full text-xs text-[#ccff00]">Optimization</span>
                  <span className="px-3 py-1 bg-[#ccff00]/20 border border-[#ccff00]/30 rounded-full text-xs text-[#ccff00]">Performance</span>
                  <span className="px-3 py-1 bg-[#ccff00]/20 border border-[#ccff00]/30 rounded-full text-xs text-[#ccff00]">Scalability</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-full backdrop-blur-sm mb-6 relative">
              <Rocket className="w-10 h-10 text-[#ccff00]" />
              <div className="absolute inset-0 bg-[#ccff00]/20 rounded-full animate-ping"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Your Learning Journey</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">From first principles to advanced algorithms</p>
          </div>
          
          {/* Journey Timeline */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-[#ccff00]/30">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#ccff00] rounded-full animate-pulse"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#ccff00] rounded-full animate-pulse"></div>
              </div>
              
              <div className="space-y-12">
                <div className="flex items-center justify-center">
                  <div className="group relative">
                    <div className="absolute inset-0 bg-orange-500/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <div className="relative glass border border-[#ccff00]/30 rounded-2xl p-6 backdrop-blur-sm hover:border-orange-400/50 transition-all duration-300 transform hover:scale-105">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-black text-xs font-bold">1</span>
                          <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping"></div>
                        </div>
                        <h3 className="text-xl font-bold text-white">Start Simple</h3>
                      </div>
                      <p className="text-gray-300 mb-4">Write your first brute force solution. Focus on correctness, not efficiency.</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-xs text-orange-400">O(n²) is OK</span>
                        <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-xs text-orange-400">First Draft</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="group relative">
                    <div className="absolute inset-0 bg-purple-500/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <div className="relative glass border border-[#ccff00]/30 rounded-2xl p-6 backdrop-blur-sm hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-black text-xs font-bold">2</span>
                          <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping"></div>
                        </div>
                        <h3 className="text-xl font-bold text-white">Analyze & Improve</h3>
                      </div>
                      <p className="text-gray-300 mb-4">Understand bottlenecks, learn optimization techniques, improve your approach.</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-400">O(n log n)</span>
                        <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-400">Smart Data</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="group relative">
                    <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <div className="relative glass border border-[#ccff00]/30 rounded-2xl p-6 backdrop-blur-sm hover:border-emerald-400/50 transition-all duration-300 transform hover:scale-105">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-black text-xs font-bold">3</span>
                          <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping"></div>
                        </div>
                        <h3 className="text-xl font-bold text-white">Master Complexity</h3>
                      </div>
                      <p className="text-gray-300 mb-4">Write efficient algorithms, understand time/space complexity, solve complex problems.</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs text-emerald-400">O(1) Dreams</span>
                        <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs text-emerald-400">Elite Coder</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={`py-20 transition-all duration-1000 relative z-10 ${
        showCreators ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-full backdrop-blur-sm mb-6">
              <Trophy className="w-10 h-10 text-[#ccff00]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Force Behind Brute Force</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Meet the visionaries who transformed their coding struggles into a platform that empowers thousands.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#ccff00]/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-[#ccff00]/30 rounded-2xl p-8 hover:border-[#ccff00]/50 transition-all duration-300 backdrop-blur-sm">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-28 h-28 bg-gradient-to-br from-[#ccff00]/30 to-[#ccff00]/10 rounded-full flex items-center justify-center border-2 border-[#ccff00]/40 shadow-lg shadow-[#ccff00]/20">
                      <span className="text-3xl font-bold text-[#ccff00]">DN</span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#ccff00] rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-black" />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <h3 className="text-2xl font-bold text-white">Dhruv Narang</h3>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-[#ccff00] rounded-full"></div>
                      <p className="text-[#ccff00] text-sm font-medium">Student, SOP24B1</p>
                      <div className="w-2 h-2 bg-[#ccff00] rounded-full"></div>
                    </div>
                    <p className="text-gray-400 text-xs flex items-center justify-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Bangalore
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <a href="https://linkedin.com/in/dhruv-narang" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-full flex items-center justify-center hover:bg-[#ccff00]/20 hover:scale-110 transition-all duration-300">
                      <Linkedin className="w-6 h-6 text-[#ccff00]" />
                    </a>
                    <a href="https://github.com/dhruv-narang" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-full flex items-center justify-center hover:bg-[#ccff00]/20 hover:scale-110 transition-all duration-300">
                      <Github className="w-6 h-6 text-[#ccff00]" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#ccff00]/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-[#ccff00]/30 rounded-2xl p-8 hover:border-[#ccff00]/50 transition-all duration-300 backdrop-blur-sm">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-28 h-28 bg-gradient-to-br from-[#ccff00]/30 to-[#ccff00]/10 rounded-full flex items-center justify-center border-2 border-[#ccff00]/40 shadow-lg shadow-[#ccff00]/20">
                      <span className="text-3xl font-bold text-[#ccff00]">AC</span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#ccff00] rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-black" />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <h3 className="text-2xl font-bold text-white">Ayush Chaurasiya</h3>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-[#ccff00] rounded-full"></div>
                      <p className="text-[#ccff00] text-sm font-medium">Student, SOP24B1</p>
                      <div className="w-2 h-2 bg-[#ccff00] rounded-full"></div>
                    </div>
                    <p className="text-gray-400 text-xs flex items-center justify-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Bangalore
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <a href="https://linkedin.com/in/ayush-chaurasiya" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-full flex items-center justify-center hover:bg-[#ccff00]/20 hover:scale-110 transition-all duration-300">
                      <Linkedin className="w-6 h-6 text-[#ccff00]" />
                    </a>
                    <a href="https://github.com/ayush-chaurasiya" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-full flex items-center justify-center hover:bg-[#ccff00]/20 hover:scale-110 transition-all duration-300">
                      <Github className="w-6 h-6 text-[#ccff00]" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-12 border-t border-[#ccff00]/20 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-white">Brute</span>
                <span className="text-[#ccff00] ml-2">Force</span>
              </h3>
              <p className="text-gray-400 text-sm">Master DSA from first principles to advanced algorithms.</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center gap-4 mb-4">
                <div className="w-10 h-10 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-full flex items-center justify-center">
                  <Code className="w-5 h-5 text-[#ccff00]" />
                </div>
                <div className="w-10 h-10 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#ccff00]" />
                </div>
                <div className="w-10 h-10 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#ccff00]" />
                </div>
              </div>
              <p className="text-gray-400 text-sm">Built with passion for coding education</p>
            </div>
            
            <div className="text-right">
              <p className="text-gray-400 text-sm mb-2">Connect with us</p>
              <div className="flex justify-end gap-2">
                <a href="#" className="w-8 h-8 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-full flex items-center justify-center hover:bg-[#ccff00]/20 transition-colors">
                  <Github className="w-4 h-4 text-[#ccff00]" />
                </a>
                <a href="#" className="w-8 h-8 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-full flex items-center justify-center hover:bg-[#ccff00]/20 transition-colors">
                  <Linkedin className="w-4 h-4 text-[#ccff00]" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-[#ccff00]/10 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              Made with <Heart className="w-4 h-4 text-[#ccff00] inline mx-1" /> at PW Institute of Innovation
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Origin;
