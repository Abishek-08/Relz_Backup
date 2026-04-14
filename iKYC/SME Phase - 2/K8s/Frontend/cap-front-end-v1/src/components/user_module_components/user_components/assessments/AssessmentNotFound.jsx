import React from "react";
import "../../../../styles/user_module_styles/user_dashboard_styles/AssessmentNotFoundStyle.css";

function AssessmentNotFound() {
  return (
    <div>
      <div id="main_wrapper">
        <div id="main">
          <div id="antenna">
            <div id="antenna_shadow"></div>
            <div id="a1"></div>
            <div id="a1d"></div>
            <div id="a2"></div>
            <div id="a2d"></div>
            <div id="a_base"></div>
          </div>
          <div id="tv">
            <div id="cruve">
              <svg
                xmlSpace="preserve"
                viewBox="0 0 189.929 189.929"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                id="curve_svg"
              >
                <path
                  d="M70.343,70.343c-30.554,30.553-44.806,72.7-39.102,115.635l-29.738,3.951C-5.442,137.659,11.917,86.34,49.129,49.13
                  C86.34,11.918,137.664-5.445,189.928,1.502l-3.95,29.738C143.041,25.54,100.895,39.789,70.343,70.343z"
                ></path>
              </svg>
            </div>
            <div id="display_div">
              <div id="screen_out">
                <div id="screen_out1">
                  <div id="screen">
                    <span id="notfound_text"> NO ASSESSMENT SCHEDULED</span>
                  </div>
                </div>
              </div>
            </div>
            <div id="lines">
              <div id="line1"></div>
              <div id="line2"></div>
              <div id="line3"></div>
            </div>
            <div id="buttons_div">
              <div id="b1">
                <div></div>
              </div>
              <div id="b2"></div>
              <div id="speakers">
                <div id="g1">
                  <div id="g11"></div>
                  <div id="g12"></div>
                  <div id="g13"></div>
                </div>
                <div id="g"></div>
                <div id="g"></div>
              </div>
            </div>
          </div>
          <div id="bottom">
            <div id="base1"></div>
            <div id="base2"></div>
            <div id="base3"></div>
          </div>
        </div>
        <div id="text_404">
          <div id="text_4041">4</div>
          <div id="text_4042">0</div>
          <div id="text_4043">4</div>
        </div>
      </div>
    </div>
  );
}

export default AssessmentNotFound;
