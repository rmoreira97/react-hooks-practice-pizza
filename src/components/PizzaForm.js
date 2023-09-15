import React, { useState, useEffect } from "react";

function PizzaForm({ selectedPizza, onSavePizza }) {
  // State to manage form input values
  const [formData, setFormData] = useState({
    topping: "",
    size: "Small",
    vegetarian: false,
  });

  // Update the form data when selectedPizza changes
  useEffect(() => {
    if (selectedPizza) {
      setFormData(selectedPizza);
    }
  }, [selectedPizza]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSaveClick = () => {
    if (selectedPizza) {
      // If there's a selectedPizza, it means we're editing an existing pizza
      // Create a new pizza object with the form data and the ID of the selected pizza
      const updatedPizza = {
        ...formData, // Include the updated data from the form
        id: selectedPizza.id, // Include the pizza's ID
      };

      // Log the updated pizza data and the PUT request before sending
      console.log("Updating Pizza:", updatedPizza);

      // Make a PUT request to update the pizza data on the server
      fetch(`http://localhost:3001/pizzas/${updatedPizza.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPizza),
      })
        .then((response) => response.json())
        .then((savedPizza) => {
          onSavePizza(savedPizza); // Update the table with the saved data
          setFormData({
            // Reset the form
            topping: "",
            size: "Small",
            vegetarian: false,
          });
          console.log("Pizza Updated:", savedPizza); // Log the updated pizza data
        })
        .catch((error) => {
          console.error("Error updating pizza:", error);
        });
    } else {
      // If there's no selectedPizza, it means we're creating a new pizza
      // Create a new pizza object with the form data
      const newPizza = {
        topping: formData.topping,
        size: formData.size,
        vegetarian: formData.vegetarian,
      };

      // Log the new pizza data and the POST request before sending
      console.log("Creating New Pizza:", newPizza);

      // Make a POST request to save the new pizza data to the server
      fetch("http://localhost:3001/pizzas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPizza),
      })
        .then((response) => response.json())
        .then((savedPizza) => {
          onSavePizza(savedPizza); // Update the table with the saved data
          setFormData({
            // Reset the form
            topping: "",
            size: "Small",
            vegetarian: false,
          });
          console.log("Pizza Created:", savedPizza); // Log the created pizza data
        })
        .catch((error) => {
          console.error("Error creating pizza:", error);
        });
    }
  };

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <div className="form-row">
        <div className="col-5">
          <input
            className="form-control"
            type="text"
            name="topping"
            placeholder="Pizza Topping"
            value={formData.topping}
            onChange={handleInputChange}
          />
        </div>
        <div className="col">
          <select
            className="form-control"
            name="size"
            value={formData.size}
            onChange={handleInputChange}
          >
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
        </div>
        <div className="col">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="vegetarian"
              checked={formData.vegetarian}
              onChange={handleInputChange}
            />
            <label className="form-check-label">Vegetarian</label>
          </div>
        </div>
        <div className="col">
          <button
            type="button" // Use type="button" to prevent form submission
            className="btn btn-success"
            onClick={handleSaveClick}
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

export default PizzaForm;
