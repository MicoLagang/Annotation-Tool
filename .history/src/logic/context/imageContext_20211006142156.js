import React, { useContext, useState, useEffect } from "react";

const ImageContext = React.createContext();

export function useImage() {
  return useContext(ImageContext);
}

export function ImageProvider({ children }) {
  const [imagesData, setImagesData] = useState({
    url:
      "https://firebasestorage.googleapis.com/v0/b/ilabel-tool.appspot.com/o/RTX742OR-e1572454412638.jpg?alt=media&token=0dc64c89-82f0-47f4-9fb2-f2111018beb7",
  });

  const value = {
    imagesData,
    setImagesData,
  };

  return (
    <ImageContext.Provider value={value}>{children}</ImageContext.Provider>
  );
}
