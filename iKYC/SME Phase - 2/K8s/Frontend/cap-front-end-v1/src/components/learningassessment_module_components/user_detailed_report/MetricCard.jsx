import React from "react";

/**
 * @author karpagam.boothanathan
 * @since 27-07-2024
 * @version 5.0
 */

/**
 * @author karpagam.boothanathan
 * @since 05-08-2024
 * @version 6.0
 */


const MetricCard = ({ icon: Icon, label, value, color, secondaryValue }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      padding: "12px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    }}
  >
    <Icon style={{ fontSize: "24px", color: color, marginRight: "12px" }} />
    <div>
      <p style={{ margin: 0, fontSize: "15px", color: "#666" }}>{label}</p>
      <p
        style={{
          margin: 0,
          fontSize: "15px",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        {value}
      </p>
      {secondaryValue && (
        <p
          style={{
            margin: "4px 0 0 0",
            fontSize: "14px",
            color: "#666",
            fontWeight: "bold",
          }}
        >
          {secondaryValue}
        </p>
      )}
    </div>
  </div>
);

export default MetricCard;
