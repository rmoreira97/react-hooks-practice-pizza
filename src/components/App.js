import React, { useState, useEffect } from "react";
import Header from "./Header";
import PizzaForm from "./PizzaForm";
import PizzaList from "./PizzaList";

function App() {
  // State to hold the list of pizzas
  const [pizzas, setPizzas] = useState([]);
  // State to hold the edited pizza data
  const [editedPizza, setEditedPizza] = useState(null);

  useEffect(() => {
    // Fetch data from the backend API when the component mounts
    fetch("http://localhost:3001/pizzas")
      .then((response) => response.json())
      .then((data) => setPizzas(data))
      .catch((error) => console.error("Error fetching pizzas:", error));
  }, []);

  // Function to set the edited pizza data
  function handleSavePizza(updatedPizza) {
    // Update the list of pizzas with the new pizza data
    setPizzas((prevPizzas) => [...prevPizzas, updatedPizza]);
    // Clear the editedPizza state
    setEditedPizza(null);
  }

  // Function to handle the edit click
  function handleEditClick(pizza) {
    setEditedPizza(pizza);
  }

  return (
    <>
      <Header />
      <PizzaForm selectedPizza={editedPizza} onSavePizza={handleSavePizza} />
      <PizzaList
        pizzas={pizzas}
        onEditClick={handleEditClick}
        setEditedPizza={setEditedPizza}
      />
    </>
  );
}

export default App;
