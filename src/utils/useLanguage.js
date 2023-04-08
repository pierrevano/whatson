/**
 * Gets the language of the user's browser.
 * @returns {string} The language code of the user's browser.
 */
export const getLanguage = () => {
  const { language } = window.navigator;
  return language;
};
