import { resetPasswordAction } from '@/app/actions';
import { FormMessageFromSearchParams } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: { message?: string; type?: string };
}) {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        action={resetPasswordAction}
      >
        <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
        <p className="text-sm text-muted-foreground mb-4">Please enter your new password below.</p>
        <FormMessageFromSearchParams searchParams={searchParams} />
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input type="password" name="password" placeholder="New password" required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input type="password" name="confirmPassword" placeholder="Confirm password" required />
        </div>

        <div className="mt-4">
          <SubmitButton className="w-full">Reset password</SubmitButton>
        </div>
      </form>
    </div>
  );
}
