import React, { createContext, useContext, ReactNode } from 'react';

type LanguageContextType = {
  t: (key: string) => string;
};

const translations: Record<string, string> = {
  find_your: 'FIND YOUR',
  perfect_stay: 'PERFECT STAY',
  hero_desc: 'Discover the easiest way to rent and manage properties with confidence.',
  get_started_caps: 'GET STARTED',
  role_desc: 'Choose how you would like to proceed with Rennto',
  continue_owner: 'Continue as Owner',
  continue_tenant: 'Continue as Tenant',
  trust_footer: 'Secure • Fast • Trusted Platform',
};

const LanguageContext = createContext<LanguageContextType>({
  t: (key: string) => translations[key] || key,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const t = (key: string) => translations[key] || key;
  return (
    <LanguageContext.Provider value={{ t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
