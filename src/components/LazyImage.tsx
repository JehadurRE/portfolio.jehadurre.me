import React, { useState } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ className = '', containerClassName = '', ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Blur Placeholder / Skeleton */}
      <div
        className={`absolute inset-0 bg-secondary-200 dark:bg-secondary-700 animate-pulse transition-opacity duration-500 ${
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />
      <img
        {...props}
        loading="lazy"
        onLoad={(e) => {
          setIsLoaded(true);
          if (props.onLoad) props.onLoad(e);
        }}
        className={`${className} transition-[filter,opacity] duration-700 ease-in-out ${
          isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md'
        }`}
      />
    </div>
  );
};

export default LazyImage;
