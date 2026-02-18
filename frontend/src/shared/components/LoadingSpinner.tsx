interface Props {
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-4',
};

export default function LoadingSpinner({ size = 'md' }: Props) {
  return (
    <div
      className={`${sizes[size]} rounded-full border-gray-200 border-t-purple-500 animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
}
