import React from "react";

function Pizza({ topping, size, vegetarian, onEditClick }) {
  return (
    <tr>
      <td>{topping}</td>
      <td>{size}</td>
      <td>{vegetarian ? "Vegetarian" : "Not Vegetarian"}</td>
      <td>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onEditClick} // Pass the edit handler from PizzaList
        >
          Edit Pizza
        </button>
      </td>
    </tr>
  );
}

export default Pizza;
