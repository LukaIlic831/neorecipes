import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import Loader from "../loader";
import { AppContext } from "../../App";

const cookies = new Cookies();

const CreateProfileBlock = () => {
  const { fetchUser } = useContext(AppContext);
  const [file, setFile] = useState();
  const [filePreview, setFilePreview] = useState();
  const [textareaLength, setTextareaLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [descError, setDescError] = useState(false);
  const textareaValue = useRef(null);
  const mainErrorBlock = useRef(null);
  const prepErrorBlock = useRef(null);
  const imageBorder = useRef(null);
  const navigate = useNavigate(null);

  const addImage = (e) => {
    imageBorder.current.style.border = "none";
    setFile(e.target.files[0]);
    setFilePreview(URL.createObjectURL(e.target.files[0]));
  };

  const addAll = async () => {
    if (!file) {
      setImageError(true);
      setTimeout(() => {
        mainErrorBlock.current.style.opacity = 0;
      }, 2000);

      setTimeout(() => {
        setImageError(false);
      }, 2200);

      return;
    }

    if (textareaValue.current.value.trim().length === 0) {
      setDescError(true);
      setTimeout(() => {
        prepErrorBlock.current.style.opacity = 0;
      }, 2000);

      setTimeout(() => {
        setDescError(false);
      }, 2200);
      return;
    }

    setLoading(true);
    let formData = new FormData();
    formData.append("image", file);
    formData.append("id", cookies.get("auth-token"));
    formData.append("description", textareaValue.current.value);
    await axios
      .post("https://neorecipes.onrender.com/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        fetchUser();
        setLoading(false);
        navigate("/");
      });
  };

  return (
    <>
      {loading && <Loader />}
      <div className="create-profile__wrapper row">
        <div className="add-recipe__wrapper row">
          <div className="error__message">
            {imageError && (
              <div
                className="error__message--block"
                ref={mainErrorBlock}
                style={{ marginTop: 0 }}
              >
                <p>Image upload required</p>
              </div>
            )}
            {descError && (
              <div
                className="error__message--block"
                ref={prepErrorBlock}
                style={{ marginTop: 0 }}
              >
                <p>description cannot be empty</p>
              </div>
            )}
          </div>
        </div>
        <div className="create-profile__image">
          <label htmlFor="file">
            <div className="create-profile__image--figure" ref={imageBorder}>
              {filePreview ? (
                <img alt="" src={filePreview}></img>
              ) : (
                <p>Upload Image</p>
              )}
            </div>
          </label>
          <input
            type="file"
            className="file"
            id="file"
            name="image"
            accept="image/png, image/gif, image/jpeg"
            onChange={(e) => addImage(e)}
          />
        </div>
        <div className="create-profile__desc">
          <div className="create-profile__desc--block">
            <div className="create-profile__desc--block-title">
              <h1>Add Description</h1>
            </div>
            <div className="create-profile__desc--block-para">
              <textarea
                maxLength="1550"
                ref={textareaValue}
                placeholder="Enter description"
                onChange={(e) => setTextareaLength(e.target.value.length)}
              />
              <span>{textareaLength}/1550</span>
            </div>
          </div>
          <div className="create-profile__desc--block">
            <div className="create-profile__desc--block-button">
              <span onClick={addAll}>Confirm</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateProfileBlock;
