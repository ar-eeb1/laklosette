import React from 'react';

const Loading = () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-white">
      {/* Animated closet/wardrobe icon */}
      <div className="relative mb-8">
        <svg 
          className="w-32 h-32" 
          viewBox="0 0 120 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left door */}
          <rect 
            x="20" 
            y="20" 
            width="38" 
            height="80" 
            rx="2" 
            fill="#1f2937"
            className="origin-left"
            style={{
              animation: 'doorOpen 2s ease-in-out infinite',
              transformOrigin: '20px center'
            }}
          />
          {/* Right door */}
          <rect 
            x="62" 
            y="20" 
            width="38" 
            height="80" 
            rx="2" 
            fill="#1f2937"
            className="origin-right"
            style={{
              animation: 'doorOpen 2s ease-in-out infinite',
              transformOrigin: '100px center',
              animationDelay: '0.1s'
            }}
          />
          
          {/* Door handles */}
          <circle cx="52" cy="60" r="3" fill="#4b5563" />
          <circle cx="68" cy="60" r="3" fill="#4b5563" />
          
          {/* Frame outline */}
          <rect 
            x="18" 
            y="18" 
            width="84" 
            height="84" 
            rx="3" 
            stroke="#374151"
            strokeWidth="2"
            fill="none"
          />
          
          {/* Base */}
          <rect x="15" y="100" width="90" height="6" rx="1" fill="#1f2937" />
          
          {/* Decorative panels on doors */}
          <rect x="25" y="30" width="28" height="20" rx="1" stroke="#4b5563" strokeWidth="1.5" fill="none" opacity="0.5" />
          <rect x="25" y="55" width="28" height="20" rx="1" stroke="#4b5563" strokeWidth="1.5" fill="none" opacity="0.5" />
          <rect x="67" y="30" width="28" height="20" rx="1" stroke="#4b5563" strokeWidth="1.5" fill="none" opacity="0.5" />
          <rect x="67" y="55" width="28" height="20" rx="1" stroke="#4b5563" strokeWidth="1.5" fill="none" opacity="0.5" />
        </svg>
        
        {/* Sparkle effects with dashboard colors */}
        <div className="absolute top-0 right-0 w-3 h-3 rounded-full animate-ping opacity-75" style={{backgroundColor: '#10b981'}}></div>
        <div className="absolute bottom-4 left-0 w-3 h-3 rounded-full animate-ping opacity-75" style={{backgroundColor: '#3b82f6', animationDelay: '0.5s'}}></div>
        <div className="absolute top-4 left-0 w-2 h-2 rounded-full animate-ping opacity-75" style={{backgroundColor: '#f59e0b', animationDelay: '1s'}}></div>
      </div>

      {/* Brand name */}
      <h1 className="text-5xl font-bold text-gray-800 mb-2 tracking-wide" style={{fontFamily: 'serif'}}>
        La Klosette
      </h1>
      <p className="text-gray-600 text-sm mb-8 italic">Your Premium Wardrobe Solution</p>

      {/* Loading spinner with dashboard colors */}
      <div className="flex space-x-2 mb-4">
        <div className="w-3 h-3 rounded-full animate-bounce" style={{backgroundColor: '#10b981'}}></div>
        <div className="w-3 h-3 rounded-full animate-bounce" style={{backgroundColor: '#3b82f6', animationDelay: '0.1s'}}></div>
        <div className="w-3 h-3 rounded-full animate-bounce" style={{backgroundColor: '#f59e0b', animationDelay: '0.2s'}}></div>
        <div className="w-3 h-3 rounded-full animate-bounce" style={{backgroundColor: '#06b6d4', animationDelay: '0.3s'}}></div>
      </div>

      {/* Loading text */}
      <p className="text-gray-700 text-sm font-medium animate-pulse">
        Loading your dashboard...
      </p>

      <style jsx>{`
        @keyframes doorOpen {
          0%, 100% {
            transform: scaleX(1);
            opacity: 1;
          }
          50% {
            transform: scaleX(0.95);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;