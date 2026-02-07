import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        
        {/* Animated P letter outline */}
        <path
          d="M 30 20 L 30 80 M 30 20 L 55 20 Q 70 20 70 35 Q 70 50 55 50 L 30 50"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-loader-path"
        />
        
        {/* Animated circle at the top of P */}
        <circle
          cx="70"
          cy="35"
          r="3"
          fill="#6366f1"
          className="animate-loader-pulse"
        />
      </svg>
    </div>
  );
};

export const PageLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader size="lg" />
    </div>
  );
};

export const ButtonLoader: React.FC = () => {
  return <Loader size="sm" className="inline-block" />;
};

export const FullPageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <Loader size="xl" />
        <p className="mt-4 text-sm font-bold text-neutral-600 dark:text-neutral-400">
          Loading...
        </p>
      </div>
    </div>
  );
};
