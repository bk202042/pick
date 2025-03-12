import Link from 'next/link';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export function EnvVarWarning() {
  return (
    <div className="p-4 bg-background border flex flex-col items-center rounded-lg">
      <Badge variant="outline" className="mb-2 py-1 px-3">
        Development Environment
      </Badge>
      <div className="flex flex-col gap-3 items-center">
        <ul className="list-disc list-inside text-xs text-foreground/80 space-y-1">
          <li>Create a Supabase account</li>
          <li>Create a new project</li>
        </ul>
        <Link href="https://supabase.com/dashboard/sign-in" target="_blank">
          <Button variant="outline" className="text-xs h-8">
            Go to Supabase Dashboard
          </Button>
        </Link>
        <Link
          href="https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs"
          target="_blank"
        >
          <Button variant="default" className="text-xs h-8">
            Read the docs
          </Button>
        </Link>
      </div>
    </div>
  );
}
