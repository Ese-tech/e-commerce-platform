/**
 * Utility functions for handling user profile data
 */

/**
 * Extracts the profile picture URL from the user's profilePicture property
 * which can be either a string (direct URL) or an object with url property
 */
export const getProfilePictureUrl = (profilePicture?: string | { url: string; publicId: string }): string => {
  if (!profilePicture) return '';
  
  if (typeof profilePicture === 'string') {
    return profilePicture;
  }
  
  return profilePicture.url || '';
};

/**
 * Checks if a user has a profile picture
 */
export const hasProfilePicture = (profilePicture?: string | { url: string; publicId: string }): boolean => {
  return !!getProfilePictureUrl(profilePicture);
};

/**
 * Gets user initials for fallback avatar display
 */
export const getUserInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

/**
 * Formats user display name (first name only for compact display)
 */
export const getDisplayName = (fullName: string, compact: boolean = false): string => {
  if (compact) {
    return fullName.split(' ')[0];
  }
  return fullName;
};