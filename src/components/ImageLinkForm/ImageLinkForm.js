import React from "react";
import "./ImageLinkForm.css";

const ImageLinkForm = ({
  onInputChange,
  onButtonSubmit,
  onButtonReset,
  isLoading
}) => {
  return (
    <div>
      <p className="f3">
        {"This Magic Brain will detect faces in your pictures."}
      </p>
      <p className="f3">
        {"Give it a try, paste an image link in the input form."}
      </p>
      <div className="center">
        <form className="form pa3 br3 shadow-5">
          <input
            className="f4 pa2 w-100 center"
            type="text"
            placeholder="Paste an image link here to detect faces..."
            onInput={onInputChange}
          />
          <button
            className="f4 mh3 mt3 w-30 grow link ph3 pv2 dib bg-light-grey"
            onClick={onButtonSubmit}
          >
            {!isLoading ? "Detect" : "Loading"}
          </button>
          <button
            className="f4 mh3 mt3 w-30 grow link ph3 pv2 dib bg-light-grey"
            onClick={onButtonReset}
            type="reset"
          >
            {"Reset Input"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ImageLinkForm;
