import { getFirestore, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../../my-firebase-app/src/firebase';

// Fiyat güncelleme işlevi
export const updatePrice = async (partId, newPrice) => {
  try {
    const firestore = getFirestore();
    const partRef = doc(firestore, "parts", partId);

    // Fiyatı güncelle
    await updateDoc(partRef, { price: newPrice });
    console.log(`Part ${partId} price updated to ${newPrice}`);
  } catch (error) {
    console.error("Error updating price: ", error);
  }
};

// Parça silme işlevi
export const deletePart = async (partId) => {
  try {
    const firestore = getFirestore();
    const partRef = doc(firestore, "parts", partId);

    // Parçayı sil
    await deleteDoc(partRef);
    console.log(`Part ${partId} deleted successfully`);
  } catch (error) {
    console.error("Error deleting part: ", error);
  }
};
