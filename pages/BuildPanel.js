import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, getFirestore } from 'firebase/firestore';
import { auth } from "../src/utils/firebase";
import { onAuthStateChanged } from 'firebase/auth';
import styles from '../public/assets/user.module.css';
import { useUser } from '../src/utils/UserContext';
const BuildPanel = () => {
  const [parts, setParts] = useState([]); 
  const [selectedParts, setSelectedParts] = useState({}); 
  const [totalPrice, setTotalPrice] = useState(0); 
  const db = getFirestore();
const { email, logout } = useUser()
  useEffect(() => {
  
    fetchAllParts(); 
  }, []); // Fetch parts only once on component mount



  const fetchAllParts = async () => {
    try {
      const partsRef = collection(db, "parts");
      const querySnapshot = await getDocs(partsRef);
      
      const fetchedParts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setParts(fetchedParts);
    } catch (error) {
      console.error('Error fetching parts:', error);
    }
  };

  const handleSelectPart = (category, partId) => {
    if (!partId) { // Eğer partId boşsa, seçilen parçayı kaldır
      setTotalPrice(prevPrice => {
        // Seçilen parçanın eski fiyatını çıkar
        const oldPart = selectedParts[category];
        if (oldPart && !isNaN(oldPart.price)) {
          return prevPrice - oldPart.price;
        }
        return prevPrice; // Eğer eski parça yoksa, fiyatı değiştirme
      });
      setSelectedParts(prev => {
        const { [category]: removed, ...rest } = prev;
        return rest; // Seçilen parçayı kaldır
      });
      return;
    }
  
    const selectedPart = parts.find(part => part.id === partId);
  
    if (!selectedPart) {
      console.error(`Part with id ${partId} not found`);
      return;
    }
  
    let newPrice = totalPrice;
  
    // Eski parçanın fiyatını çıkar
    if (selectedParts[category]) {
      const oldPrice = selectedParts[category].price;
      if (!isNaN(oldPrice)) {
        newPrice -= oldPrice; // Eski parçanın fiyatını çıkar
      }
    }
  
    // Yeni parçanın fiyatını ekle
    if (selectedPart && !isNaN(selectedPart.price)) {
      newPrice += selectedPart.price;
    } else {
      console.error(`Invalid price for part: ${selectedPart?.name}`);
    }
  
    console.log('Updated Total Price:', newPrice); // Yeni toplam fiyatı kontrol et
    setTotalPrice(newPrice); // Yeni fiyatı güncelle
    setSelectedParts(prev => ({
      ...prev,
      [category]: selectedPart, // Yeni parçayı seçilenler listesine ekle
    }));
  };

  const handleBack = async () => {
    if (email === 'admin@gmail.com') {
      window.location.replace('/AdminPanel'); // Admin email ise Admin Panel'e yönlendir
    } else {
      window.location.replace('/UserPanel'); // Admin email değilse başka bir sayfaya yönlendir
    }
  };

  const handleBuildPC = async () => {
    try {
      const buildData = {
        parts: Object.keys(selectedParts).map(category => selectedParts[category].id),
        totalPrice: totalPrice, // Fiyatı number olarak gönderiyoruz
        createdAt: new Date(),
        email: email, // E-posta adresi burada ekleniyor
      };
  
      // Firestore: Add build data
      const buildRef = collection(db, "builds");
      const buildDoc = await addDoc(buildRef, buildData);
  
      // Add price history
      const priceHistoryData = {
        buildId: buildDoc.id, // Build ID'sini priceHistory'ye ekliyoruz
        parts: Object.keys(selectedParts).map(category => ({
          partdocid:selectedParts[category].id,
          name: selectedParts[category].name,
          price: selectedParts[category].price, // Fiyatı number olarak gönderiyoruz
        })),
        totalPrice: totalPrice, // Fiyatı number olarak gönderiyoruz
        Timestamp: new Date(),
        email: email, // E-posta adresi burada ekleniyor
      };
  
      const priceHistoryRef = collection(db, "price-histories");
      await addDoc(priceHistoryRef, priceHistoryData);
  
      alert('Build successfully saved and price history updated!');
    } catch (error) {
      console.error('Error occurred while saving build or price history', error);
      alert('An error occurred while saving the build or updating the price history');
    }
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      window.location.replace('/Login');
    }).catch((error) => {
      console.error('Error signing out: ', error);
    });
  };

  return (
    
    <div className={styles.container}>
      <h3>Select Your PC Parts</h3>
      <div className={styles.header}>
        <div className={styles.navbar}>
          <img src="/assets/logo.png" alt="Logo" />
          <h2>Build PC</h2>
          <div className={styles.userInfo}>
          <span>{email ? `Welcome, ${email}` : 'Guest'}</span> {/* Burada email'i göstereceğiz */}
            <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div className={styles.fieldsContainer}>
          <div className={styles.fieldsContainerRow}>
            {/* Left Dropdowns */}
            <div className={styles.fieldsContainerLeft}>
            {['RAM', 'GPU', 'CPU', 'Motherboard', 'Mouse', 'Keyboard', 'Monitor'].map((category, index) => (
                <div className={styles.categorySection} key={category + index}>
                  <label className={styles.categoryLabel}>{category}</label>
                  <select
                    className={styles.dropdown}
                    onChange={(e) => handleSelectPart(category, e.target.value)}
                  >
                    <option value="">Select {category}</option>
                    {parts.filter(part => part.type === category).map((part) => (
                      <option key={part.id} value={part.id}>
                        {part.name} - ${part.price}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Right Dropdowns */}
            <div className={styles.fieldsContainerRight}>
            {['SSD', 'PSU', 'Case', 'Headset', 'Mousepad', 'TowerCooler', 'LiquidCooler'].map((category, index) => (
                <div className={styles.categorySection} key={category + index}>
                  <label className={styles.categoryLabel}>{category}</label>
                  <select
                    className={styles.dropdown}
                    onChange={(e) => handleSelectPart(category, e.target.value)}
                  >
                    <option value="">Select {category}</option>
                    {parts.filter(part => part.type === category).map((part) => (
                      <option key={part.id} value={part.id}>
                        {part.name} - ${part.price}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Total Price */}
            <div className={styles.totalPriceContainer}>
              <h3>Total Price: ${totalPrice}</h3>
              <button onClick={handleBuildPC}>Build My PC</button>
              <h2></h2>
              <button onClick={handleBack}>Back</button>
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildPanel;