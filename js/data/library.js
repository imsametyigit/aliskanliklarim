// Hazır alışkanlık kütüphanesi (Bölüm 8)
export const CATEGORIES = [
  "Sağlık ve Fiziksel Aktivite",
  "Beslenme ve Su",
  "Uyku ve Dinlenme",
  "Kişisel Gelişim ve Öğrenme",
  "Zihinsel Gelişim ve Farkındalık",
  "Üretkenlik ve Disiplin",
  "Finansal Disiplin",
  "Sosyal Hayat ve Yaşam Düzeni",
];

let n = 0;
const item = (name, category) => ({ id: `lib_${++n}`, name, category });

export const HABIT_LIBRARY = [
  // Sağlık ve Fiziksel Aktivite
  item("Spor yapmak", CATEGORIES[0]),
  item("Yürüyüş / Koşu yapmak", CATEGORIES[0]),
  item("Yoga yapmak", CATEGORIES[0]),
  item("8000+ Adım Atmak", CATEGORIES[0]),
  item("Bisiklete binmek", CATEGORIES[0]),
  item("Yüzmek", CATEGORIES[0]),
  // Beslenme ve Su
  item("2.5+ Litre Su İçmek", CATEGORIES[1]),
  item("Sağlıklı beslenmek", CATEGORIES[1]),
  item("Kahvaltı yapmak", CATEGORIES[1]),
  item("Şeker tüketmemek", CATEGORIES[1]),
  item("Abur cubur tüketmemek", CATEGORIES[1]),
  item("Meyve yemek", CATEGORIES[1]),
  item("Sebze yemek", CATEGORIES[1]),
  item("Günlük kalori hedefini takip etmek", CATEGORIES[1]),
  item("Gece geç saatlerde yemek yememek", CATEGORIES[1]),
  item("Kafein tüketimini sınırlandırmak", CATEGORIES[1]),
  // Uyku ve Dinlenme
  item("Belirlenen saatte uyumak", CATEGORIES[2]),
  item("Belirlenen saatte uyanmak", CATEGORIES[2]),
  item("7–8 saat uyumak", CATEGORIES[2]),
  item("Uyku öncesi telefon kullanmamak", CATEGORIES[2]),
  // Kişisel Gelişim ve Öğrenme
  item("Kitap okumak", CATEGORIES[3]),
  item("Eğitim videosu izlemek", CATEGORIES[3]),
  item("Yeni bir şey öğrenmek", CATEGORIES[3]),
  item("İngilizce çalışmak", CATEGORIES[3]),
  item("Yeni kelime öğrenmek", CATEGORIES[3]),
  item("Podcast dinlemek", CATEGORIES[3]),
  item("Araştırma yapmak", CATEGORIES[3]),
  item("Not almak", CATEGORIES[3]),
  item("Öğrendiklerimi tekrar etmek", CATEGORIES[3]),
  item("Bir beceri geliştirmek", CATEGORIES[3]),
  item("Günün değerlendirmesini yapmak", CATEGORIES[3]),
  // Zihinsel Gelişim ve Farkındalık
  item("Meditasyon yapmak", CATEGORIES[4]),
  item("Nefes egzersizi yapmak", CATEGORIES[4]),
  item("Günlük yazmak", CATEGORIES[4]),
  item("Şükretmek", CATEGORIES[4]),
  item("Olumlu düşünce pratiği yapmak", CATEGORIES[4]),
  item("Kendimle baş başa zaman geçirmek", CATEGORIES[4]),
  item("Sosyal medyaya ara vermek", CATEGORIES[4]),
  item("Duygularımı yazmak", CATEGORIES[4]),
  item("Bugünün olumlu yönlerini yazmak", CATEGORIES[4]),
  item("Sessiz zaman geçirmek", CATEGORIES[4]),
  item("Kendimi değerlendirmek", CATEGORIES[4]),
  // Üretkenlik ve Disiplin
  item("Günlük plan yapmak", CATEGORIES[5]),
  item("Günün en önemli işini tamamlamak", CATEGORIES[5]),
  item("Sabah rutinini tamamlamak", CATEGORIES[5]),
  item("Masa / çalışma alanını düzenlemek", CATEGORIES[5]),
  item("E-postaları / mesajları düzenlemek", CATEGORIES[5]),
  item("Ertesi günü planlamak", CATEGORIES[5]),
  // Finansal Disiplin
  item("Günlük harcamaları takip etmek", CATEGORIES[6]),
  item("Finansal durumumu incelemek", CATEGORIES[6]),
  item("Gelir-gider kaydı tutmak", CATEGORIES[6]),
  // Sosyal Hayat ve Yaşam Düzeni
  item("Aileyle vakit geçirmek", CATEGORIES[7]),
  item("Ev düzeni için zaman ayırmak", CATEGORIES[7]),
  item("Günlük kişisel bakım yapmak", CATEGORIES[7]),
  item("Yeni bir deneyim yaşamak", CATEGORIES[7]),
];
