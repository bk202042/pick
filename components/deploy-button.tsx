import Link from 'next/link';
import { Button } from './ui/button';

export function DeployButton() {
  return (
    <Link
      href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=supabase&repository-name=supabase&demo-title=Supabase%20Next.js%20App%20Router%20Example&demo-description=Simple%20Next.js%20App%20Router%20%2B%20Supabase%20example%20app&demo-url=https%3A%2F%2Fdemogithub.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Favatars.githubusercontent.com%2Fu%2F20226343%3Fs%3D200%26v%3D4&integration-ids=oac_VqOgBHqhEoFTPzGkPd7L0iH6"
      target="_blank"
      rel="noreferrer"
    >
      <Button variant="default" size="sm" className="h-8">
        Deploy to Vercel
      </Button>
    </Link>
  );
}
