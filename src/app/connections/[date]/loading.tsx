import React from "react";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Loading = async () => {
  return (
    <div className=" h-56 w-full grid place-content-center">
      <FontAwesomeIcon
        icon={faSpinner}
        className="animate-spin"
        fontSize={36}
      />
    </div>
  );
};

export default Loading;
