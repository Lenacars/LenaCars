import React, { useState, useEffect } from 'react';

function Urunler() {
  const [urunler, setUrunler] = useState([]);

  useEffect(() => {
    // API isteği burada yapılacak
  }, []);

  return (
    <div>
      <h1>Ürünler</h1>
      {/* Ürünler burada listelenecek */}
    </div>
  );
}

export default Urunler;
useEffect(() => {
  fetch(process.env.API_BASE_URL + '/api/products') // '/api/products' yerine kendi uç noktanızı kullanın
    .then(response => response.json())
    .then(data => {
      setUrunler(data);
    })
    .catch(error => {
      console.error('Ürünleri alırken hata oluştu:', error);
    });
}, []);
useEffect(() => {
  fetch('https://adminpanel-2pe5d0sdk-lenacars-projects.vercel.app/api/products') // Doğru uç noktayı kullanın
    .then(response => response.json())
    .then(data => {
      setUrunler(data);
    })
    .catch(error => {
      console.error('Ürünleri alırken hata oluştu:', error);
    });
}, []);
