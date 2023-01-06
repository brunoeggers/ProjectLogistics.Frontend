import { useState } from "react";

const useModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  function toggle() {
    setIsVisible(!isVisible);
  }

  return {
    isVisible,
    toggle,
  };
};

export default useModal;
