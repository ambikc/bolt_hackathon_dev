import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Trophy, Calendar, Globe2, Users, Award, Timer, ChevronRight, ChevronUp } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import Register from './pages/Register';
import Confirm from './pages/Confirm';

function ParallaxSection({ children, className = '', id = '' }: { children: React.ReactNode; className?: string; id?: string }) {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false
  });

  return (
    <div 
      ref={ref} 
      id={id} 
      className={`transform transition-all duration-1000 flex flex-col justify-center ${inView ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'} ${className}`}
    >
      {children}
    </div>
  );
}

// Futuristic Lightsaber Scroll Indicator Component
function ScrollProgressIndicator() {
  const [activeSection, setActiveSection] = useState(0);
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);
  const [pulseEffect, setPulseEffect] = useState(false);
  const [manualProgress, setManualProgress] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const sections = [
    { name: 'Hero', icon: Trophy, id: 'hero-section', color: 'from-yellow-400 to-orange-500' },
    { name: 'Prizes', icon: Award, id: 'prizes-section', color: 'from-emerald-400 to-green-500' },
    { name: 'Sponsors', icon: Users, id: 'sponsors-section', color: 'from-blue-400 to-indigo-500' },
    { name: 'Judges', icon: Globe2, id: 'judges-section', color: 'from-red-400 to-pink-500' }
  ];

  const scrollToSection = (index: number) => {
    const section = document.getElementById(sections[index].id);
    if (section) {
      // Calculate the position for the lightsaber fill
      const sectionPosition = (index + 1) / sections.length * 100;
      setManualProgress(sectionPosition);
      setActiveSection(index); // Set active section immediately for visual feedback
      
      // Add pulse effect when clicking
      setPulseEffect(true);
      setTimeout(() => setPulseEffect(false), 700);
      
      // Ensure smooth scrolling with offset for header
      const yOffset = -50; 
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
      
      // Reset manual progress after animation completes
      setTimeout(() => {
        setManualProgress(null);
      }, 1000);
    }
  };

  // Initialize the component with a smooth animation
  useEffect(() => {
    // Delay the initialization to ensure smooth animation
    setTimeout(() => {
      setIsInitialized(true);
      
      // Update active section based on initial scroll position
      updateActiveSection();
    }, 100);
  }, [sections]);

  // Function to determine the active section
  const updateActiveSection = () => {
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i].id);
      if (section) {
        const rect = section.getBoundingClientRect();
        // Consider a section active when it's in the top half of the viewport
        if (rect.top <= window.innerHeight * 0.5) {
          setActiveSection(i);
          break;
        }
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Only update scroll progress if not manually set and component is initialized
      if (manualProgress === null && isInitialized) {
        // Update active section based on scroll position
        updateActiveSection();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections, manualProgress, isInitialized]);
  
  // Calculate the display progress based on active section
  const activeSectionProgress = ((activeSection + 1) / sections.length) * 100;
  
  // Use manual progress if set, otherwise use active section progress
  const displayProgress = manualProgress !== null ? manualProgress : activeSectionProgress;
  
  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 h-[80vh] z-50 hidden md:flex items-center">
      <div className="relative h-full flex flex-col items-center">
        {/* Lightsaber core */}
        <div 
          className={`w-1 rounded-full bg-white transition-all duration-700 ${pulseEffect ? 'animate-pulse' : ''}`}
          style={{
            height: `${displayProgress}%`,
            boxShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #fff',
            opacity: isInitialized ? 1 : 0,
          }}
        />
        
        {/* Energy field around the lightsaber */}
        <div 
          className="absolute w-3 rounded-full bg-white/20 blur-sm transition-all duration-700"
          style={{
            height: `${displayProgress}%`,
            boxShadow: '0 0 15px rgba(255,255,255,0.3), 0 0 30px rgba(255,255,255,0.2)',
            opacity: isInitialized ? 1 : 0,
          }}
        />
        
        {/* Glowing particles along the lightsaber */}
        <div className="absolute w-full h-full pointer-events-none overflow-hidden">
          {isInitialized && [...Array(15)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/80"
              style={{
                left: `${Math.random() * 6 - 3}px`,
                top: `${Math.min(Math.random() * displayProgress, displayProgress - 5)}%`,
                opacity: Math.random() * 0.8 + 0.2,
                filter: 'blur(1px)',
                animation: `float-particle ${Math.random() * 3 + 2}s infinite alternate ease-in-out`,
              }}
            />
          ))}
        </div>
        
        {/* Section indicators along the lightsaber */}
        <div className="absolute h-full w-full">
          {sections.map((section, index) => {
            // Calculate position based on section index and total height
            const sectionPosition = index / (sections.length - 1) * 100;
            const isActive = displayProgress >= sectionPosition;
            const isCurrentSection = index === activeSection;
            
            return (
              <div
                key={index}
                className="absolute left-1/2 -translate-x-1/2 z-10"
                style={{
                  top: `${sectionPosition}%`,
                  opacity: isInitialized ? 1 : 0,
                  transition: 'opacity 0.5s ease-in-out',
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {/* Energy node with integrated icon */}
                <button
                  onClick={() => scrollToSection(index)}
                  onMouseEnter={() => setHoveredSection(index)}
                  onMouseLeave={() => setHoveredSection(null)}
                  className={`relative group flex items-center justify-center transition-all duration-300
                    ${isActive ? 'scale-110' : 'scale-100'}
                    hover:scale-115
                  `}
                >
                  <div 
                    className={`w-10 h-10 rounded-full transition-all duration-500 flex items-center justify-center
                      ${isActive ? 'bg-gradient-to-r ' + section.color : 'bg-slate-800/80'}
                      ${isCurrentSection ? 'animate-pulse-slow' : ''}
                    `}
                    style={{
                      boxShadow: isActive ? `0 0 15px ${section.color.includes('purple') ? 'rgba(168, 85, 247, 0.5)' : section.color.includes('blue') ? 'rgba(59, 130, 246, 0.5)' : section.color.includes('green') ? 'rgba(16, 185, 129, 0.5)' : section.color.includes('yellow') ? 'rgba(245, 158, 11, 0.5)' : 'rgba(236, 72, 153, 0.5)'}` : 'none',
                    }}
                  >
                    <section.icon 
                      className="w-5 h-5 transition-colors duration-300"
                      style={{ color: isActive ? '#fff' : '#4A5568' }}
                    />
                  </div>
                  
                  {/* Tooltip */}
                  <span 
                    className={`absolute left-full ml-4 px-3 py-1.5 bg-slate-800/90 backdrop-blur-sm rounded-lg transition-all duration-300 whitespace-nowrap pointer-events-none border border-white/10
                      ${hoveredSection === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}
                    `}
                    style={{
                      background: isActive ? `linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.8))` : '',
                      boxShadow: isActive ? `0 0 20px rgba(0, 0, 0, 0.2), inset 0 0 0 1px ${section.color.includes('purple') ? 'rgba(168, 85, 247, 0.2)' : section.color.includes('blue') ? 'rgba(59, 130, 246, 0.2)' : section.color.includes('green') ? 'rgba(16, 185, 129, 0.2)' : section.color.includes('yellow') ? 'rgba(245, 158, 11, 0.2)' : 'rgba(236, 72, 153, 0.2)'}` : '',
                    }}
                  >
                    {section.name}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Home({ openRegister }: { openRegister: () => void }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dots, setDots] = useState<{ x: number; y: number; opacity: number; color: string; id: number }[]>([]);
  const [connections, setConnections] = useState<{ from: number; to: number; progress: number; duration: number }[]>([]);
  const [dataPackets, setDataPackets] = useState<{ from: number; to: number; progress: number; color: string; id: number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Generate dot matrix on component mount
  useEffect(() => {
    try {
      const dotCount = Math.floor(window.innerWidth * window.innerHeight / 15000); // Adjust density
      const newDots = [];
      
      // Generate dots
      for (let i = 0; i < dotCount; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const opacity = Math.random() * 0.5 + 0.3; // Between 0.3 and 0.8
        
        // Make some dots a subtle blue to represent key nodes, others more muted colors
        const color = Math.random() > 0.9 
          ? 'rgb(59, 89, 152)' // Muted blue
          : Math.random() > 0.5 
            ? 'rgb(180, 180, 180)' // Light gray
            : 'rgb(100, 100, 100)'; // Dark gray
        
        newDots.push({
          x,
          y,
          opacity,
          color,
          id: i
        });
      }
      
      setDots(newDots);
      
      // Create initial connections
      const initialConnections = [];
      const connectionCount = Math.floor(dotCount * 0.3); // Connect about 30% of dots
      
      for (let i = 0; i < connectionCount; i++) {
        const fromDot = Math.floor(Math.random() * dotCount);
        let toDot = Math.floor(Math.random() * dotCount);
        
        // Avoid self-connections
        while (toDot === fromDot) {
          toDot = Math.floor(Math.random() * dotCount);
        }
        
        initialConnections.push({
          from: fromDot,
          to: toDot,
          progress: Math.random(), // Start with random progress
          duration: Math.random() * 3000 + 2000 // Between 2-5 seconds
        });
      }
      
      setConnections(initialConnections);
    } catch (err) {
      console.error("Error generating dot matrix:", err);
      setError("Error generating dot matrix: " + String(err));
    }
  }, []);
  
  // Animate connections and create new ones at random intervals
  useEffect(() => {
    if (dots.length === 0) return;
    
    try {
      // Animation interval for existing connections
      const connectionInterval = setInterval(() => {
        setConnections(prevConnections => {
          return prevConnections.map(conn => {
            // Increment progress
            let newProgress = conn.progress + (1000 / conn.duration) * 0.05;
            
            // Reset if complete
            if (newProgress >= 1) {
              // 70% chance to keep the connection but restart it
              if (Math.random() < 0.7) {
                newProgress = 0;
              } else {
                // Create a new random connection
                const fromDot = Math.floor(Math.random() * dots.length);
                let toDot = Math.floor(Math.random() * dots.length);
                
                // Avoid self-connections
                while (toDot === fromDot) {
                  toDot = Math.floor(Math.random() * dots.length);
                }
                
                return {
                  from: fromDot,
                  to: toDot,
                  progress: 0,
                  duration: Math.random() * 3000 + 2000 // Between 2-5 seconds
                };
              }
            }
            
            return {
              ...conn,
              progress: newProgress
            };
          });
        });
      }, 50);
      
      // Create new data packet transmissions at random intervals
      const dataPacketInterval = setInterval(() => {
        // Only create a new data packet if we have fewer than 15 active ones
        if (Math.random() < 0.3) { // 30% chance every interval
          setDataPackets(prevPackets => {
            // Remove completed packets
            const activePackets = prevPackets.filter(packet => packet.progress < 1);
            
            // Only add new if we have fewer than 15
            if (activePackets.length < 15) {
              // Select random dots, preferring blue dots as sources
              const blueDots = dots.filter(dot => dot.color === 'rgb(59, 89, 152)');
              const fromDot = blueDots.length > 0 && Math.random() < 0.7 
                ? blueDots[Math.floor(Math.random() * blueDots.length)].id 
                : Math.floor(Math.random() * dots.length);
              
              let toDot = Math.floor(Math.random() * dots.length);
              
              // Avoid self-connections
              while (toDot === fromDot) {
                toDot = Math.floor(Math.random() * dots.length);
              }
              
              // Colors for data packets - more subtle colors
              const packetColors = [
                'rgba(59, 89, 152, 0.7)', // Muted blue
                'rgba(67, 95, 87, 0.7)',  // Muted teal
                'rgba(112, 101, 67, 0.7)', // Muted gold
                'rgba(95, 75, 95, 0.7)'    // Muted purple
              ];
              
              return [...activePackets, {
                from: fromDot,
                to: toDot,
                progress: 0,
                color: packetColors[Math.floor(Math.random() * packetColors.length)],
                id: Date.now() + Math.random()
              }];
            }
            
            return activePackets;
          });
        }
        
        // Animate existing data packets
        setDataPackets(prevPackets => {
          return prevPackets.map(packet => {
            // Move packet along its path
            const newProgress = packet.progress + 0.03; // Speed of packet
            
            return {
              ...packet,
              progress: newProgress
            };
          });
        });
      }, 100);
      
      return () => {
        clearInterval(connectionInterval);
        clearInterval(dataPacketInterval);
      };
    } catch (err) {
      console.error("Error in animation:", err);
      setError("Error in animation: " + String(err));
    }
  }, [dots]);
  
  // Handle mouse movement for dot matrix and parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    try {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate position as percentage of screen
      const x = (clientX / innerWidth) * 100;
      const y = (clientY / innerHeight) * 100;
      
      setMousePosition({ x, y });
    } catch (err) {
      console.error("Error in mouse movement handler:", err);
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-black to-slate-900 text-white overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center" id="hero-section">
        <div className="absolute inset-0 z-0">
          {/* Error message if something went wrong */}
          {error && (
            <div className="absolute top-4 left-4 bg-red-500 text-white p-2 rounded z-50">
              {error}
            </div>
          )}
          
          {/* Dot matrix background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Connections between dots */}
            <svg className="absolute inset-0 w-full h-full">
              {connections.map((conn, index) => {
                const fromDot = dots.find(d => d.id === conn.from);
                const toDot = dots.find(d => d.id === conn.to);
                
                if (!fromDot || !toDot) return null;
                
                // Calculate the point along the line based on progress
                const x1 = fromDot.x;
                const y1 = fromDot.y;
                const x2 = toDot.x;
                const y2 = toDot.y;
                
                // Only draw the line up to the current progress
                const currentX = x1 + (x2 - x1) * conn.progress;
                const currentY = y1 + (y2 - y1) * conn.progress;
                
                return (
                  <line
                    key={index}
                    x1={x1}
                    y1={y1}
                    x2={currentX}
                    y2={currentY}
                    stroke={fromDot.color === 'rgb(59, 89, 152)' ? 'rgba(59, 89, 152, 0.3)' : 'rgba(100, 100, 100, 0.15)'}
                    strokeWidth="0.5"
                    className="connection-line"
                  />
                );
              })}
              
              {/* Data packets traveling along connections */}
              {dataPackets.map((packet, index) => {
                const fromDot = dots.find(d => d.id === packet.from);
                const toDot = dots.find(d => d.id === packet.to);
                
                if (!fromDot || !toDot) return null;
                
                // Calculate the point along the line based on progress
                const x1 = fromDot.x;
                const y1 = fromDot.y;
                const x2 = toDot.x;
                const y2 = toDot.y;
                
                // Current position of the packet
                const packetX = x1 + (x2 - x1) * packet.progress;
                const packetY = y1 + (y2 - y1) * packet.progress;
                
                return (
                  <g key={index}>
                    {/* Line showing the path */}
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={packet.color.replace('0.7', '0.2')}
                      strokeWidth="0.5"
                      strokeDasharray="2,2"
                    />
                    {/* The data packet */}
                    <circle
                      cx={packetX}
                      cy={packetY}
                      r="2"
                      fill={packet.color}
                      className="data-packet"
                    >
                      <animate
                        attributeName="r"
                        values="2;3;2"
                        dur="1s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                );
              })}
            </svg>
            
            {/* Dots */}
            {dots.map((dot, index) => (
              <div
                key={index}
                className={`absolute w-0.5 h-0.5 rounded-full ${dot.color === 'rgb(59, 89, 152)' ? 'dot-blue' : 'dot-muted'}`}
                style={{
                  left: `calc(${dot.x}px + ${(mousePosition.x - 50) * 0.05}px)`,
                  top: `calc(${dot.y}px + ${(mousePosition.y - 50) * 0.05}px)`,
                  backgroundColor: dot.color,
                  opacity: dot.opacity,
                  transform: `scale(${
                    Math.sqrt(
                      Math.pow(dot.x - mousePosition.x * (window.innerWidth / 100), 2) +
                      Math.pow(dot.y - mousePosition.y * (window.innerHeight / 100), 2)
                    ) < 100 ? 1.5 : 1
                  })`
                }}
              />
            ))}
          </div>
          {/* Digital grid overlay */}
          <div 
            className="absolute inset-0 digital-grid" 
            style={{
              opacity: 0.2,
              transform: `translateX(${(mousePosition.x - 50) * 0.02}px) translateY(${(mousePosition.y - 50) * 0.02}px)`
            }}
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 
              className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 text-transparent bg-clip-text mb-6 animate-gradient text-glitch" 
              data-text="The World's Largest Hackathon"
            >
              The World's Largest Hackathon
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 font-mono">
              Join thousands of developers worldwide in this virtual coding extravaganza
            </p>
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <button 
                onClick={openRegister}
                className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-semibold text-lg transition-all flex items-center gap-2 hover:scale-105 transform"
              >
                Register Now 
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-2 text-gray-300">
                <Globe2 className="w-5 h-5" />
                <span>Virtual Event</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-3 bg-white rounded-full animate-scroll" />
          </div>
        </div>
      </header>

      {/* Prize Section */}
      <ParallaxSection className="py-20 bg-slate-800/50 min-h-screen" id="prizes-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">$1M+ in Prizes</h2>
            <p className="text-gray-400">Compete for life-changing rewards across multiple tracks</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Trophy,
                title: "Grand Prize",
                amount: "$500,000",
                description: "For the most innovative solution"
              },
              {
                icon: Award,
                title: "Category Prizes",
                amount: "$250,000",
                description: "For winners in specific tracks"
              },
              {
                icon: Users,
                title: "Community Choice",
                amount: "$250,000",
                description: "Voted by the community"
              }
            ].map((prize, index) => (
              <div 
                key={index} 
                className="group bg-slate-700/50 backdrop-blur-lg rounded-xl p-8 text-center hover:transform hover:-translate-y-2 transition-all duration-300 border border-purple-500/20 hover:border-purple-500/40"
              >
                <prize.icon className="w-12 h-12 mx-auto mb-4 text-purple-400 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-2">{prize.title}</h3>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">{prize.amount}</p>
                <p className="text-gray-400">{prize.description}</p>
              </div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Sponsors Section */}
      <ParallaxSection className="py-20 bg-slate-900 min-h-screen" id="sponsors-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">Our Sponsors</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-center justify-items-center">
            {[
              {
                name: "Supabase",
                twitter: "supabase",
                description: "Open source Firebase alternative"
              },
              {
                name: "Netlify",
                twitter: "Netlify",
                description: "Web hosting and automation platform"
              },
              {
                name: "Cloudflare",
                twitter: "CloudflareDev",
                description: "Web performance & security"
              },
              {
                name: "Sentry",
                twitter: "getsentry",
                description: "Application monitoring platform"
              },
              {
                name: "Loops",
                twitter: "loops",
                description: "Email marketing automation"
              },
              {
                name: "Algorand Foundation",
                twitter: "AlgoFoundation",
                description: "Carbon-negative blockchain technology"
              }
            ].map((sponsor, i) => (
              <div 
                key={i} 
                className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-8 w-full h-32 flex flex-col items-center justify-center border border-purple-500/20 hover:border-purple-500/40 transition-all group"
              >
                <h3 className="text-xl font-bold mb-1 text-white">{sponsor.name}</h3>
                <a 
                  href={`https://x.com/${sponsor.twitter}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-purple-400 hover:text-purple-300 text-sm mb-2"
                >
                  @{sponsor.twitter}
                </a>
                <p className="text-gray-400 text-xs text-center">{sponsor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Judges Section */}
      <ParallaxSection className="py-20 bg-slate-800/50 min-h-screen" id="judges-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">Meet Our Judges</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                name: "Ben Tossell", 
                twitter: "bentossell", 
                bio: "Founder @ Makerpad",
                expertise: "No-code expert and startup advisor with extensive experience in building communities."
              },
              { 
                name: "Alex Albert", 
                twitter: "alexalbert__", 
                bio: "Co-founder @ Codeium",
                expertise: "AI and developer tools expert with a background in building intelligent coding assistants."
              },
              { 
                name: "Sarah Guo", 
                twitter: "saranormous", 
                bio: "Founder @ Conviction",
                expertise: "Venture capitalist with expertise in AI, security, and enterprise software."
              },
              { 
                name: "Theo", 
                twitter: "theo", 
                bio: "Creator & Developer",
                expertise: "Full-stack developer and educator known for creating content on web development and startups."
              },
              { 
                name: "Evan You", 
                twitter: "youyuxi", 
                bio: "Creator of Vue.js",
                expertise: "Open source developer and creator of one of the most popular JavaScript frameworks."
              },
              { 
                name: "KP", 
                twitter: "thisiskp_", 
                bio: "Founder @ Phantom",
                expertise: "Crypto and web3 expert with experience building blockchain applications and wallets."
              },
              { 
                name: "Pieter Levels", 
                twitter: "levelsio", 
                bio: "Maker @ Nomad List",
                expertise: "Serial indie maker known for building profitable bootstrapped startups and products."
              },
              { 
                name: "Logan Kilpatrick", 
                twitter: "OfficialLoganK", 
                bio: "Developer Relations @ OpenAI",
                expertise: "AI and machine learning expert with experience in developer communities and education."
              }
            ].map((judge, i) => (
              <div 
                key={i} 
                className="group bg-slate-700/50 backdrop-blur-lg rounded-xl p-8 text-center border border-purple-500/20 hover:border-purple-500/40 transition-all"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 ring-4 ring-purple-500/30">
                  <img
                    src={`https://unavatar.io/twitter/${judge.twitter}`}
                    alt={judge.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback if Twitter image fails to load
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(judge.name)}&background=6D28D9&color=fff`;
                    }}
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2">{judge.name}</h3>
                <p className="text-purple-400 mb-4">{judge.bio} <a href={`https://x.com/${judge.twitter}`} target="_blank" rel="noopener noreferrer" className="hover:text-purple-300">@{judge.twitter}</a></p>
                <p className="text-gray-400">{judge.expertise}</p>
              </div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Timeline Section */}
      <ParallaxSection className="py-20 bg-slate-900 min-h-screen" id="timeline-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">Event Timeline</h2>
            <p className="text-gray-400">Mark your calendar for these important dates</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Calendar, title: "Registration Opens", date: "Coming Soon" },
              { icon: Timer, title: "Kickoff Event", date: "TBD" },
              { icon: Users, title: "Submission Deadline", date: "TBD" },
              { icon: Trophy, title: "Winners Announced", date: "TBD" }
            ].map((event, index) => (
              <div 
                key={index} 
                className="group bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 text-center border border-purple-500/20 hover:border-purple-500/40 transition-all"
              >
                <event.icon className="w-8 h-8 mx-auto mb-4 text-purple-400 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <p className="text-gray-400">{event.date}</p>
              </div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Back to top button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-slate-800 p-2 rounded-full shadow-lg border border-slate-700 hover:border-purple-500/50 transition-all"
      >
        <ChevronUp className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}

function App() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  return (
    <div className="relative">
      <ScrollProgressIndicator />
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="relative max-w-md w-full">
            <button 
              onClick={() => setShowRegisterModal(false)}
              className="absolute -top-12 right-2 bg-slate-800/90 p-2 rounded-full hover:bg-slate-700 transition-colors z-10 shadow-lg"
              aria-label="Close registration form"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <Register onClose={() => setShowRegisterModal(false)} />
          </div>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Home openRegister={() => setShowRegisterModal(true)} />} />
        <Route path="/confirm" element={<Confirm />} />
      </Routes>
    </div>
  );
}

export default App;