import React from "react";

export default function UsersList({ users }) {
  return (
    <div>
      <h2>Active Users</h2>
      <ul>
        {users.map((user, index) => <li key={index}>{user}</li>)}
      </ul>
    </div>
  );
}