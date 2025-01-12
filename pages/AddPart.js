import React, { useState } from "react";
import { db } from "../src/utils/firebase";
import styles from "../public/assets/AddPart.module.css";
import { addDoc, collection, getFirestore } from "firebase/firestore";

const AddPart = () => {
  const [partType, setPartType] = useState("");
  const [formData, setFormData] = useState({});
  const [responseMessage, setResponseMessage] = useState("");

  const partFields = {
    CPU: ["name", "brand", "cores", "price"],
    Motherboard: ["name", "brand", "chipset", "price"],
    RAM: ["name", "brand", "capacity", "speed", "price"],
    GPU: ["name", "brand", "memory", "price"],
    Monitor: ["name", "brand", "resolution", "refresh_rate", "price"],
    SSD: ["name", "brand", "capacity", "type", "price"],
    Mouse: ["name", "brand", "dpi", "price"],
    Keyboard: ["name", "brand", "type", "price"],
    PSU: ["name", "brand", "wattage", "price"],
    Case: ["name", "brand", "form_factor", "price"],
    Headset: ["name", "brand", "type", "price"],
    Mousepad: ["name", "brand", "size", "price"],
    TowerCooler: ["name", "brand", "supported_sockets", "price"],
    LiquidCooler: ["name", "brand", "radiator_size", "price"],
  };

  const handleChange = (e) => {
    // Convert price to number if it's a number field
    const value = e.target.name === "price" ? parseFloat(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!partType) {
      setResponseMessage("Please select a part type!");
      return;
    }

    const formDataWithType = { ...formData, type: partType };

    try {
      const firestore = getFirestore();
      await addDoc(collection(firestore, "parts"), formDataWithType);

      setResponseMessage("Successfully added part: " + formDataWithType.name);
      setFormData({});
      setPartType("");
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("An error occurred while adding the part!");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Add New Part</h2>

      <label className={styles.label}>Part Type: </label>
      <select
        value={partType}
        onChange={(e) => {
          setPartType(e.target.value);
          setFormData({});
        }}
        className={styles.select}
      >
        <option value="">Select</option>
        {Object.keys(partFields).map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      {partType && (
        <form onSubmit={handleSubmit} className={styles.form}>
          {partFields[partType].map((field) => (
            <div key={field} className={styles["form-group"]}>
              <label className={styles.label}>{field}: </label>
              <input
                type={
                  field === "price" ||
                  field === "cores" ||
                  field === "refresh_rate" ||
                  field === "capacity" ||
                  field === "wattage"
                    ? "number"
                    : "text"
                }
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
          ))}
          <button type="submit" className={styles.button}>
            Add Part
          </button>
        </form>
      )}

      {responseMessage && <p className={styles["response-message"]}>{responseMessage}</p>}
    </div>
  );
};

export default AddPart;
