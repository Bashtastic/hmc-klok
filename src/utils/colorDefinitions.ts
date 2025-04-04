
/**
 * Color Definitions
 * 
 * This file centralizes all color definitions used throughout the application.
 * Colors are organized by mode (light/dark) and by component/element.
 * 
 * The structure allows for easy theme changes and maintenance.
 */

// Common color definitions
export const commonColors = {
  // Red color used for the second hand in both light and dark mode
  secondHand: "hsl(0, 150%, 50%)",
  
  // Light gray used for the center dot in both modes
  centerDot: "hsl(0, 0%, 89%)",
};

// Light mode color definitions
export const lightModeColors = {
  // Clock Face
  clockFace: {
    background: "#F1F1F1", // Light gray background for clock face
    border: "#999999",     // Medium gray border for clock face
  },
  
  // Clock Elements
  hourMarkers: "hsl(220, 13%, 40%)", // Dark blue-gray for hour markers and numbers
  
  // Clock Hands
  hourHand: "hsl(217, 91%, 60%)",    // Blue color for hour hand
  minuteHand: "hsl(0, 0.00%, 22.00%)", // Dark gray, almost black for minute hand
};

// Dark mode color definitions
export const darkModeColors = {
  // Clock Face
  clockFace: {
    background: "hsl(222, 47%, 11%)", // Dark blue-gray background for clock face
    border: "hsl(217, 49.10%, 41.60%)", // Medium blue border for clock face
  },
  
  // Clock Elements
  hourMarkers: "hsl(220, 13%, 40%)", // Same as light mode for consistency
  
  // Clock Hands
  hourHand: "hsl(204, 61.50%, 53.10%)", // Bright blue for hour hand
  minuteHand: "hsl(142, 76%, 36%)",     // Green color for minute hand
};

/**
 * Returns the appropriate color set based on dark mode preference
 */
export const getThemeColors = (isDarkMode: boolean) => {
  return {
    ...commonColors,
    ...(isDarkMode ? darkModeColors : lightModeColors),
  };
};
