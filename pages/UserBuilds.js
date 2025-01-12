import React, { useState, useEffect } from 'react';
import { getFirestore, collection, doc, getDoc ,docs, getDocs } from 'firebase/firestore';
import { useUser } from '../src/utils/UserContext';
import styles from '../public/assets/user.module.css';

const UserBuilds = () => {
  const [priceHistories, setPriceHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedPrices, setUpdatedPrices] = useState({});
  const [openDetail, setOpenDetail] = useState(null); // Detayları göstermek için state
  const { email, logout } = useUser();
  const [newPrices, setNewPrices] = useState({});
  const db = getFirestore(); // Firestore db nesnesi

  useEffect(() => {
    const fetchPriceHistories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'price-histories'));
        const priceHistoriesData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // parts array'sindeki her bir parçada partdocid'yi alıyoruz
          const partsWithIds = data.parts ? data.parts.map(part => {
            console.log('Part doc ID:', part.partdocid); // partdocid'yi debug için yazdır
            return {
              name: part.name,
              partdocid: part.partdocid,  // partdocid burada zaten var
              price: part.price
            };
          }) : [];
    
          return {
            id: doc.id,  // price-history belgesinin ID'si
            ...data,
            timestamp: data.Timestamp,
            parts: partsWithIds, // parts array'ini partdocid ile
          };
        });
        setPriceHistories(priceHistoriesData);
      } catch (error) {
        setError('Error fetching price history');
        console.error('Error fetching price history:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPriceHistories();
  }, [db]);

  const checkPriceChange = async (partdocid) => {
    try {
      console.log('Starting price check for partdocid:', partdocid);

      // Firestore'dan parça bilgisi alıyoruz
      const firestore = getFirestore();
      const partDocRef = doc(firestore, 'parts', partdocid);
      const partDoc = await getDoc(partDocRef);

      if (partDoc.exists()) {
        const partData = partDoc.data();
        const latestPrice = partData.price;

        console.log('Fetched part data:', partData);

        // Yeni fiyatı kaydediyoruz
        setNewPrices((prevPrices) => ({
          ...prevPrices,
          [partdocid]: latestPrice, // partdocid'ye göre yeni fiyatı ekliyoruz
        }));

        return latestPrice > (updatedPrices[partdocid] || latestPrice) ? 'green' : 'red'; // Değişim durumu
      } else {
        console.log('Part document does not exist:', partdocid);
      }

      return '';
    } catch (error) {
      console.error('Error checking price:', error);
      return '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <img src="/assets/logo.png" alt="Logo" />
        <h2>User Panel</h2>
        <div className={styles.userInfo}>
          <span>{email ? `Welcome, ${email}` : 'Guest'}</span>
          <button onClick={logout} className={styles.logoutButton}>Logout</button>
        </div>
      </div>

      <div className={styles.historyContainer}>
        <h4>Price History</h4>
        {priceHistories.length === 0 ? (
          <p>No price history available.</p>
        ) : (
          <table className={styles.historyTable}>
            <thead>
              <tr>
                <th className={styles.boldText}>Build ID</th>
                <th className={styles.boldText}>User</th>
                <th className={styles.boldText}>Action</th>
                <th className={styles.boldText}>Parts</th>
              </tr>
            </thead>
            <tbody>
              {priceHistories.map((history) => (
                <tr key={history.id}>
                  <td>{history.buildId}</td>
                  <td>{history.email}</td>
                  <td>
                    <button
                      className={styles.buttonStyle}
                      onClick={() => toggleDetail(history.id)} // Butona tıklanınca detayları aç
                    >
                      {openDetail === history.id ? 'Hide Details' : 'Show Details'}
                    </button>
                  </td>
                  <td>
                    <ul>
                      {history.parts && history.parts.map((part, index) => (
                        <li key={index}>
                          <strong>{part.name}</strong> - ${part.price}
                          <button
                            onClick={async () => {
                              if (part.partdocid) {
                                const newPrice = await checkPriceChange(part.partdocid); // Yeni fiyatı al
                                console.log('New Price:', newPrice); // Debug: Yeni fiyatı göster
                              } else {
                                console.error('Part partdocid is missing');
                              }
                            }}
                            className={styles.checkPriceButton}
                          >
                            Check Price
                          </button>
                          {/* Yeni fiyat burada gösterilecek */}
                          {newPrices[part.partdocid] && (
                            <div className={styles.newPrice}>
                              New Price: ${newPrices[part.partdocid]}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                    {openDetail === history.id && (
                      <div className={styles.details}>
                        <ul>
                          {history.parts.map((part, index) => (
                            <li key={index}>
                              <strong>{part.name}</strong> - ${part.price}
                              <button
                                onClick={async () => {
                                  await checkPriceChange(part.partdocid); // partdocid ile fiyatı kontrol et
                                }}
                                className={styles.checkPriceButton}
                              >
                                Check Price
                              </button>
                              {/* Yeni fiyat burada gösterilecek */}
                              {newPrices[part.partdocid] && (
                                <div className={styles.newPrice}>
                                  New Price: ${newPrices[part.partdocid]}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div>
        <button onClick={() => window.location.replace('/UserPanel')} className={styles.backButton}>Back</button>
      </div>
    </div>
  );
};

export default UserBuilds;