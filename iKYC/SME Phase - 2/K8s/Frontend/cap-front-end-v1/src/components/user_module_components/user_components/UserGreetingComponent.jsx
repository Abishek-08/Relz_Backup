import React from "react";

const UserGreetingComponent = ({ userName }) => {
  return (
    <div>
      <div>
        <h3 id="cap_text_user_dashboard">Welcome {userName}!</h3>
        
      </div>
    </div>
  );
};

export default UserGreetingComponent;
