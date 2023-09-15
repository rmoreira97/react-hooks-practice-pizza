import React, { useState, useEffect } from "react";

function PizzaList({ pizzas }) {
  console.log("Received pizzas:", pizzas);

  // Load the editing state of pizzas from local storage on initial mount
  const [pizzasList, setPizzas] = useState([]);

  useEffect(() => {
    const storedPizzas = JSON.parse(localStorage.getItem("pizzas")) || [];
    setPizzas(storedPizzas);

    // Check for the edited pizza ID in local storage
    const editedPizzaId = localStorage.getItem("editedPizzaId");

    if (editedPizzaId) {
      // Set the isEditing property for the pizza with the matching ID to true
      setPizzas((prevPizzas) =>
        prevPizzas.map((pizza) =>
          pizza.id === parseInt(editedPizzaId)
            ? { ...pizza, isEditing: true }
            : pizza
        )
      );
    }
  }, []);

  const handleInputChange = (event, pizza, fieldName) => {
    const { value, checked } = event.target;
    const updatedPizza = {
      ...pizza,
      [fieldName]: fieldName === "vegetarian" ? checked : value,
    };
    setPizzas((prevPizzas) =>
      prevPizzas.map((p) => (p.id === updatedPizza.id ? updatedPizza : p))
    );
  };

  const handleEditClick = (pizzaToEdit) => {
    // Store the ID of the pizza being edited in local storage
    localStorage.setItem("editedPizzaId", pizzaToEdit.id);

    setPizzas((prevPizzas) =>
      prevPizzas.map((pizza) =>
        pizza.id === pizzaToEdit.id ? { ...pizza, isEditing: true } : pizza
      )
    );
  };

  const handleSaveClick = (editedPizza) => {
    fetch(`http://localhost:3001/pizzas/${editedPizza.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedPizza),
    })
      .then((response) => response.json())
      .then((updatedPizza) => {
        // Create a variable to hold the updated state
        const updatedPizzasList = pizzasList.map((p) =>
          p.id === updatedPizza.id ? { ...updatedPizza, isEditing: false } : p
        );

        // Update the state with the updated pizza data
        setPizzas(updatedPizzasList);

        // Remove the edited pizza ID from local storage
        localStorage.removeItem("editedPizzaId");

        // Update the editing state in local storage
        localStorage.setItem("pizzas", JSON.stringify(updatedPizzasList));

        console.log("Pizza Updated:", updatedPizza);
      })
      .catch((error) => {
        console.error("Error updating pizza:", error);
      });
  };

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col">Topping</th>
          <th scope="col">Size</th>
          <th scope="col">Vegetarian?</th>
          <th scope="col">Edit/Save</th>
        </tr>
      </thead>
      <tbody>
        {pizzasList.map((pizza) => (
          <tr key={pizza.id}>
            <td>
              {pizza.isEditing ? (
                <input
                  type="text"
                  name="topping"
                  value={pizza.topping}
                  onChange={(e) => handleInputChange(e, pizza, "topping")}
                />
              ) : (
                pizza.topping
              )}
            </td>
            <td>
              {pizza.isEditing ? (
                <select
                  name="size"
                  value={pizza.size}
                  onChange={(e) => handleInputChange(e, pizza, "size")}
                >
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </select>
              ) : (
                pizza.size
              )}
            </td>
            <td>
              {pizza.isEditing ? (
                <input
                  type="checkbox"
                  name="vegetarian"
                  checked={pizza.vegetarian}
                  onChange={(e) => handleInputChange(e, pizza, "vegetarian")}
                />
              ) : pizza.vegetarian ? (
                "Vegetarian"
              ) : (
                "Not Vegetarian"
              )}
            </td>
            <td>
              {pizza.isEditing ? (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => handleSaveClick(pizza)}
                >
                  Save
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleEditClick(pizza)}
                >
                  Edit
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PizzaList;
