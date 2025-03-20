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

// New Section Navigation Component
function SectionNavigation() {
  const [activeSection, setActiveSection] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const sections = [
    { name: 'Hero', icon: Trophy, id: 'hero-section', color: 'bg-gradient-to-r from-yellow-400 to-orange-500' },
    { name: 'Prizes', icon: Award, id: 'prizes-section', color: 'bg-gradient-to-r from-emerald-400 to-green-500' },
    { name: 'Sponsors', icon: Users, id: 'sponsors-section', color: 'bg-gradient-to-r from-blue-400 to-indigo-500' },
    { name: 'Judges', icon: Globe2, id: 'judges-section', color: 'bg-gradient-to-r from-red-400 to-pink-500' },
    { name: 'Timeline', icon: Calendar, id: 'timeline-section', color: 'bg-gradient-to-r from-purple-400 to-violet-500' }
  ];

  const scrollToSection = (index: number) => {
    const section = document.getElementById(sections[index].id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(index);
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  return (
    <div 
      className={`fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-3 transition-all duration-300 ${
        isExpanded ? 'translate-x-0' : 'translate-x-16'
      }`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -left-12 top-1/2 -translate-y-1/2 bg-slate-800 p-2 rounded-lg shadow-lg border border-slate-700 hover:border-purple-500/50 transition-all"
      >
        <ChevronUp 
          className={`w-6 h-6 text-white transition-transform duration-300 ${
            isExpanded ? 'rotate-90' : '-rotate-90'
          }`}
        />
      </button>
      
      {sections.map((section, index) => (
        <button
          key={index}
          onClick={() => scrollToSection(index)}
          className={`group flex items-center gap-3 ${
            isExpanded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
          } transition-all duration-300 delay-${index * 100}`}
          style={{ transitionDelay: `${index * 50}ms` }}
        >
          <span className="text-white font-medium bg-slate-800 px-3 py-1.5 rounded-lg shadow-lg border border-slate-700 group-hover:border-purple-500/50 transition-all">
            {section.name}
          </span>
          <div 
            className={`w-12 h-12 rounded-xl shadow-lg flex items-center justify-center ${section.color} ${
              index === activeSection ? 'scale-110' : 'scale-100'
            } group-hover:scale-110 transition-all`}
          >
            <section.icon className="w-6 h-6 text-white" />
          </div>
        </button>
      ))}
    </div>
  );
}

function Home({ openRegister }: { openRegister: () => void }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Handle mouse movement for parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Calculate position as percentage of screen
    const x = (clientX / innerWidth) * 100;
    const y = (clientY / innerHeight) * 100;
    
    setMousePosition({ x, y });
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center" id="hero-section">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-800" />
          <div 
            className="absolute inset-0 transition-all duration-300 ease-out"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80")`,
              backgroundSize: 'cover',
              backgroundPosition: `${50 + (mousePosition.x - 50) * 0.05}% ${50 + (mousePosition.y - 50) * 0.05}%`,
              opacity: isHovering ? 0.5 : 0.3,
              filter: `hue-rotate(${45 + (mousePosition.x * 0.2)}deg) saturate(1.2)`,
              transform: `scale(${isHovering ? 1.05 : 1})`,
              cursor: 'pointer'
            }}
            onClick={() => alert('Background clicked! You could add a special action here.')}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          />
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `
                radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(123, 97, 255, 0.1) 0%, transparent 50%),
                repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(123, 97, 255, 0.03) 50px, rgba(123, 97, 255, 0.03) 100px),
                repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(123, 97, 255, 0.03) 50px, rgba(123, 97, 255, 0.03) 100px)
              `,
              opacity: 0.7,
              transform: `translateX(${(mousePosition.x - 50) * 0.02}px) translateY(${(mousePosition.y - 50) * 0.02}px)`
            }}
          />
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, index) => (
              <div 
                key={index}
                className="absolute rounded-full bg-purple-500/10"
                style={{
                  width: `${Math.random() * 10 + 2}px`,
                  height: `${Math.random() * 10 + 2}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)',
                  animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: Math.random() * 0.5 + 0.2
                }}
              />
            ))}
          </div>
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255, 255, 255, 0.02) 50px, rgba(255, 255, 255, 0.02) 100px),
                repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255, 255, 255, 0.02) 50px, rgba(255, 255, 255, 0.02) 100px)
              `,
              opacity: 0.5,
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-8 w-full h-32 flex items-center justify-center border border-purple-500/20 hover:border-purple-500/40 transition-all group"
              >
                <p className="text-gray-500 text-center group-hover:text-purple-400 transition-colors">Sponsor Logo</p>
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
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="group bg-slate-700/50 backdrop-blur-lg rounded-xl p-8 text-center border border-purple-500/20 hover:border-purple-500/40 transition-all"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 ring-4 ring-purple-500/30">
                  <img
                    src={`https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&q=80`}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2">Judge Name</h3>
                <p className="text-purple-400 mb-4">Bio @ Name</p>
                <p className="text-gray-400">Expert in AI, Machine Learning, and Cloud Computing with 15+ years of industry experience.</p>
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