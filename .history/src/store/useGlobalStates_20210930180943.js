import { useState } from "react";

const useGlobalState = () => {
  const [state, setState] = useState({ value: "", list: [] });

  const actins = (action) => {
    const { type, payload } = action;
    switch (type) {
      case "setState":
        return setState(payload);
      default:
        return state;
    }
  };
  return { state, actions };
};

export default useGlobalState;
