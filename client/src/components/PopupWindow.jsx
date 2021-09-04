import React from 'react';

function PopUpWindow(props) {

  return (
    <div className="modal">
      <div className="modal_content">
        <span className="close" onClick={() => props.toggle(false)}>&times;</span>
        <p>{props.text}</p>
      </div>
    </div>
  );
}

export default PopUpWindow;
