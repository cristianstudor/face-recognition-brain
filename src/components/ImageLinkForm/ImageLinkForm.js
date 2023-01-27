import React from "react";
import "./ImageLinkForm.css";

const ImageLinkForm = ({ onInputChange, onButtonSubmit, isLoading }) => {
  return (
    <div>
      <p className="f3">
        {"This Magic Brain will detect faces in your pictures."}
      </p>
      <p className="f3">
        {"Give it a try, paste an image link in the input form."}
      </p>
      <div className="center">
        <div className="center form pa4 br3 shadow-5">
          <input
            className="f4 pa2 w-70 center"
            type="text"
            onChange={onInputChange}
          />
          <button
            className="f4 w-30 grow link ph3 pv2 dib bg-light-purple"
            onClick={onButtonSubmit}
          >
            {!isLoading ? "Detect" : "Loading"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
