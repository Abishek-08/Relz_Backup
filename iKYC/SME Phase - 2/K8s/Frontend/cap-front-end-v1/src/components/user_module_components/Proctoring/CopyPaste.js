
 /**
 * @author Sb Abishek
 * @since 17-07-2024
 * @version 1.0
 */

import React, { useState } from 'react'
import { useEffect } from 'react'


/**
 * @author Sb Abishek
 * @since 17-07-2024
 * @version 1.0
 */

/**
 * @author Sundhar.soundhar
 * @since 30-07-2024
 * @version 5.0
 */
function CopyPaste() {
  const [copyPasteCount, setCopyPasteCount] = useState(0);

  useEffect(() => {
    const disableKeyCombinations = (e) => {
      if ((e.ctrlKey && e.key === "v") || (e.ctrlKey && e.key === "c")) {
        e.preventDefault();
        setCopyPasteCount(copyPasteCount + 1);
        window.alert("cannot copy and cannot paste");
      }
    };
    window.addEventListener("keydown", disableKeyCombinations);

    return () => {
      window.removeEventListener("keydown", disableKeyCombinations);
    };
  }, [copyPasteCount]);



  return (
    <div>
      
    </div>
  )

}

export default CopyPaste;
