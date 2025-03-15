import { DeployButton } from '@/components/deploy-button';
import { EnvVarWarning } from '@/components/env-var-warning';
import HeaderAuth from '@/components/header-auth';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { checkEnvVar } from '@/utils/supabase/check-env-vars';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import '@/app/globals.css';

export const metadata = {
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase',
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isEnvVarDefined = checkEnvVar();

  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider enableSystem={true} attribute="class">
          <div className="flex flex-col min-h-screen">
            <div className="container mx-auto py-4 flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <Link href="/" className="text-foreground/90 font-medium tracking-tight">
                  LOGO
                </Link>
                {!isEnvVarDefined && process.env.NODE_ENV === 'development' && (
                  <Link href="https://supabase.com/" target="_blank">
                    <EnvVarWarning />
                  </Link>
                )}
              </div>
              <div className="flex gap-3 items-center">
                <DeployButton />
                <HeaderAuth />
                <ThemeSwitcher />
              </div>
            </div>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
