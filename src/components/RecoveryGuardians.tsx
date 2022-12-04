import { useEffect } from "react";

function RecoveryGuardians() {
  return (
    <div className="w-full h-full flex flex-1 flex-col bg-background-secondary items-center justify-flex-start">
      <div className="flex bg-background p-4 m-2 rounded-lg">
        <div className="flex-col" style={{ marginRight: "20px" }}>
          Guardian 1
        </div>
        <div className="flex-col">himanshu@tor.us</div>
      </div>
      <div className="flex bg-background p-4 m-2 rounded-lg">
        <div className="flex-col" style={{ marginRight: "20px" }}>
          Guardian 2
        </div>
        <div className="flex-col">himanshu@tor.us</div>
      </div>

      <button
        className="mt-1 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
        style={{ backgroundColor: "#f6851b" }}
        onClick={() => {}}>
        Inform Guardians
      </button>
    </div>
  );
}

export default RecoveryGuardians;
