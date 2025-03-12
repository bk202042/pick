import { signUpAction } from '@/app/actions';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="w-full max-w-md">
      <section>
        <hgroup className="mb-6">
          <h1 className="mb-2 text-2xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground">Enter your details to register</p>
        </hgroup>
      </section>

      <form action={signUpAction} className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input id="confirm-password" name="confirm_password" type="password" required />
        </div>

        <div className="mt-4 flex flex-col gap-6">
          <SubmitButton>Sign Up</SubmitButton>
          <div className="text-sm text-center">
            Already have an account?{' '}
            <Link href="/sign-in" className="underline">
              Sign in
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
