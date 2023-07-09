import { XboxX } from "iconoir-react";
import React, { useContext } from "react";
import { AppContext } from "../../App";
import image from "../../assets/congratulations.svg";

const NextLevelInfo = () => {
  const { user, levelChanged, setLevelChanged } = useContext(AppContext);

  const close = () => {
    setLevelChanged(false);
  };

  return (
    <>
      {levelChanged && (
        <div className="next-level__wrapper">
          <div className="next-level__block">
            <div className="next-level__block--close">
              <XboxX
                width={36}
                height={36}
                color={"#222"}
                style={{ cursor: "pointer" }}
                onClick={close}
              />
            </div>
            <div className="next-level__block--para">
              <figure className="next-level__block--image">
                <img src={image} alt="" />
              </figure>
              <div className="next-level__block--title">
                <h2>Congratulations, you are now level {user?.level}</h2>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NextLevelInfo;
