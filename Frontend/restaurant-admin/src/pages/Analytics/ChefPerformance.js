
import React from "react";
import "./ChefPerformance.css";

const ChefPerformance = ({ chefPerformance }) => {
  // Fixed list of chef names (expanded to include assigned chefs from orders)
  const fixedChefs = ["Harpal", "Kabir ", "Yogesh", "Mohan"];

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
            // Find the ordersHandled from backend data (flexible match)
            const chefData = chefPerformance.find((c) =>
              c.name.toLowerCase().includes(chefName.toLowerCase().trim()) ||
              chefName.toLowerCase().includes(c.name.toLowerCase().trim())
            );
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
