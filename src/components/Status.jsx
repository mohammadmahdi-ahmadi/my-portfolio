// پیام‌های loading و error که در چند جا استفاده می‌شوند
export function Loading({ text = "Loading..." }) {
  return (
    <p role="status" className="py-10 text-center text-slate-600">
      {text}
    </p>
  );
}

export function ErrorBox({ message, onRetry }) {
  return (
    <div role="alert" className="rounded-lg bg-red-100 p-4 text-red-800">
      <p>{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded border border-red-400 px-3 py-1 text-sm font-medium hover:bg-red-50"
        >
          Try again
        </button>
      )}
    </div>
  );
}
