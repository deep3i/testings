import { useState } from "react";
import { productContext } from "./ProductContext";

export const ProductState = (props) => {

    // product data
    const [formData, setFormData] = useState([]);

    return (
        <productContext.Provider value={{ formData, setFormData }}>
            {props.children}
        </productContext.Provider>
    )
}