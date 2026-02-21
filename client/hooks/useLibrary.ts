"use client";

import { useLibrary as useLibraryContext } from "@/context/LibraryContext";

/**
 * useLibrary Hook — Re-exporting useLibrary from LibraryContext for backward compatibility
 * This ensures all components share the same media library state.
 */
export const useLibrary = () => {
  return useLibraryContext();
};

export type { MediaItem, Collection } from "@/context/LibraryContext";
