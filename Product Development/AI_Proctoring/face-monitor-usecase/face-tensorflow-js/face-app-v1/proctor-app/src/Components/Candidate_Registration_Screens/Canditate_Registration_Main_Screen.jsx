import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Registration_Process_Screen from "./Registration_Process_Screen";
import { changeStepReducer } from "../../Redux/proctoringSlice";
import ID_Proof_Snap_Screen from "./ID_Proof_Snap_Screen";
import Person_Snap_Screen from "./Person_Snap_Screen";

const Canditate_Registration_Main_Screen = () => {
  const dispatch = useDispatch();
  const currentStep = useSelector((state) => state.proctoringSlice.currentStep);

  console.log(currentStep);
  return (
    <div>
      {" "}
      <div>
        <div className="bg-blue-600 mt-2 mb-6 text-white text-lg font-bold p-2">
          Just few more steps to began
        </div>
        <div>
          <div className="grid grid-cols-3 mb-8">
            <div
              onClick={() => {
                dispatch(changeStepReducer("step-1"));
              }}
              className={
                currentStep === "step-1"
                  ? "flex justify-center p-2 border  border-gray-700 cursor-pointer bg-gray-300"
                  : "flex justify-center p-2 border-r-2 border-gray-200 cursor-pointer bg-blue-400"
              }
            >
              <p className="antialiased">Step-1: Registration</p>
            </div>
            <div
              onClick={() => {
                dispatch(changeStepReducer("step-2"));
              }}
              className={
                currentStep === "step-2"
                  ? "flex justify-center p-2 border  border-gray-700 cursor-pointer bg-gray-300"
                  : "flex justify-center p-2 border-r-2 border-gray-200 cursor-pointer bg-blue-400"
              }
            >
              <p className="antialiased">Step-2: Take snap of your ID-Proof</p>
            </div>
            <div
              onClick={() => {
                dispatch(changeStepReducer("step-3"));
              }}
              className={
                currentStep === "step-3"
                  ? "flex justify-center p-2 border border-gray-700 cursor-pointer bg-gray-300"
                  : "flex justify-center p-2 border-r-2 border-gray-200 cursor-pointer bg-blue-400"
              }
            >
              <p className="antialiased">Step-3: Take your snapshot</p>
            </div>
          </div>
          <div>
            {currentStep === "step-1" && <Registration_Process_Screen />}
          </div>

          {currentStep === "step-2" && (
            <div>
              <ID_Proof_Snap_Screen />
            </div>
          )}

          {currentStep === "step-3" && (
            <div>
              <Person_Snap_Screen />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Canditate_Registration_Main_Screen;
