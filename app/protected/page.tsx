import { FetchDataSteps } from '@/components/tutorial/fetch-data-steps';
import { createClient } from '@/utils/supabase/server';
import { InfoIcon } from 'lucide-react';
import { redirect } from 'next/navigation';

import FetchDataSteps from '@/components/tutorial/fetch-data-steps';

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full">
        <div className="py-12 border-b">
          <div className="container flex items-center gap-2 text-sm">
            <InfoIcon className="w-4 h-4" />
            <p>You are signed in as {user.email}</p>
          </div>
        </div>

        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8">Your user details</h1>
          <pre className="bg-muted p-4 rounded-lg text-sm">{JSON.stringify(user, null, 2)}</pre>
        </div>
      </div>

      <FetchDataSteps />
    </div>
  );
}
