import "../Error.css";
import { errorString } from "./game/Constants";

function Error() {
  return (
    <div className="error-container">
      <p> {errorString} </p>
      <button className="m-2 px-2 py-2 uppercase tracking-widest border-none flex items-center font-semibold text-sm rounded bg-custom-positive"
      onClick={()=>window.location.reload(true)}> RICARICAMI</button>
    </div>
  );
}

export default Error;