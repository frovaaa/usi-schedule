import { ThemeProvider } from '@/components/theme-provider';
import { AppContextProvider } from '@/context/AppContext';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from '@/components/ui/toaster';

export function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <AppContextProvider>
        {children}
        <SpeedInsights />
        <Toaster />
      </AppContextProvider>
    </ThemeProvider>
  );
}
