interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8 bg-red-50 rounded-lg shadow-md max-w-md mx-4">
        <h2 className="text-2xl font-bold text-red-900 mb-4">Error</h2>
        <p className="text-red-600 mb-6">{message}</p>
      </div>
    </div>
  );
}