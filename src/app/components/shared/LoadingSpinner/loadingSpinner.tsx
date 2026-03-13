const LoadingSpinner = () => (
  // Added bg-white/50 for a dimmed look and backdrop-blur for a professional effect
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
    <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-black"></div>
  </div>
);

export default LoadingSpinner;