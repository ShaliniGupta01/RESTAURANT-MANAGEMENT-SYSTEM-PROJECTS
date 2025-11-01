
import React from "react";
import "./ChefPerformance.css";

const ChefPerformance = ({ chefPerformance }) => {
  // Fixed list of chef names (as in your original code)
  const fixedChefs = ["Harpal", "Kabir ", "Yogesh", "Satyaram"];

  return (
    <div className="chef-performance-card">
      <table className="chef-table">
        <thead>
          <tr>
            <th>Chef Name</th>
            <th>Orders Taken</th>
          </tr>
        </thead>
        <tbody>
          {fixedChefs.map((chefName) => {
            // Find the ordersHandled from backend data (match by name)
            const chefData = chefPerformance.find((c) => c.name === chefName);
            const ordersTaken = chefData ? chefData.ordersHandled : 0;

            return (
              <tr key={chefName}>
                <td>{chefName}</td>
                <td>{ordersTaken}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ChefPerformance;