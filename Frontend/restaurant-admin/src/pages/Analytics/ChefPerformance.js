import React, { useState, useRef } from "react";
import "./ChefPerformance.css";

const ChefPerformance = React.forwardRef((props, ref) => {
  const [chefs, setChefs] = useState([
    { name: "Mohan", orders: 0 },
    { name: "Pritam", orders: 0 },
    { name: "Yash", orders: 0 },
    { name: "Rahul", orders: 0 },
  ]);

  const chefIndex = useRef(0); // tracks next chef for assignment

  // ---- public method to assign order ----
  const assignOrder = () => {
    setChefs((prev) => {
      const updated = [...prev];
      const current = chefIndex.current % updated.length;
      updated[current].orders += 1;
      chefIndex.current += 1;

      // simulate order completion after 5s
      setTimeout(() => {
        setChefs((prevState) => {
          const dec = [...prevState];
          if (dec[current].orders > 0) dec[current].orders -= 1;
          return dec;
        });
      }, 5000);

      return updated;
    });
  };

  // expose assignOrder to parent via ref
  React.useImperativeHandle(ref, () => ({
    assignOrder,
  }));

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
          {chefs.map((chef) => (
            <tr key={chef.name}>
              <td>{chef.name}</td>
              <td>{chef.orders}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default ChefPerformance;
