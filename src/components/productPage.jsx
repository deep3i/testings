import React, { useContext, useState } from "react";
import { productContext } from "../context/ProductContext";

const DynamicForm = () => {
  const productcontext = useContext(productContext);
  const { formData, setFormData } = productcontext;

  const [selectedValues, setSelectedValues] = useState({});

  // images show state
  const [selectedDropdownValue, setSelectedDropdownValue] = useState({});
  const [selectedCheckboxValue, setSelectedCheckboxValue] = useState({});
  const [selectedRadioButtonsValue, setSelectedRadioButtonsValue] = useState(
    {}
  );
  const [selectedInputValue, setSelectedInputValue] = useState("");

  const handleChange = (fieldIndex, value) => {
    setFormData((prevData) =>
      prevData.map((field, index) =>
        index === fieldIndex ? { ...field, selectedValue: value } : field
      )
    );

    setSelectedValues((prevValues) => {
      const field = formData[fieldIndex];
      const isFieldDisabled = getFieldMakeIt(field, fieldIndex) === "disable";

      // Reset the selected value of the field and its children if it is disabled
      if (isFieldDisabled) {
        // Find the nested fields and reset their selected values
        const nestedFields = formData.filter((nestedField) =>
          nestedField.condition.some(
            (condition) =>
              condition.nestedField_id === field.title &&
              condition.nestedValue_id === value
          )
        );

        const updatedValues = { ...prevValues };
        updatedValues[field.title] = value;

        nestedFields.forEach((nestedField) => {
          updatedValues[nestedField.title] = "";
        });

        return updatedValues;
      }

      return {
        ...prevValues,
        [field.title]: value,
      };
    });
  };

  // inside this visbility === hiddn then true other vise makeit === hidden dont call condition its reverse mistake
  const isValueHidden = (value, field, fieldIndex) => {
    const foConditions = field.condition.filter(
      (condition) => condition.order === "FO"
    );
    const soConditions = field.condition.filter(
      (condition) => condition.order === "SO"
    );

    for (const condition of foConditions) {
      if (
        condition.optvalue_id === value &&
        isConditionMatched(condition, fieldIndex)
      ) {
        return condition.makeIt === "hidden";
      }
    }

    for (const condition of soConditions) {
      if (
        condition.optvalue_id === value &&
        isConditionMatched(condition, fieldIndex)
      ) {
        return condition.makeIt === "hidden";
      }
    }

    return false;
  };

  const isConditionMatched = (condition, fieldIndex) => {
    const { nestedField_id, nestedValue_id } = condition;
    const nestedField = formData.find(
      (field) => field.title === nestedField_id
    );
    const nestedFieldValue = nestedField && nestedField.selectedValue;
    return (
      nestedFieldValue === nestedValue_id &&
      fieldIndex !== formData.indexOf(nestedField)
    );
  };

  const getFieldMakeIt = (field, fieldIndex) => {
    const foCondition = field.condition.find(
      (condition) => condition.order === "FO"
    );
    const soConditions = field.condition.filter(
      (condition) => condition.order === "SO"
    );

    if (foCondition && isConditionMatched(foCondition, fieldIndex)) {
      return foCondition.visibility;
    }

    for (const condition of soConditions) {
      if (isConditionMatched(condition, fieldIndex)) {
        return condition.visibility;
      }
    }
    return "visible";
  };

  const handleFileUpload = (fieldIndex, file) => {
    // You can handle the uploaded file here as needed
    // For example, you might want to store it in state or send it to a server
    console.log("Uploaded file:", file);
  };

  const handleImageClick = (dropdownValue, imageUrl) => {
    // console.log(`Clicked on image for option: ${dropdownValue}`);
    // console.log(`Image URL: ${imageUrl}`);
  };

  const handleDropdownChange = (field, fieldIndex, value) => {
    setSelectedDropdownValue((prevSelected) => ({
      ...prevSelected,
      [field.title]: value,
    }));
    handleChange(fieldIndex, value);
  };

  const handleCheckboxChange = (field, index, value) => {
    setSelectedCheckboxValue((prevSelected) => ({
      ...prevSelected,
      [field.title]: prevSelected[field.title]
        ? prevSelected[field.title].includes(value)
          ? prevSelected[field.title].filter((item) => item !== value)
          : [...prevSelected[field.title], value]
        : [value],
    }));
    handleChange(index, value);
  };

  const handleRadiobuttonsChange = (field, fieldIndex, value, image) => {
    console.log(image);
    // setSelectedRadioButtonsValue((prevSelected) => ({
    //   ...prevSelected, [field.title]: prevSelected[field.title] ? prevSelected[field.title].includes(value)
    //       ? prevSelected[field.title].filter((item) => item !== value)
    //       : [...prevSelected[field.title], value]
    //     : [value],
    // }));
    setSelectedRadioButtonsValue([value, image]);
    handleChange(fieldIndex, value);
  };

  const handleInputValueChange = (field, fieldIndex, value) => {
    setSelectedInputValue(value);
    handleChange(fieldIndex, value);
  };

  console.log(selectedRadioButtonsValue, "radio button");

  return (
    <div className="grid-container">
      {formData.map((field, index) => {
        return (
          <>
            <div
              key={field.id}
              className="form-element"
              style={{
                gridRow: `${field.position.split(":")[0]} / span 1`,
                gridColumn: `${field.position.split(":")[1]} / span 1`,
              }}
            >
              <label className="form-label">{field.title}</label>
              {field.field === "Dropdown" ? (
                <div>
                  <select
                    value={field.selectedValue}
                    onChange={(e) =>
                      handleDropdownChange(field, index, e.target.value)
                    }
                    className="form-select"
                    style={{
                      display:
                        getFieldMakeIt(field, index) === "hidden"
                          ? "none"
                          : "block",
                      pointerEvents:
                        getFieldMakeIt(field, index) === "disable"
                          ? "none"
                          : "auto",
                    }}
                    disabled={getFieldMakeIt(field, index) === "disable"}
                  >
                    <option value="">Select an option</option>
                    {field.values.map((option) => (
                      <option
                        className="option"
                        key={option.id}
                        value={option.value}
                        style={{
                          display: isValueHidden(option.value, field, index)
                            ? "none"
                            : "block",
                        }}
                      >
                        {option.value}
                      </option>
                    ))}
                  </select>

                  {selectedDropdownValue[field.title] && (
                    <div className="value-images">
                      {field.values
                        .find(
                          (option) =>
                            option.value === selectedDropdownValue[field.title]
                        )
                        ?.value_images.map((image, imageIndex) => (
                          <img
                            key={image.id}
                            src={image.extraimage}
                            alt={`Image ${imageIndex + 1}`}
                            className="value-image"
                            onClick={() =>
                              handleImageClick(
                                selectedDropdownValue[field.title],
                                image.extraimage
                              )
                            }
                          />
                        ))}
                    </div>
                  )}
                </div>
              ) : field.field === "Checkbox" ? (
                <div>
                  <div className="value-images">
                    {selectedCheckboxValue[field.title] &&
                      selectedCheckboxValue[field.title].map(
                        (selectedCheckbox) =>
                          field.values
                            .find((option) => option.value === selectedCheckbox)
                            ?.value_images.map((image, imageIndex) => (
                              <div
                              key={image.id}
                                style={{
                                  display:
                                    image.extraimage ===
                                    selectedRadioButtonsValue[1]
                                      ? "none"
                                      : "",
                                }}
                              >
                                <img
                                  src={image.extraimage}
                                  alt={`Image ${imageIndex + 1}`}
                                  className="value-image"
                                  onClick={() =>
                                    handleImageClick(
                                      selectedCheckbox,
                                      image.extraimage
                                    )
                                  }
                                />
                              </div>
                            ))
                      )}
                  </div>
                  <div
                    style={{
                      display:
                        getFieldMakeIt(field, index) === "hidden"
                          ? "none"
                          : "block",
                    }}
                    className="checkbox-container"
                  >
                    <div className="flex-label">
                      {field.values.map((checkbox) => {
                        const predefineColors = checkbox.predefined;
                        const colorsArray = predefineColors.split(", ");
                        const replaceUndefinedColors = (arr) => {
                          for (let i = 1; i < arr.length; i += 2) {
                            if (arr[i] === "undefined") {
                              arr[i] = arr[i - 1];
                            }
                          }
                          return arr;
                        };

                        const validateColor = (predefineColors) => {
                          const colorRegex = /^#[0-9a-fA-F]{6}$/;
                          return colorRegex.test(predefineColors);
                        };
                        const hasValidColor = colorsArray.some((value) =>
                          validateColor(value)
                        );

                        const validateImageLink = (predefineColors) => {
                          // You can define your own regex pattern to match base64 image links
                          const imageLinkRegex = /^data:image\/\w+;base64,/; // This is a simple example
                          return imageLinkRegex.test(predefineColors);
                        };

                        const processedColors =
                          replaceUndefinedColors(colorsArray);
                        const isSelected =
                          selectedCheckboxValue[field.title] &&
                          selectedCheckboxValue[field.title].includes(
                            checkbox.value
                          );
                        return (
                          <>
                            <div
                              key={checkbox.id}
                              id={checkbox.id}
                              className={`checkbox-label ${
                                isSelected ? "selected" : ""
                              }`}
                              onClick={() =>
                                handleCheckboxChange(
                                  field,
                                  index,
                                  checkbox.value
                                )
                              }
                              style={{
                                display: isValueHidden(
                                  checkbox.value,
                                  field,
                                  index
                                )
                                  ? isSelected
                                    ? document
                                        .getElementById(checkbox.id)
                                        .click()
                                    : "none"
                                  : "",
                              }}
                            >
                              <div className={`checkbox-box`}>
                                <input
                                  type="checkbox"
                                  style={{ display: "none" }}
                                  value={checkbox.value}
                                  checked={isSelected}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      field,
                                      index,
                                      e.target.value
                                    )
                                  }
                                  disabled={
                                    getFieldMakeIt(field, index) === "disable"
                                  }
                                />
                                {checkbox.predefined === "" ? (
                                  ""
                                ) : hasValidColor ? (
                                  <div className="color-swatch">
                                    <div className="row">
                                      <div
                                        className="color"
                                        style={{
                                          backgroundColor: processedColors[0],
                                          borderTopLeftRadius: "5px",
                                        }}
                                      ></div>
                                      <div
                                        className="color"
                                        style={{
                                          backgroundColor: processedColors[1],
                                          borderTopRightRadius: "5px",
                                        }}
                                      ></div>
                                    </div>
                                    <div className="row">
                                      <div
                                        className="color"
                                        style={{
                                          backgroundColor:
                                            processedColors[2] === "undefined"
                                              ? processedColors[0]
                                              : processedColors[2],
                                          borderBottomLeftRadius: "5px",
                                        }}
                                      ></div>
                                      <div
                                        className="color"
                                        style={{
                                          backgroundColor:
                                            processedColors[3] === "undefined"
                                              ? processedColors[1]
                                              : processedColors[3],
                                          borderBottomRightRadius: "5px",
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                ) : validateImageLink(predefineColors) ? (
                                  <div className="predefined-image">
                                    {" "}
                                    <img src={checkbox.predefined} />
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                              <span className="form-checkbox-label">
                                {checkbox.value}
                              </span>
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : field.field === "RadioButtons" ? (
                <div>
                  <div className="value-images">
                    {/* {selectedRadioButtonsValue[field.title] &&
                      selectedRadioButtonsValue[field.title].map(
                        (selectedCheckbox) =>
                          field.values
                            .find((option) => option.value === selectedCheckbox)
                            ?.value_images.map((image, imageIndex) => (
                              <img
                                key={image.id}
                                src={image.extraimage}
                                alt={`Image ${imageIndex + 1}`}
                                className="value-image"
                                onClick={() =>
                                  handleImageClick(
                                    selectedCheckbox,
                                    image.extraimage
                                  )
                                }
                              />
                            ))
                      )} */}
                    {selectedRadioButtonsValue[1] && (
                      <img
                        key={index}
                        src={selectedRadioButtonsValue[1]}
                        // alt={`Image ${imageIndex + 1}`}
                        className="value-image"
                        onClick={() =>
                          handleImageClick()
                          // selectedCheckbox,
                          // image.extraimage
                        }
                      />
                    )}
                  </div>
                  <div
                    style={{
                      display:
                        getFieldMakeIt(field, index) === "hidden"
                          ? "none"
                          : "block",
                    }}
                    className="checkbox-container"
                  >
                    <div className="flex-label">
                      {field.values.map((radio) => {
                        const predefineColors = radio.predefined;
                        const colorsArray = predefineColors.split(", ");

                        const validateColor = (predefineColors) => {
                          const colorRegex = /^#[0-9a-fA-F]{6}$/;
                          return colorRegex.test(predefineColors);
                        };
                        const hasValidColor = colorsArray.some((value) =>
                          validateColor(value)
                        );

                        const validateImageLink = (predefineColors) => {
                          // You can define your own regex pattern to match base64 image links
                          const imageLinkRegex = /^data:image\/\w+;base64,/; // This is a simple example
                          return imageLinkRegex.test(predefineColors);
                        };

                        const replaceUndefinedColors = (arr) => {
                          for (let i = 1; i < arr.length; i += 2) {
                            if (arr[i] === "undefined") {
                              arr[i] = arr[i - 1];
                            }
                          }
                          return arr;
                        };

                        const processedColors =
                          replaceUndefinedColors(colorsArray);
                        const isSelected =
                          selectedRadioButtonsValue[field.title] &&
                          selectedRadioButtonsValue[field.title].includes(
                            radio.value
                          );

                        return (
                          <>
                            <div
                              className={`checkbox-label ${
                                selectedValues[field.title] === radio.value
                                  ? "selected"
                                  : ""
                              }`}
                              key={radio.id}
                              id={radio.id}
                              style={{
                                display: isValueHidden(
                                  radio.value,
                                  field,
                                  index
                                )
                                  ? isSelected
                                    ? document.getElementById(radio.id).click()
                                    : "none"
                                  : "",
                              }}
                              onClick={(e) =>
                                handleRadiobuttonsChange(
                                  field,
                                  index,
                                  radio.value,
                                  radio.value_images[0]?.extraimage
                                )
                              }
                            >
                              <div className={`checkbox-box`}>
                                <input
                                  type="radio"
                                  value={radio.value}
                                  style={{ display: "none" }}
                                  checked={
                                    selectedValues[field.title] === radio.value
                                  }
                                  onChange={(e) =>
                                    handleRadiobuttonsChange(
                                      field,
                                      index,
                                      e.target.value
                                    )
                                  }
                                  disabled={
                                    getFieldMakeIt(field, index) === "disable"
                                  }
                                />
                                {radio.predefined === "" ? (
                                  ""
                                ) : hasValidColor ? (
                                  <div className="color-swatch">
                                    <div className="row">
                                      <div
                                        className="color"
                                        style={{
                                          backgroundColor: processedColors[0],
                                          borderTopLeftRadius: "5px",
                                        }}
                                      ></div>
                                      <div
                                        className="color"
                                        style={{
                                          backgroundColor: processedColors[1],
                                          borderTopRightRadius: "5px",
                                        }}
                                      ></div>
                                    </div>
                                    <div className="row">
                                      <div
                                        className="color"
                                        style={{
                                          backgroundColor:
                                            processedColors[2] === "undefined"
                                              ? processedColors[0]
                                              : processedColors[2],
                                          borderBottomLeftRadius: "5px",
                                        }}
                                      ></div>
                                      <div
                                        className="color"
                                        style={{
                                          backgroundColor:
                                            processedColors[3] === "undefined"
                                              ? processedColors[1]
                                              : processedColors[3],
                                          borderBottomRightRadius: "5px",
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                ) : validateImageLink(predefineColors) ? (
                                  <div className="predefined-image">
                                    {" "}
                                    <img src={radio.predefined} />
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                              <span className="form-checkbox-label">
                                {radio.value}
                              </span>
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : field.field === "Input" ? (
                <div>
                  <input
                    type={field.inputtype}
                    value={field.selectedValue}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const maxLength =
                        field.inputtype === "number"
                          ? field.charlimit
                          : field.charlimit;
                      const truncatedValue = inputValue.slice(0, maxLength);
                      handleInputValueChange(field, index, truncatedValue);
                    }}
                    className="form-input-text"
                    maxLength={field.charlimit} // Add the maxLength attribute for character limit
                    style={{
                      display:
                        getFieldMakeIt(field, index) === "hidden"
                          ? "none"
                          : "block",
                      pointerEvents:
                        getFieldMakeIt(field, index) === "disable"
                          ? "none"
                          : "auto",
                    }}
                    disabled={getFieldMakeIt(field, index) === "disable"}
                  />
                </div>
              ) : field.field === "FileUpload" ? (
                <div>
                  {selectedDropdownValue && (
                    <div className="value-images">
                      {field.values
                        .find(
                          (option) => option.value === selectedDropdownValue
                        )
                        ?.value_images.map((image, imageIndex) => (
                          <img
                            key={image.id}
                            src={image.extraimage}
                            alt={`Image ${imageIndex + 1}`}
                            className="value-image"
                            onClick={() =>
                              handleImageClick(
                                selectedDropdownValue,
                                image.extraimage
                              )
                            }
                          />
                        ))}
                    </div>
                  )}
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(index, e.target.files[0])}
                    className="form-file-input"
                    style={{
                      display:
                        getFieldMakeIt(field, index) === "hidden"
                          ? "none"
                          : "block",
                      pointerEvents:
                        getFieldMakeIt(field, index) === "disable"
                          ? "none"
                          : "auto",
                    }}
                    disabled={getFieldMakeIt(field, index) === "disable"}
                  />
                </div>
              ) : null}
            </div>
          </>
        );
      })}
    </div>
  );
};

export default DynamicForm;
