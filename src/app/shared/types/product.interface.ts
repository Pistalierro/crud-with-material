import firebase from 'firebase/compat/app';

export interface ProductInterface {
  id?: string;
  name: string;
  category: string;
  condition: string;
  date: firebase.firestore.Timestamp;  // Изменено на Timestamp для корректного типа
  price: string;
  comment: string;
}
