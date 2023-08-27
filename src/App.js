import { useContext, useEffect } from "react";
import axios from "axios";
import { productContext } from "./context/ProductContext";
import DynamicForm from "./components/productPage";

function App() {

  const productcontext = useContext(productContext);
  const { setFormData } = productcontext

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get("/demo.json");
        if (response.data) {
          setFormData(response.data[0].fielddetail)
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchProductData();
  }, []);
  return (
      <div className="centered-container">
        <DynamicForm/>
      </div>
  );
}

export default App;
