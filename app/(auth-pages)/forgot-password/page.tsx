import { resetPasswordAction } from '@/app/actions';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md">
      <section>
        <hgroup className="mb-6">
          <h1 className="mb-2 text-2xl font-bold">Forgot Password</h1>
          <p className="text-muted-foreground">
            Enter your email to receive a password reset link.
          </p>
        </hgroup>
      </section>

      <form action={resetPasswordAction} className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>

        <div className="mt-4 flex flex-col gap-6">
          <SubmitButton>Reset Password</SubmitButton>
          <div className="text-sm text-center">
            <Link href="/sign-in" className="underline">
              Back to Login
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
