"use client";

import { signOut } from "next-auth/react";

const Dashboard = () => {
  return (
    <div>
      Dashboard
      <div>
        <button onClick={() => signOut()}>LogOut</button>
      </div>
    </div>
  );
};

export default Dashboard;
