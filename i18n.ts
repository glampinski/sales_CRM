import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Fallback to 'en' if locale is undefined
  const safeLocale = locale || 'en';
  
  try {
    const messages = (await import(`./messages/${safeLocale}.json`)).default;
    
    return {
      locale: safeLocale,
      messages
    };
  } catch (error) {
    console.error('Error loading messages for locale', safeLocale, ':', error);
    // Fallback to English if locale file doesn't exist
    const fallbackMessages = (await import(`./messages/en.json`)).default;
    return {
      locale: 'en',
      messages: fallbackMessages
    };
  }
});
