import config from "../config";

/**
 * Post user preferences to the backend.
 *
 * @param {Object} preferences - Preferences to be posted.
 * @param {Object} user - Authenticated user object.
 * @returns {Promise<void>} - A promise that resolves when the preferences have been posted.
 */
async function postPreferences(preferences, user) {
  try {
    if (preferences && user && user.email) {
      const updatedPreferences = {
        ...preferences,
        updated_at: new Date().toISOString(),
      };

      await fetch(`${config.base_render_api}/preferences/${user.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPreferences),
      });
    }
  } catch (error) {
    console.error("Error posting preferences:", error);
  }
}

export default postPreferences;
