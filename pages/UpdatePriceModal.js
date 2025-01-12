import { getFirestore, getDocs,getDoc, doc, query, updateDoc, collection, deleteDoc } from "firebase/firestore";
import { db } from "../src/utils/firebase";
import React, { useState, useEffect } from 'react';
import styles from '../public/assets/update.module.css';

const UpdatePriceModal = () => {
  const [parts, setParts] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [partType, setPartType] = useState(""); // Part type state
  const [newPrice, setNewPrice] = useState(""); // Yeni fiyat state

  useEffect(() => {
    const fetchParts = async () => {
      if (!partType) {
        return;
      }

      try {
        const firestore = getFirestore();
        const q = query(collection(firestore, "parts"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setResponseMessage("No parts found in the database.");
          return;
        }

        const fetchedParts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched Parts: ", fetchedParts);

        // Verilerin tipiyle ilişkili parçaları filtrele
        const filteredParts = fetchedParts.filter(part => part.type === partType);
        console.log("Filtered Parts by Type: ", filteredParts);

        setParts(filteredParts);
      } catch (error) {
        console.error("Error fetching parts:", error);
        setResponseMessage("Error fetching parts!");
      }
    };

    fetchParts();
  }, [partType]);

  const updateBuildPrices = async () => {
    try {
      const firestore = getFirestore();
  
      // Buildlerin tümünü alalım
      const buildsQuery = query(collection(firestore, "builds"));
      const buildsSnapshot = await getDocs(buildsQuery);
  
      // Buildlere ait toplam fiyatları güncelleme
      for (const buildDoc of buildsSnapshot.docs) {
        const buildData = buildDoc.data();
  
        // Total price'ı başta sıfırlıyoruz
        let totalPrice = 0;
  
        // Buildin içindeki tüm parçaların fiyatlarını topluyoruz
        for (const partId of buildData.parts) {
          const partRef = doc(firestore, "parts", partId);
          const partSnapshot = await getDoc(partRef);
          const partData = partSnapshot.data();
  
          if (partData) {
            totalPrice += partData.price;  // Parçanın fiyatını topluyoruz
          }
        }
  
        // Buildin eski totalPrice'ı sıfırlanıyor ve yeni totalPrice değeri güncelleniyor
        const buildRef = doc(firestore, "builds", buildDoc.id);
        await updateDoc(buildRef, { totalPrice: totalPrice });
  
        console.log(`Build ${buildDoc.id} price updated to ${totalPrice}`);
      }
  
      console.log("Build prices updated successfully.");
    } catch (error) {
      console.error("Error updating build prices:", error);
    }
  };
  const updatePrice = () => {
    if (selectedPart && newPrice) {
      const price = parseFloat(newPrice);
      
      // Fiyatın geçerli bir sayısal değer olup olmadığını kontrol ediyoruz
      if (isNaN(price) || price <= 0) {
        setResponseMessage("Please enter a valid price.");
        return;
      }

      // Firestore'da fiyatı güncelleme işlemi
      const firestore = getFirestore();
      const partRef = doc(firestore, "parts", selectedPart.id);

      updateDoc(partRef, { price: price })
        .then(() => {
          setResponseMessage(`Price for ${selectedPart.name} updated to ${price}`);
          setNewPrice(""); // Fiyat güncellendikten sonra input'u temizle
          updateBuildPrices(); // Build fiyatlarını güncelle
        })
        .catch((error) => {
          console.error("Error updating price:", error);
          setResponseMessage("Error updating price!");
        });
    } else {
      setResponseMessage("Please select a part and enter a new price.");
    }
  };

  const deletePart = () => {
    if (selectedPart && selectedPart.id) {
      // Burada Firestore'dan parçayı silme işlemi yapılır
      const firestore = getFirestore();
      const partRef = doc(firestore, "parts", selectedPart.id);
      
      deleteDoc(partRef)
        .then(() => {
          setResponseMessage(`${selectedPart.name} has been deleted successfully.`);
          // Optionally clear selected part and other states
          setSelectedPart(null);
        })
        .catch((error) => {
          console.error("Error deleting part:", error);
          setResponseMessage("Error deleting part.");
        });
    } else {
      setResponseMessage("Please select a part to delete.");
    }
  };

  const renderTable = (type, parts) => {
    if (!parts || parts.length === 0) return null;

    const tableHeaders = ['Select', 'Name', 'Brand', 'Price'];
    const additionalColumns = [];

    if (['CPU', 'GPU'].includes(type)) {
      tableHeaders.push('Speed');
      additionalColumns.push('speed');
    }

    return (
      <div className={styles.tableContainer}>
        <h3 className={styles.title}>{type}</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              {tableHeaders.map((header, index) => (
                <th key={index} className={styles.tableHeader}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parts.map((part) => {
              const { name = 'No Name', brand = 'No Brand', price = 'No Price', speed = 'No Speed', id } = part;

              return (
                <tr
                  key={id}
                  onClick={() => {
                    setSelectedPart(part);
                    // Seçilen parça türüne göre seçim işlemi yapılır
                  }}
                  className={`${styles.tableRow} ${selectedPart?.id === id ? styles.selectedRow : ''}`}
                >
                  <td className={styles.tableCell}>
                    <input
                      type="radio"
                      checked={selectedPart?.id === id}
                      readOnly
                    />
                  </td>
                  <td className={styles.tableCell}>{name}</td>
                  <td className={styles.tableCell}>{brand}</td>
                  {additionalColumns.includes('speed') && (
                    <td className={styles.tableCell}>{speed}</td>
                  )}
                  <td className={styles.tableCell}>{price}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className={styles.buttonsContainer}>
          <button
            className={styles.deletePartButton}
            onClick={() => deletePart(selectedPart)}
          >
            Delete Part
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Dropdown menüsü eklendi */}
      <div className={styles.partTypeSelector}>
        <h3>Select Part Type</h3>
        <select
          value={partType}
          onChange={(e) => setPartType(e.target.value)}
        >
          <option value="">Select a part type</option>
          <option value="Motherboard">Motherboard</option>
          <option value="RAM">RAM</option>
          <option value="CPU">CPU</option>
          <option value="GPU">GPU</option>
          <option value="SSD">SSD</option>
          <option value="Mouse">Mouse</option>
          <option value="Keyboard">Keyboard</option>
          <option value="PSU">PSU</option>
          <option value="Case">Case</option>
          <option value="Headset">Headset</option>
          <option value="Mousepad">Mousepad</option>
          <option value="TowerCooler">TowerCooler</option>
          <option value="LiquidCooler">LiquidCooler</option>
        </select>
      </div>

      {/* Tabloları render et */}
      {partType && renderTable(partType, parts)}

      {/* Seçilen parçaya yönelik işlemler */}
      {selectedPart && (
        <div className={styles.actions}>
          <div className={styles.priceInput}>
            <label htmlFor="newPrice">New Price:</label>
            <input
              type="number"
              id="newPrice"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="Enter new price"
            />
          </div>
          <div className={styles.modalButtons}>
            <button
              className={styles.updatePriceButton}
              onClick={() => updatePrice()}
            >
              Update Price
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => setIsPriceModalVisible(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {responseMessage && <p className={styles["response-message"]}>{responseMessage}</p>}
    </div>
  );
};

export default UpdatePriceModal;