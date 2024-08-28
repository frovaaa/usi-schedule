import { ThemeProvider } from '@/components/theme-provider';
import { AppContextProvider } from '@/context/AppContext';
import { SpeedInsights } from '@vercel/speed-insights/next';

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
      </AppContextProvider>
    </ThemeProvider>
  );
}
