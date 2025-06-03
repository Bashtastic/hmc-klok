// Sea creatures utility for managing random sea emoji rotation
export interface SeaCreature {
  name: string;
  path: string;
}

// All available sea creatures from the public/flags/sea directory
export const seaCreatures: SeaCreature[] = [
  { name: 'Crab 1', path: '/flags/sea/crab_1.png' },
  { name: 'Crab 2', path: '/flags/sea/crab_2.gif' },
  { name: 'Crab 3', path: '/flags/sea/crab_3.png' },
  { name: 'Dolphin', path: '/flags/sea/dolphin.png' },
  { name: 'Fish 1', path: '/flags/sea/fish_1.webp' },
  { name: 'Fish 2', path: '/flags/sea/fish_2.gif' },
  { name: 'Fish 3', path: '/flags/sea/fish_3.png' },
  { name: 'Fish 4', path: '/flags/sea/fish_4.png' },
  { name: 'Fish 5', path: '/flags/sea/fish_5.png' },
  { name: 'Fish 6', path: '/flags/sea/fish_6.png' },
  { name: 'Fish 7', path: '/flags/sea/fish_7.png' },
  { name: 'Fish 8', path: '/flags/sea/fish_8.png' },
  { name: 'Fish 9', path: '/flags/sea/fish_9.png' },
  { name: 'Fish 10', path: '/flags/sea/fish_10.webp' },
  { name: 'Fish 11', path: '/flags/sea/fish_11.png' },
  { name: 'Jellyfish 1', path: '/flags/sea/jellyfish_1.png' },
  { name: 'Jellyfish 2', path: '/flags/sea/jellyfish_2.png' },
  { name: 'Jellyfish 3', path: '/flags/sea/jellyfish_3.png' },
  { name: 'Jellyfish 4', path: '/flags/sea/jellyfish_4.png' },
  { name: 'Lobster 1', path: '/flags/sea/lobster_1f99e.png' },
  { name: 'Lobster 2', path: '/flags/sea/lobster_2.png' },
  { name: 'Lobster 3', path: '/flags/sea/lobster_3.png' },
  { name: 'Octopus 1', path: '/flags/sea/octopus_1.png' },
  { name: 'Octopus 2', path: '/flags/sea/octopus_2.gif' },
  { name: 'Octopus 3', path: '/flags/sea/octopus_3.png' },
  { name: 'Octopus 4', path: '/flags/sea/octopus_4.png' },
  { name: 'Oyster', path: '/flags/sea/oyster_1f9aa.png' },
  { name: 'Seal', path: '/flags/sea/seal.png' },
  { name: 'Shark 1', path: '/flags/sea/shark_1.png' },
  { name: 'Shark 2', path: '/flags/sea/shark_2.png' },
  { name: 'Shark 3', path: '/flags/sea/shark_3.png' },
  { name: 'Shell', path: '/flags/sea/shell_1.png' },
  { name: 'Shrimp 1', path: '/flags/sea/shrimp_1.png' },
  { name: 'Shrimp 2', path: '/flags/sea/shrimp_2.png' },
  { name: 'Shrimp 3', path: '/flags/sea/shrimp_3.webp' },
  { name: 'Shrimp 4', path: '/flags/sea/shrimp_4.png' },
  { name: 'Squid 1', path: '/flags/sea/squid_1.png' },
  { name: 'Squid 2', path: '/flags/sea/squid_2.png' },
  { name: 'Squid 3', path: '/flags/sea/squid_3.webp' },
  { name: 'Squid 4', path: '/flags/sea/squid_4.png' },
  { name: 'Water Wave 1', path: '/flags/sea/water-wave_1.png' },
  { name: 'Water Wave 2', path: '/flags/sea/water-wave_2.png' },
  { name: 'Water Wave 3', path: '/flags/sea/water-wave_3.png' },
  { name: 'Whale', path: '/flags/sea/whale.png' }
];

/**
 * Get a truly random sea creature for initial page load
 */
export const getTrulyRandomSeaCreature = (): SeaCreature => {
  const randomIndex = Math.floor(Math.random() * seaCreatures.length);
  return seaCreatures[randomIndex];
};

/**
 * Get a random sea creature based on the current hour
 * This ensures the same creature appears for the entire hour
 */
export const getRandomSeaCreatureForHour = (date: Date): SeaCreature => {
  const hour = date.getHours();
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  
  // Use both hour and day to create a seed for more variation
  const seed = (hour + dayOfYear) % seaCreatures.length;
  return seaCreatures[seed];
};

/**
 * Get the next sea creature in the list (for clicking functionality)
 */
export const getNextSeaCreature = (currentPath: string): SeaCreature => {
  const currentIndex = seaCreatures.findIndex(creature => creature.path === currentPath);
  const nextIndex = (currentIndex + 1) % seaCreatures.length;
  return seaCreatures[nextIndex];
};
