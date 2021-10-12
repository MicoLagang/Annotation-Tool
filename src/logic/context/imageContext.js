import React, { useContext, useState, useEffect } from "react";

const ImageContext = React.createContext();

export function useImage() {
  return useContext(ImageContext);
}

export function ImageProvider({ children }) {
  const [imagesData, setImagesData] = useState();

  const value = {
    imagesData,
    setImagesData,
  };

  return (
    <ImageContext.Provider value={value}>{children}</ImageContext.Provider>
  );
}