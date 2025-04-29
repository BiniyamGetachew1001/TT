/**
 * Utility functions for handling offline mode and caching
 */

/**
 * Check if the browser is currently offline
 */
export const isOffline = (): boolean => {
  return !navigator.onLine;
};

/**
 * Save data to localStorage cache
 * @param key The cache key
 * @param data The data to cache
 */
export const saveToCache = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to cache (${key}):`, error);
  }
};

/**
 * Get data from localStorage cache
 * @param key The cache key
 * @returns The cached data or null if not found
 */
export const getFromCache = <T>(key: string): T | null => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error reading from cache (${key}):`, error);
    return null;
  }
};

/**
 * Update a specific item in a cached array
 * @param cacheKey The cache key
 * @param itemId The ID field of the item
 * @param idField The name of the ID field (default: 'id')
 * @param newData The new data for the item
 * @returns true if the item was updated, false otherwise
 */
export const updateCachedItem = <T extends Record<string, any>>(
  cacheKey: string,
  itemId: string,
  newData: T,
  idField: string = 'id'
): boolean => {
  try {
    const cachedData = getFromCache<T[]>(cacheKey);
    if (!cachedData) return false;

    const index = cachedData.findIndex(item => item[idField] === itemId);
    if (index >= 0) {
      cachedData[index] = { ...cachedData[index], ...newData };
      saveToCache(cacheKey, cachedData);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error updating cached item (${cacheKey}):`, error);
    return false;
  }
};

/**
 * Add a new item to a cached array
 * @param cacheKey The cache key
 * @param item The item to add
 * @returns true if the item was added, false otherwise
 */
export const addToCachedArray = <T>(cacheKey: string, item: T): boolean => {
  try {
    const cachedData = getFromCache<T[]>(cacheKey) || [];
    cachedData.push(item);
    saveToCache(cacheKey, cachedData);
    return true;
  } catch (error) {
    console.error(`Error adding to cached array (${cacheKey}):`, error);
    return false;
  }
};

/**
 * Remove an item from a cached array
 * @param cacheKey The cache key
 * @param itemId The ID of the item to remove
 * @param idField The name of the ID field (default: 'id')
 * @returns true if the item was removed, false otherwise
 */
export const removeFromCachedArray = <T extends Record<string, any>>(
  cacheKey: string,
  itemId: string,
  idField: string = 'id'
): boolean => {
  try {
    const cachedData = getFromCache<T[]>(cacheKey);
    if (!cachedData) return false;

    const newData = cachedData.filter(item => item[idField] !== itemId);
    if (newData.length !== cachedData.length) {
      saveToCache(cacheKey, newData);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error removing from cached array (${cacheKey}):`, error);
    return false;
  }
};

/**
 * Clear all cached data
 */
export const clearAllCaches = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing caches:', error);
  }
};

/**
 * Clear a specific cache
 * @param key The cache key to clear
 */
export const clearCache = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing cache (${key}):`, error);
  }
};
