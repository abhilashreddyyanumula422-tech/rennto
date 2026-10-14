import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
];

type LanguageContextType = {
  language: string;
  setLanguage: (code: string) => Promise<void>;
  languages: LanguageOption[];
  t: (key: string) => string;
};

const translations: Record<string, Record<string, string>> = {
  en: {
    find_your: 'FIND YOUR',
    perfect_stay: 'PERFECT STAY',
    hero_desc: 'Discover the easiest way to rent and manage properties with confidence.',
    get_started_caps: 'GET STARTED',
    role_desc: 'Choose how you would like to proceed with Rennto',
    continue_owner: 'Continue as Owner',
    continue_tenant: 'Continue as Tenant',
    trust_footer: 'Secure • Fast • Trusted Platform',
    basic_information: 'Basic Information',
    account_actions: 'Account Actions',
    languages: 'Languages',
    request_history: 'Request History',
    notifications: 'Notifications',
    logout: 'Logout',
    phone: 'Phone',
    resident: 'Resident',
    logout_confirm: 'Are you sure you want to logout?',
    cancel: 'CANCEL',
  },
  hi: {
    find_your: 'ढूंढें अपना',
    perfect_stay: 'उत्तम आवास',
    hero_desc: 'विश्वास के साथ संपत्तियों को किराए पर लेने और प्रबंधित करने का सबसे आसान तरीका खोजें।',
    get_started_caps: 'शुरू करें',
    role_desc: 'चुनें कि आप रेन्टो के साथ कैसे आगे बढ़ना चाहते हैं',
    continue_owner: 'मालिक के रूप में जारी रखें',
    continue_tenant: 'किरायेदार के रूप में जारी रखें',
    trust_footer: 'सुरक्षित • तेज़ • विश्वसनीय प्लेटफ़ॉर्म',
    basic_information: 'बुनियादी जानकारी',
    account_actions: 'खाता क्रियाएँ',
    languages: 'भाषाएं',
    request_history: 'अनुरोध इतिहास',
    notifications: 'सूचनाएं',
    logout: 'लॉग आउट',
    phone: 'फ़ोन',
    resident: 'निवासी',
    logout_confirm: 'क्या आप वाकई लॉग आउट करना चाहते हैं?',
    cancel: 'रद्द करें',
  },
  te: {
    find_your: 'కనుగొనండి',
    perfect_stay: 'ఉత్తమ నివాసం',
    hero_desc: 'నమ్మకంతో ప్రాపర్టీలను అద్దెకు తీసుకోవడానికి మరియు నిర్వహించడానికి సులభమైన మార్గం.',
    get_started_caps: 'ప్రారంభించండి',
    role_desc: 'రెంటోతో మీరు ఎలా కొనసాగించాలనుకుంటున్నారో ఎంచుకోండి',
    continue_owner: 'యజమానిగా కొనసాగించండి',
    continue_tenant: 'అద్దెదారుగా కొనసాగించండి',
    trust_footer: 'సురక్షితమైనది • వేగవంతమైనది • విశ్వసనీయమైనది',
    basic_information: 'ప్రాథమిక సమాచారం',
    account_actions: 'ఖాతా చర్యలు',
    languages: 'భాషలు',
    request_history: 'అభ్యర్థన చరిత్ర',
    notifications: 'నోటిఫికేషన్‌లు',
    logout: 'లాగ్ అవుట్',
    phone: 'ఫోన్',
    resident: 'నివాసి',
    logout_confirm: 'మీరు ఖచ్చితంగా లాగ్ అవుట్ చేయాలనుకుంటున్నారా?',
    cancel: 'రద్దు చేయండి',
  },
  ta: {
    find_your: 'கண்டறியுங்கள்',
    perfect_stay: 'சிறந்த தங்குமிடம்',
    hero_desc: 'நம்பிக்கையுடன் சொத்துக்களை வாடகைக்கு எடுத்து நிர்வகிக்க எளிய வழி.',
    get_started_caps: 'தொடங்குங்கள்',
    role_desc: 'ரென்டோவுடன் எவ்வாறு தொடர விரும்புகிறீர்கள் என்பதைத் தேர்ந்தெடுக்கவும்',
    continue_owner: 'உரிமையாளராக தொடரவும்',
    continue_tenant: 'வாடகைதாரராக தொடரவும்',
    trust_footer: 'பாதுகாப்பானது • விரைவானது • நம்பகமானது',
    basic_information: 'அடிப்படை தகவல்',
    account_actions: 'கணக்கு செயல்கள்',
    languages: 'மொழிகள்',
    request_history: 'கோரிக்கை வரலாறு',
    notifications: 'அறிவிப்புகள்',
    logout: 'வெளியேறு',
    phone: 'தொலைபேசி',
    resident: 'குடியிருப்பாளர்',
    logout_confirm: 'நீங்கள் நிச்சயமாக வெளியேற விரும்புகிறீர்களா?',
    cancel: 'ரத்துசெய்',
  },
  kn: {
    find_your: 'ಹುಡುಕಿ',
    perfect_stay: 'ಉತ್ತಮ ವಾಸಸ್ಥಳ',
    hero_desc: 'ವಿಶ್ವಾಸದಿಂದ ಆಸ್ತಿಗಳನ್ನು ಬಾಡಿಗೆಗೆ ಪಡೆಯಲು ಮತ್ತು ನಿರ್ವಹಿಸಲು ಸುಲಭವಾದ ಮಾರ್ಗ.',
    get_started_caps: 'ಪ್ರಾರಂಭಿಸಿ',
    role_desc: 'ರೆಂಟೊ ಜೊತೆಗೆ ನೀವು ಹೇಗೆ ಮುಂದುವರಿಯಲು ಬಯಸುತ್ತೀರಿ ಎಂಬುದನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    continue_owner: 'ಮಾಲೀಕರಾಗಿ ಮುಂದುವರಿಯಿರಿ',
    continue_tenant: 'ಬಾಡಿಗೆದಾರರಾಗಿ ಮುಂದುವರಿಯಿರಿ',
    trust_footer: 'ಸುರಕ್ಷಿತ • ವೇಗದ • ವಿಶ್ವಾಸಾರ್ಹ',
    basic_information: 'ಮೂಲಭೂತ ಮಾಹಿತಿ',
    account_actions: 'ಖಾತೆ ಕ್ರಮಗಳು',
    languages: 'ಭಾಷೆಗಳು',
    request_history: 'ವಿನಂತಿ ಇತಿಹಾಸ',
    notifications: 'ಸೂಚನೆಗಳು',
    logout: 'ಲಾಗ್ ಔಟ್',
    phone: 'ದೂರವಾಣಿ',
    resident: 'ನಿವಾಸಿ',
    logout_confirm: 'ನೀವು ಖಚಿತವಾಗಿ ಲಾಗ್ ಔಟ್ ಮಾಡಲು ಬಯಸುವಿರಾ?',
    cancel: 'ರದ್ದುಮಾಡಿ',
  },
  es: {
    find_your: 'ENCUENTRA TU',
    perfect_stay: 'ESTANCIA PERFECTA',
    hero_desc: 'Descubre la forma más fácil de alquilar y gestionar propiedades con total confianza.',
    get_started_caps: 'COMENZAR',
    role_desc: 'Elige cómo deseas continuar con Rennto',
    continue_owner: 'Continuar como Propietario',
    continue_tenant: 'Continuar como Inquilino',
    trust_footer: 'Seguro • Rápido • Confiable',
    basic_information: 'Información Básica',
    account_actions: 'Acciones de Cuenta',
    languages: 'Idiomas',
    request_history: 'Historial de Solicitudes',
    notifications: 'Notificaciones',
    logout: 'Cerrar Sesión',
    phone: 'Teléfono',
    resident: 'Residente',
    logout_confirm: '¿Estás seguro de que quieres cerrar sesión?',
    cancel: 'CANCELAR',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: async () => {},
  languages: SUPPORTED_LANGUAGES,
  t: (key: string) => key,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<string>('en');

  useEffect(() => {
    // Load persisted language
    AsyncStorage.getItem('@rennto_language').then((saved) => {
      if (saved) {
        setLanguageState(saved);
      }
    }).catch(() => {});
  }, []);

  const setLanguage = async (code: string) => {
    setLanguageState(code);
    try {
      await AsyncStorage.setItem('@rennto_language', code);
    } catch {
      // Ignore write errors
    }
  };

  const t = (key: string) => {
    const langDict = translations[language] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages: SUPPORTED_LANGUAGES, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
