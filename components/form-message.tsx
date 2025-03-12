export type Message = { success: string } | { error: string } | null;

export interface FormMessageProps {
  message: Message;
}

export function FormMessage({ message }: FormMessageProps) {
  if (!message) return null;

  if ('success' in message) {
    return <p className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">{message.success}</p>;
  }

  if ('error' in message) {
    return <p className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">{message.error}</p>;
  }

  return <p className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-md">{message.message}</p>;
}

export interface FormMessageFromSearchParamsProps {
  searchParams?: { message?: string; type?: string };
}

export function FormMessage({ searchParams }: FormMessageFromSearchParamsProps) {
  if (!searchParams?.message) return null;

  const type = searchParams.type || 'success';
  const message = searchParams.message;

  const baseStyles = 'mt-4 p-4 rounded-md';

  if (type === 'error') {
    return <p className={`${baseStyles} bg-red-50 text-red-700`}>{message}</p>;
  }

  return <p className={`${baseStyles} bg-green-50 text-green-700`}>{message}</p>;
}
