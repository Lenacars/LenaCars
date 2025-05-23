<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Araç Kiralama Kartları</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        body {
            font-family: 'Arial', sans-serif; /* Görseldeki fonta benzer genel bir font */
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: flex-start; /* Kartları yukarıdan başlat */
            flex-wrap: wrap; /* Birden fazla kart sığmazsa alt satıra geçir */
        }

        .vehicle-card-container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px; /* Kartlar arası boşluk */
            justify-content: center;
        }

        .vehicle-card {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            width: 320px; /* Görseldeki kart genişliğine benzer */
            overflow: hidden;
            display: flex;
            flex-direction: column;
            padding: 15px;
            transition: transform 0.2s ease-in-out;
        }

        .vehicle-card:hover {
            transform: translateY(-5px);
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        .vehicle-name {
            font-size: 1.2em; /* Biraz daha büyük */
            font-weight: bold;
            color: #333;
            margin: 0;
        }

        .vehicle-name .model-highlight {
            font-weight: normal; /* Model adını normal ağırlıkta */
        }

        .details-link {
            font-size: 0.85em;
            color: #6A3C96; /* Kurumsal Renk */
            text-decoration: none;
            font-weight: bold;
        }

        .details-link:hover {
            text-decoration: underline;
        }

        .vehicle-image-container {
            width: 100%;
            height: 180px; /* Sabit yükseklik, görseldeki gibi */
            overflow: hidden;
            border-radius: 6px;
            margin-bottom: 10px;
            position: relative; /* Etiket için */
        }

        .vehicle-image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover; /* Resmin tamamını kapla, gerekirse kırp */
        }

        .vehicle-tag {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: #e9e9e9; /* Açık gri */
            color: #555;
            padding: 5px 10px;
            border-radius: 15px; /* Hap şeklinde */
            font-size: 0.75em;
            font-weight: bold;
        }

        .ekonomik-tag {
            /* Özel bir stil gerekirse buraya eklenebilir */
        }

        .vehicle-specs {
            display: flex;
            justify-content: flex-start; /* Sola yaslı */
            gap: 15px; /* Öğeler arası boşluk */
            font-size: 0.8em;
            color: #666;
            margin-bottom: 10px;
            padding-left: 5px; /* Hafif içten başlasın */
        }

        .vehicle-specs i {
            margin-right: 5px;
            color: #888;
        }

        .deposit-info {
            font-size: 0.8em;
            color: #555;
            margin-bottom: 10px;
            background-color: #f7f7f7;
            padding: 6px 10px;
            border-radius: 4px;
            text-align: left;
        }

        .discount-banner {
            background-color: #e8dff5; /* Kurumsal rengin açık tonu */
            color: #6A3C96; /* Kurumsal Renk */
            padding: 8px;
            font-size: 0.85em;
            font-weight: bold;
            text-align: center;
            border-radius: 4px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .discount-banner i {
            margin-right: 6px;
        }

        .price-section {
            margin-bottom: 15px;
            text-align: left;
        }

        .daily-price {
            font-size: 1.5em; /* Fiyat daha büyük */
            font-weight: bold;
            color: #6A3C96; /* Kurumsal Renk */
        }

        .daily-price .price-period {
            font-size: 0.6em; /* "Günlük" yazısı daha küçük */
            font-weight: normal;
            color: #555;
            margin-left: 5px;
        }

        .total-price {
            font-size: 0.85em;
            color: #777;
            margin-top: 2px;
        }

        .select-vehicle-btn {
            background-color: #6A3C96; /* Kurumsal Renk */
            color: #fff;
            border: none;
            padding: 12px 15px;
            font-size: 1em;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
            width: 100%;
            transition: background-color 0.2s ease;
            margin-top: auto; /* Kartın dibine iter */
        }

        .select-vehicle-btn:hover {
            background-color: #562f7a; /* Kurumsal rengin koyu tonu */
        }
    </style>
</head>
<body>

    <div class="vehicle-card-container">
        <div class="vehicle-card">
            <div class="card-header">
                <h3 class="vehicle-name">Citroen <span class="model-highlight">C-Elysee</span></h3>
                <a href="#" class="details-link">Detay</a>
            </div>
            <div class="vehicle-image-container">
                <img src="https://i.imgur.com/YOUR_IMAGE_ID_CELYSEE.jpg" alt="Citroen C-Elysee"> <span class="vehicle-tag ekonomik-tag">Ekonomik</span>
            </div>
            <div class="vehicle-specs">
                <span><i class="fas fa-gas-pump"></i> Dizel</span>
                <span><i class="fas fa-cogs"></i> Manuel</span>
                <span><i class="fas fa-users"></i> 5</span>
            </div>
            <div class="deposit-info">
                Depozito: ₺17.600
            </div>
            <div class="discount-banner">
                <i class="fas fa-tag"></i> ₺1.539,74 İndirim Uygulandı
            </div>
            <div class="price-section">
                <div class="daily-price">₺1.315,38 <span class="price-period">Günlük</span></div>
                <div class="total-price">₺13.154,00 Toplam</div>
            </div>
            <button class="select-vehicle-btn">Aracı Seç</button>
        </div>

        <div class="vehicle-card">
            <div class="card-header">
                <h3 class="vehicle-name">FIAT <span class="model-highlight">Egea</span></h3>
                <a href="#" class="details-link">Detay</a>
            </div>
            <div class="vehicle-image-container">
                <img src="https://i.imgur.com/YOUR_IMAGE_ID_EGEA.jpg" alt="Fiat Egea"> <span class="vehicle-tag ekonomik-tag">Ekonomik</span>
            </div>
            <div class="vehicle-specs">
                <span><i class="fas fa-gas-pump"></i> Dizel</span>
                <span><i class="fas fa-cogs"></i> Manuel</span>
                <span><i class="fas fa-users"></i> 5</span>
            </div>
            <div class="deposit-info">
                Depozito: ₺17.600
            </div>
            <div class="discount-banner">
                <i class="fas fa-tag"></i> ₺1.539,74 İndirim Uygulandı
            </div>
            <div class="price-section">
                <div class="daily-price">₺1.359,37 <span class="price-period">Günlük</span></div>
                <div class="total-price">₺13.594,00 Toplam</div>
            </div>
            <button class="select-vehicle-btn">Aracı Seç</button>
        </div>

         <div class="vehicle-card">
            <div class="card-header">
                <h3 class="vehicle-name">Hyundai <span class="model-highlight">i-20</span></h3>
                <a href="#" class="details-link">Detay</a>
            </div>
            <div class="vehicle-image-container">
                <img src="https://i.imgur.com/YOUR_IMAGE_ID_I20.jpg" alt="Hyundai i20"> <span class="vehicle-tag ekonomik-tag">Ekonomik</span>
            </div>
            <div class="vehicle-specs">
                <span><i class="fas fa-gas-pump"></i> Benzin</span>
                <span><i class="fas fa-cogs"></i> Otomatik</span>
                <span><i class="fas fa-users"></i> 5</span>
            </div>
            <div class="deposit-info">
                Depozito: ₺17.600
            </div>
            <div class="discount-banner">
                <i class="fas fa-tag"></i> ₺1.539,74 İndirim Uygulandı
            </div>
            <div class="price-section">
                <div class="daily-price">₺1.522,14 <span class="price-period">Günlük</span></div>
                <div class="total-price">₺15.221,00 Toplam</div>
            </div>
            <button class="select-vehicle-btn">Aracı Seç</button>
        </div>
        </div>

</body>
</html>
