import React, { createContext, useContext, ReactNode } from 'react';

type MapContextType = {
  isMapLibraryLoaded: boolean;
};

const MapContext = createContext<MapContextType | undefined>(undefined);

interface MapProviderProps {
  children: ReactNode;
}

export const MapProvider = ({ children }: MapProviderProps) => {
  // In a real implementation, you'd check if the map library is loaded
  // and potentially load it dynamically
  const isMapLibraryLoaded = true;

  return (
    <MapContext.Provider value={{ isMapLibraryLoaded }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = (): MapContextType => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
}; 