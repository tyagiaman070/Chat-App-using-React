import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./Join.css";

const Join = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h5 className="heading">
          Welcome Just Chat by Joining Some one's Room or Create One :)
        </h5>
        <div className="bothInput">
          <input
            placeholder="Name"
            className="joinInput"
            type="text"
            onChange={event => setName(event.target.value)}
          ></input>
          <input
            placeholder="Room"
            className="joinInput mt-20"
            type="text"
            onChange={event => setRoom(event.target.value)}
          ></input>

          <Link
            onClick={event =>
              !name || !room
                ? event.preventDefault(alert("please enter some"))
                : null
            }
            to={`/chat?name=${name}&room=${room}`}
          >
            {" "}
            <button className="button mt-20" type="submit">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Join;
