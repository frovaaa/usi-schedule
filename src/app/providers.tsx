import { ThemeProvider } from '@/components/theme-provider';
import { AppContextProvider } from '@/context/AppContext';

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
      <AppContextProvider>{children}</AppContextProvider>
    </ThemeProvider>
  );
}
