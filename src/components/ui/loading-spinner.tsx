export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center mb-4">
      <div className="w-7 h-7 md:w-16 md:h-16 border-4 border-t-transparent border-green-500 rounded-full animate-spin"></div>
    </div>
  );
}
