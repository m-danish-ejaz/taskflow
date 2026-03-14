type Props = {
  classname?: string;
};

const LoadingSpinner = ({ classname }: Props) => (
  <div className={`fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm ${classname}`}>
    <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-black"></div>
  </div>
);

export default LoadingSpinner;