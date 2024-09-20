/** @format */

import React, { useEffect } from "react";

const useOnClickOutside = (
  ref: React.MutableRefObject<null | HTMLElement>,
  handler: (
    event: any,
    ref: React.MutableRefObject<null | HTMLElement>
  ) => void,
  extraRefs?: Array<React.MutableRefObject<null | HTMLElement> | undefined>
) => {
  useEffect(() => {
    const listener = (event: any) => {
      if (!ref.current || ref.current.contains(event.target)) return;

      if (extraRefs) {
        for (const element of extraRefs) {
          if (element && element?.current?.contains(event.target)) return;
        }
      }

      handler(event, ref);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, handler]);
};

export default useOnClickOutside;
