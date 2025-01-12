import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../public/assets/user.module.css';
import { useUser } from '../src/utils/UserContext';

const MyBuilds = () => {
  const [priceHistories, setPriceHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [buildLoading, setBuildLoading] = useState(false);
  const [buildError, setBuildError] = useState(null);
  const [newTotalPrice, setNewTotalPrice] = useState(null);  // Yeni toplam fiyatı tutacağız
  const [priceDifference, setPriceDifference] = useState(null);  // Fiyat farkı
  const [isPriceIncreased, setIsPriceIncreased] = useState(null);  // Fiyat artışı mı, azalış mı?

  const API_URL = 'https://backend-s1x4.onrender.com/price-histories';
  const { username, logout } = useUser();
const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  useEffect(() => {
    const fetchPriceHistories = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          alert('Token not found. Please log in.');
          return;
        }
  
        const response = await axios.get('https://backend-s1x4.onrender.com/price-histories', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        // Kullanıcının kendi price-histories verilerini filtrele
        const userPriceHistories = response.data.data.filter(
          (history) => history.user === username
        );
  
        setPriceHistories(userPriceHistories);
      } catch (error) {
        setError('Error fetching price history');
        console.error('Error fetching price history:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPriceHistories();
  }, [username]);

  const fetchBuildDetails = async (buildID) => {
    try {
      setBuildLoading(true);
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        alert('Token not found. Please log in.');
        return;
      }
  
      const response = await axios.get(`https://backend-s1x4.onrender.com/builds/${buildID}?populate=parts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      // Yalnızca kullanıcının kendi build'ini göstermek için kontrol ekliyoruz
      if (response.data.data.user !== username) {
        alert('You can only view your own builds');
        return;
      }
  
      // Eğer tıklanan build zaten seçiliyse, seçimi kaldırıyoruz
      if (selectedBuild && selectedBuild.id === buildID) {
        setSelectedBuild(null); // Seçili build'i kaldırıyoruz
      } else {
        setSelectedBuild(response.data.data); // Yeni build'i seçiyoruz
        setNewTotalPrice(response.data.data.totalprice);  // Yeni toplam fiyatı alıyoruz
      }
    } catch (error) {
      setBuildError('Error fetching build details');
      console.error('Error fetching build details:', error);
    } finally {
      setBuildLoading(false);
    }
  };
  const handleBack = async () => {
    window.location.replace('/AdminPanel'); // Redirect back to Admin Panel
  };

  const handleBackUser = async () => {
    window.location.replace('/UserPanel'); // Redirect back to Admin Panel
  };
  const handleCheckPrice = () => {
    let totalPrice = 0;
    let previousPrice = selectedBuild.totalprice;

    selectedBuild.parts.forEach((part) => {
      totalPrice += parseFloat(part.price);  // String fiyatları sayıya çevirip topluyoruz
    });

    setNewTotalPrice(totalPrice);

    // Fiyat farkını hesaplıyoruz
    const difference = totalPrice - parseFloat(previousPrice); // Önceki fiyatı da sayıya çeviriyoruz
    setPriceDifference(difference);

    // Fiyatın artıp artmadığını kontrol ediyoruz
    setIsPriceIncreased(difference > 0);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <img src="/assets/logo.png" alt="Logo" />
        <h2>User Panel</h2>
        <div className={styles.userInfo}>
          <span>{username ? `Welcome, ${username}` : 'Guest'}</span>
          <button onClick={logout} className={styles.logoutButton}>Logout</button>
        </div>
      </div>
  
      {!showDetails && (
        <div className={styles.historyContainer}>
          <h4>Price History</h4>
          {priceHistories.length === 0 ? (
            <p>No price history available.</p>
          ) : (
            <table className={styles.historyTable}>
              <thead>
                <tr>
                  <th className={styles.boldText}>Build ID</th>
                  <th className={styles.boldText}>Price</th>
                  <th className={styles.boldText}>User</th>
                  <th className={styles.boldText}>Action</th>
                </tr>
              </thead>
              <tbody>
                {priceHistories.map((history) => (
                  <tr key={history.id}>
                    <td>{history.buildID}</td>
                    <td>${history.price}</td>
                    <td>{history.user}</td>
                    <td>
                      <button
                        onClick={() => {
                          fetchBuildDetails(history.buildID);
                          toggleDetails();
                        }}
                        className={styles.buttonStyle}
                      >
                        {selectedBuild && selectedBuild.id === history.buildID ? 'Hide Details' : 'Show Details'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
  <div>
    {username === 'admin' ? (
      <button onClick={handleBack} className={styles.backButton}>Back</button>
    ) : (
      <button onClick={handleBackUser} className={styles.backButton}>Back</button>
    )}
  </div>
      {showDetails && selectedBuild && (
        <div className={styles.selectedBuildContainer}>
          <button onClick={toggleDetails} className={styles.buttonStyle}>Close</button>
          {buildLoading ? (
            <div>Loading build details...</div>
          ) : buildError ? (
            <div>{buildError}</div>
          ) : (
            <div>
              <h4 className={styles.boldText}>Build Details</h4>
              <p><strong>Build ID:</strong> {selectedBuild.id}</p>
              <p><strong>Price:</strong> ${selectedBuild.totalprice}</p>
              <h5 className={styles.boldText}>Parts:</h5>
              <ul>
                {selectedBuild.parts && selectedBuild.parts.map((part) => (
                  <li key={part.id}>
                    <strong>{part.name}</strong> - ${part.price}
                  </li>
                ))}
              </ul>
  
              <button onClick={handleCheckPrice} className={styles.buttonStyle}>Check Price</button>

{newTotalPrice !== null && (
  <div>
    <p><strong>New Price:</strong> ${newTotalPrice}</p>
    {priceDifference !== null && (
      <div style={{ color: isPriceIncreased ? 'red' : 'green' }}>
        <p><strong>Price Difference:</strong> ${priceDifference}</p>
      </div>
    )}
  </div>
)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyBuilds;