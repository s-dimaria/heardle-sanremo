import "../Error.css";
import { errorString } from "./game/Constants";

function Error() {
  return (
    <div className="error-container">
      <p> {errorString} </p>
    </div>
  );
}

export default Error;