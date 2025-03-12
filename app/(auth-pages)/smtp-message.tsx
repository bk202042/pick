import { ArrowUpRight, InfoIcon } from 'lucide-react';
import Link from 'next/link';

export interface Message {
  message: string;
  type: 'error' | 'success';
}

export function SmtpMessage() {
  return (
    <div className="mt-4 rounded-md bg-primary/10 px-4 py-3 text-sm text-primary flex gap-2">
      <InfoIcon className="h-4 w-4 mt-0.5" />
      <div>
        <p>
          Note: Sign-up and password reset emails are rate-limited. To increase the rate limit,
          enable Custom SMTP in project settings.
        </p>
        <p className="mt-2">
          <Link
            href="https://supabase.com/docs/guides/auth/auth-smtp"
            target="_blank"
            rel="noreferrer"
            className="inline-flex gap-1 items-center underline"
          >
            Documentation <ArrowUpRight className="h-3 w-3" />
          </Link>
        </p>
      </div>
    </div>
  );
}
