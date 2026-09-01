# Alışkanlıklarım Uygulaması

## 1\. Proje Özeti

Kişisel gelişim ve günlük alışkanlık takibi için minimalist, modern ve hızlı bir uygulama geliştir.

Uygulamanın temel amacı; kullanıcının alışkanlıklarını günlük olarak listelemesi, tamamladıklarını işaretlemesi, geçmiş performansını incelemesi, gelecekteki günleri planlaması ve gününü yazılı olarak değerlendirmesidir.

İlk sürüm gereksiz şekilde karmaşık olmamalıdır. Ana odak noktası:

* Günlük alışkanlıkları hızlı görmek
* Tek dokunuşla tamamlandı olarak işaretlemek
* Sabit ve Sabit olmayan alışkanlıkları yönetmek
* Geçmiş günleri takvimden incelemek
* İstatistikleri görmek
* Günlük değerlendirme notu yazmak

Uygulama başlangıçta tek kullanıcı için tasarlanmalıdır; ancak mimari gelecekte çoklu kullanıcı ve hesap desteğine genişletilebilir olmalıdır.

\---

# 2\. Ürün Prensipleri

## Temel prensip

Ekranda yalnızca kullanıcının o anda ihtiyaç duyduğu bilgi bulunmalıdır.

Tasarım:

* Minimal
* Modern
* Temiz
* Kişisel
* Profesyonel
* Hızlı
* Uzun süre kullanıma uygun

Kaçınılacak şeyler:

* Gereksiz oyunlaştırma
* Rozet sistemleri
* Karmaşık seviye sistemleri
* Aşırı animasyon
* Gereksiz büyük grafikler
* Sosyal özellikler
* Fazla sayıda ayar
* Karmaşık kullanıcı akışları

\---

# 3\. Ana Navigasyon

Alt menüde 5 ana bölüm bulunmalıdır:

1. Bugün
2. Takvim
3. Alışkanlıklarım
4. İstatistik
5. Profil

Önerilen sıra:

`Bugün | Takvim | Alışkanlıklarım | İstatistik | Profil`

Bottom navigation:

* Beyaz arka plan
* Üstte çok hafif border
* Minimal çizgi ikonlar
* Aktif sekme: Indigo
* Pasif sekmeler: Açık gri
* İkon + kısa metin etiketi

\---

# 4\. BUGÜN — Ana Ekran

Bu uygulamanın merkezi ve en sık kullanılacak ekranıdır.

## 4.1 Üst alan

Üstte:

**Merhaba, \[Kullanıcı Adı]**

Altında:

**1 Eylül 2026, Salı**

Tarih otomatik olarak güncellenmelidir.

Örnek:

Merhaba, Samet
1 Eylül 2026, Salı

## 4.2 Günlük İlerleme Kartı

Gösterilecek bilgiler:

* Tamamlanan alışkanlık sayısı
* Toplam alışkanlık sayısı
* Yüzde başarı oranı
* Progress bar

Örnek:

Günlük İlerleme

4 / 6 tamamlandı                         %67

█████████████░░░░░░

Yüzde hesabı:

`completed / total \\\* 100`

Progress bar, alışkanlık işaretlendiğinde anlık olarak güncellenmelidir.

## 4.3 Bugünün alışkanlıkları

Ana liste iki mantıksal gruptan oluşabilir:

### Sabit alışkanlıklar

Aktif + Sabit olan tüm alışkanlıklar otomatik olarak her güne yansır.

Örnek:

☑ Kitap okumak
☐ Spor yapmak
☑ İngilizce çalışmak
☐ Meditasyon yapmak

### Bugüne eklenenler

Sabit olmayan ve kullanıcı tarafından özellikle o güne manuel eklenen alışkanlıklar.

Örnek:

☐ 2 saat derin çalışma
☐ Proje üzerinde çalışmak

## 4.4 Checkbox mantığı

Her alışkanlığın yanında tıklanabilir checkbox bulunmalıdır.

Tamamlanmadı:

* Açık gri border
* Beyaz/şeffaf iç alan

Tamamlandı:

* Indigo dolgu
* Beyaz tik işareti

Tamamlanma durumu değiştirildiğinde:

* Günlük ilerleme anında güncellenir
* İstatistik verileri buna göre hesaplanır
* Günlük kayıt kalıcı olarak saklanır

## 4.5 Bugüne alışkanlık ekle

Bugün ekranında:

`+ Bugüne Alışkanlık Ekle`

butonu bulunmalıdır.

Tıklandığında yalnızca kullanıcının oluşturduğu veya kütüphaneden eklediği **sabit olmayan aktif alışkanlıklar** gösterilmelidir.

Kullanıcı istediği alışkanlığı seçerek yalnızca o güne ekleyebilmelidir.

Sabit olmayan bir alışkanlık:

* Her güne otomatik eklenmez
* Kullanıcı istediği gün için manuel ekler

## 4.6 Günümü Değerlendir

Bugün ekranının alt bölümünde sade bir kart bulunmalıdır.

Kart:

**Günümü Değerlendir**

Alt metin:

**Bugün nasıl geçti? Günün hakkında notlarını ve düşüncelerini yaz.**

Kart tıklandığında günlük değerlendirme ekranı açılmalıdır.

Not:

* Tarihe bağlı olarak kaydedilmelidir
* Her günün kendi değerlendirme notu olabilir
* Geçmiş bir güne gidildiğinde o güne ait not görüntülenebilmelidir
* Kullanıcı daha sonra notunu düzenleyebilmelidir

Örnek ekran:

Günümü Değerlendir

1 Eylül 2026 — Salı

Bugün nasıl geçti?

\[ Çok satırlı metin alanı ]

\[ Kaydet ]

\---

# 5\. TAKVİM

Takvim ekranının amacı:

* Geçmiş performansı incelemek
* Gün seçmek
* Günlük alışkanlık kayıtlarını görmek
* Günlük değerlendirme notlarına erişmek

## 5.1 Takvim görünümü

Üst bölüm:

`← Eylül 2026 →`

Altında klasik aylık takvim görünümü:

Pzt Sal Çar Per Cum Cmt Paz

Her gün için alışkanlık başarı durumunu minimal bir gösterge ile belirt.

Önerilen mantık:

* Tam başarı: belirgin dolu gösterge
* Kısmi başarı: kısmi/daha açık gösterge
* Geçmişte veri var ancak başarı düşük: farklı yoğunlukta nötr gösterge
* Gelecek gün: henüz veri yok

Renkler aşırı karmaşık olmamalıdır. Başarı yoğunluğu için ana renk tonları kullanılabilir.

## 5.2 Gün detayı

Takvimden bir gün seçildiğinde:

Tarih
Örneğin: 1 Eylül 2026

Başarı:
4 / 6 — %67

Ardından o güne ait alışkanlık listesi:
☑ Kitap okumak
☐ Spor yapmak
☑ İngilizce çalışmak

Eğer günlük değerlendirme notu varsa:

* “Günlük değerlendirme mevcut” göstergesi
* Notu görüntüleme/düzenleme

Geçmiş günlerdeki tamamlanma durumları varsayılan olarak yalnızca görüntülenebilir olabilir; ancak ürün mimarisi ileride düzenlemeye uygun olmalıdır.

\---

# 6\. ALIŞKANLIKLARIM

Bu ekran alışkanlıkların yönetim merkezidir.

Üst bölümde:

# Alışkanlıklarım

Altında:

`+ Alışkanlık Ekle`

Alışkanlıklar iki ana grupta gösterilmelidir.

## 6.1 Sabit Alışkanlıklar

Sabit alışkanlık tanımı:

Aktif ve Sabit olarak ayarlanmış bir alışkanlık, her yeni güne otomatik olarak eklenir.

Örnek:

SABİT ALIŞKANLIKLAR

Kitap okumak                    →
Spor yapmak                     →
İngilizce çalışmak              →
Meditasyon yapmak               →

## 6.2 Sabit Olmayan Alışkanlıklar

Tanım:

Bu alışkanlıklar otomatik olarak her gün görünmez. Kullanıcı bunları ihtiyaç duyduğu günlere manuel olarak ekler.

Örnek:

SABİT OLMAYAN ALIŞKANLIKLAR

2 saat derin çalışma            →
Proje üzerinde çalışmak         →
Soğuk duş                       →

## 6.3 Alışkanlık detay ve yönetim ekranı

Bir alışkanlığa tıklandığında:

Alışkanlık adı

Durum:

* Aktif
* Pasif

Tür:

* Sabit
* Sabit değil

Aksiyonlar:

* Düzenle
* Kaldır

Önemli mantık:

* Aktif + Sabit = her gün otomatik eklenir
* Aktif + Sabit değil = manuel olarak seçilen günlere eklenebilir
* Pasif + Sabit = yeni günlere otomatik eklenmez
* Pasif + Sabit değil = günlük ekleme listesinde gösterilmez

Bir alışkanlığın geçmiş kayıtları korunmalıdır. Kaldırma işlemi fiziksel silme yerine mümkünse arşivleme mantığıyla tasarlanabilir; böylece geçmiş istatistikler bozulmaz.

\---

# 7\. ALIŞKANLIK EKLE

Kullanıcı iki farklı yöntemle alışkanlık ekleyebilmelidir.

## 7.1 Hazır kütüphaneden seç

Ekranda:

* Arama alanı
* Kategoriler
* Hazır alışkanlık listesi

bulunmalıdır.

Örnek:

Alışkanlık Ekle

\[ 🔍 Alışkanlık ara... ]

Hazır alışkanlıklar

Sağlık ve Fiziksel Aktivite
Beslenme ve Su
Uyku ve Dinlenme
Kişisel Gelişim ve Öğrenme
Zihinsel Gelişim ve Farkındalık
Üretkenlik ve Disiplin
Finansal Disiplin
Sosyal Hayat ve Yaşam Düzeni

Bir alışkanlık seçildiğinde kullanıcı:

* Sabit / Sabit değil seçebilir
* Aktif / Pasif seçebilir
* Alışkanlıklarıma ekleyebilir

## 7.2 Kendi alışkanlığını oluştur

Hazır kütüphanenin altında veya görünür bir aksiyon olarak:

`+ Kendi Alışkanlığını Oluştur`

Form:

Alışkanlık adı
\[ \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ ]

Tür:

* Sabit
* Sabit değil

Durum:

* Aktif
* Pasif

\[ Alışkanlığı Ekle ]

Kullanıcı kendi istediği alışkanlığı yazabilmelidir.

\---

# 8\. HAZIR ALIŞKANLIK KÜTÜPHANESİ

Aşağıdaki alışkanlıklar uygulamanın başlangıçta hazır kütüphanesinde bulunmalıdır.

## Sağlık ve Fiziksel Aktivite

1. Spor yapmak
2. Yürüyüş / Koşu yapmak
3. Yoga yapmak
4. 8000+ Adım Atmak
5. Bisiklete binmek
6. Yüzmek

## Beslenme ve Su

7. 2.5+ Litre Su İçmek
8. Sağlıklı beslenmek
9. Kahvaltı yapmak
10. Şeker tüketmemek
11. Abur cubur tüketmemek
12. Meyve yemek
13. Sebze yemek
14. Günlük kalori hedefini takip etmek
15. Gece geç saatlerde yemek yememek
16. Kafein tüketimini sınırlandırmak

## Uyku ve Dinlenme

17. Belirlenen saatte uyumak
18. Belirlenen saatte uyanmak
19. 7–8 saat uyumak
20. Uyku öncesi telefon kullanmamak

## Kişisel Gelişim ve Öğrenme

21. Kitap okumak
22. Eğitim videosu izlemek
23. Yeni bir şey öğrenmek
24. İngilizce çalışmak
25. Yeni kelime öğrenmek
26. Podcast dinlemek
27. Araştırma yapmak
28. Not almak
29. Öğrendiklerimi tekrar etmek
30. Bir beceri geliştirmek
31. Günün değerlendirmesini yapmak

## Zihinsel Gelişim ve Farkındalık

32. Meditasyon yapmak
33. Nefes egzersizi yapmak
34. Günlük yazmak
35. Şükretmek
36. Olumlu düşünce pratiği yapmak
37. Kendimle baş başa zaman geçirmek
38. Sosyal medyaya ara vermek
39. Duygularımı yazmak
40. Bugünün olumlu yönlerini yazmak
41. Sessiz zaman geçirmek
42. Kendimi değerlendirmek

## Üretkenlik ve Disiplin

43. Günlük plan yapmak
44. Günün en önemli işini tamamlamak
45. Sabah rutinini tamamlamak
46. Masa / çalışma alanını düzenlemek
47. E-postaları / mesajları düzenlemek
48. Ertesi günü planlamak

## Finansal Disiplin

49. Günlük harcamaları takip etmek
50. Finansal durumumu incelemek
51. Gelir-gider kaydı tutmak

## Sosyal Hayat ve Yaşam Düzeni

52. Aileyle vakit geçirmek
53. Ev düzeni için zaman ayırmak
54. Günlük kişisel bakım yapmak
55. Yeni bir deneyim yaşamak

\---

# 9\. İSTATİSTİK

İstatistik ekranı başlangıç sürümünde sade olmalıdır.

## 9.1 Genel performans

Göster:

* Bugün
* Bu hafta
* Bu ay

Örnek:

Bugün
67%

Bu Hafta
78%

Bu Ay
72%

## 9.2 Alışkanlık performansı

Her aktif alışkanlık için ilgili dönem başarı oranını göster.

Örnek:

Kitap okumak              %92
Spor yapmak               %80
İngilizce çalışmak        %75
Meditasyon yapmak         %46

İlk sürümde aşırı karmaşık grafikler gerekli değildir. Temiz liste, yüzde ve gerekirse ince progress bar yeterlidir.

İstatistik hesapları:

* Günlük: tamamlanan / o gün planlanan toplam alışkanlık
* Haftalık: ilgili hafta içindeki tamamlanan / planlanan toplam
* Aylık: ilgili ay içindeki tamamlanan / planlanan toplam
* Alışkanlık bazlı: seçilen dönem boyunca o alışkanlığın tamamlanma oranı

\---

# 10\. PROFİL

Uygulama şu an tek kullanıcı odaklıdır; ancak gelecekte başka kullanıcıların kullanabilmesi için profil alanı bulunmalıdır.

Örnek:

PROFİL

Samet

Toplam Tamamlanan
1.248

Genel Başarı
%76

Ayarlar →

Profil ekranı ileride:

* Kullanıcı adı
* Profil görseli
* Hesap
* Çoklu kullanıcı
* Sosyal özellikler

gibi alanlara genişletilebilir.

\---

# 11\. AYARLAR

Ayarlar, profil ekranının içinde yer almalıdır.

Başlangıçta:

* Tema
* Bildirimler
* Verileri yedekle
* Verileri dışa aktar
* Hesap ayarları
* Verileri sıfırla

Bu alan başlangıçta sade tutulmalıdır.

\---

# 12\. GÖRSEL TASARIM SİSTEMİ

## Genel stil

Tarz:

* Minimal
* Modern
* Temiz
* Profesyonel

Hedef his:

Profesyonel bir kişisel dashboard ile sade bir günlük takip uygulamasının birleşimi.

Uygulama:

* Çocukça görünmemeli
* Aşırı kurumsal görünmemeli
* Sakin ve odaklı olmalı

## Ana renk

Indigo:

`#4F46E5`

Kullanım:

* Aktif navigasyon
* Ana butonlar
* Seçili alanlar
* Aktif checkbox
* Progress bar

## Başarı rengi

Yeşil:

`#10B981`

Sınırlı kullanım:

* Başarı durumu
* Pozitif genel göstergeler

Checkbox için varsayılan ana vurgu Indigo olmalıdır.

## Arka plan

`#F8F9FA`

Saf beyaz yerine hafif kırık beyaz arka plan kullan.

## Kart rengi

`#FFFFFF`

## Metin renkleri

Ana metin:

`#111827`

Normal metin:

`#374151`

İkincil metin:

`#9CA3AF`

## Renk prensibi

Ana görsel kombinasyon:

**Beyaz + Açık Gri + Indigo**

Yeşil yalnızca pozitif başarı durumlarında sınırlı kullanılmalıdır.

\---

# 13\. TİPOGRAFİ

Ana font:

**Inter**

Neden:

* Modern
* Temiz
* Yüksek okunabilirlik
* Sayısal veriler için uygun
* Türkçe karakter desteği iyi

Önerilen hiyerarşi:

## Sayfa başlıkları

28–32 px
Bold

## Kart başlıkları

16–18 px
SemiBold

## Normal alışkanlık metni

16 px
Regular veya Medium

## Küçük bilgiler

12–14 px
Regular

\---

# 14\. SPACING VE LAYOUT

Minimal görünüm için bol boşluk kullanılmalıdır.

Önerilen sistem:

* Ekran yatay padding: 20–24 px
* Kartlar arası boşluk: 12–16 px
* Büyük bölümler arası: 24–32 px
* Kart içi padding: 16–20 px
* Border radius: 14–16 px

Kartlarda:

* Çok yoğun gölge kullanma
* Gerekirse çok hafif gölge
* Alternatif olarak çok hafif border

Ekran sıkışık görünmemelidir.

\---

# 15\. ANİMASYON

Animasyonlar sınırlı olmalıdır.

## Checkbox

Alışkanlık tamamlandığında:

* 150–200 ms
* Hafif scale veya yumuşak geçiş

## Progress bar

Tamamlanma değiştiğinde yumuşak biçimde güncellenmeli.

## Sayfa geçişleri

* Hızlı
* Yumuşak
* Dikkat dağıtmayan

Büyük veya dekoratif animasyonlardan kaçın.

\---

# 16\. TEMEL VERİ MODELİ

Aşağıdaki mantıksal veri yapısını kullan veya buna yakın temiz bir model oluştur.

## User

* id
* name
* profileImage (opsiyonel)
* createdAt
* settings

## Habit

* id
* name
* category (opsiyonel)
* source: `library` | `custom`
* isFixed: boolean
* isActive: boolean
* createdAt
* updatedAt
* archivedAt (opsiyonel)

## DailyHabit

Belirli bir gün ile alışkanlık arasındaki kayıt.

* id
* date
* habitId
* completed: boolean
* completedAt (opsiyonel)
* source: `fixed` | `manual`

Bu yapı sayesinde geçmiş günlerin kayıtları ayrı tutulabilir.

## DailyReflection

* id
* date
* content
* createdAt
* updatedAt

\---

# 17\. GÜNLÜK VERİ MANTIĞI

Her gün için gösterilecek alışkanlıklar:

1. Aktif + Sabit olan alışkanlıklar otomatik olarak o günün listesine dahil edilir.
2. Kullanıcının o gün manuel olarak eklediği aktif + Sabit olmayan alışkanlıklar listeye dahil edilir.
3. Her günün tamamlanma verisi ayrı saklanır.
4. Geçmiş veriler, bir alışkanlık daha sonra pasif veya arşivlenmiş olsa bile korunur.
5. Yeni bir Sabit alışkanlık eklenirse, varsayılan olarak eklenme tarihinden sonraki günlere uygulanmalıdır. Geçmiş günlere otomatik olarak eklenmemelidir.
6. Sabit olmayan alışkanlıklar yalnızca kullanıcının eklediği belirli günlerde görünmelidir.

\---

# 18\. ÖNEMLİ UX KURALLARI

* Ana ekranda alışkanlık tamamlamak mümkün olan en hızlı işlem olmalıdır.
* Kullanıcı uygulamayı açtığında doğrudan Bugün ekranına gelmelidir.
* Günlük ilerleme hemen görünmelidir.
* Sabit ve Sabit olmayan alışkanlık ayrımı kullanıcıya açık olmalıdır.
* Alışkanlık ekleme akışı kısa tutulmalıdır.
* Hazır kütüphane ve kendi alışkanlığını oluşturma seçenekleri aynı ekranda erişilebilir olmalıdır.
* Günlük değerlendirme ayrı bir ana menü olmamalıdır; Bugün ekranına bağlı olmalıdır.
* Takvim geçmiş kayıtları kolayca incelemek için kullanılmalıdır.
* İstatistikler sade ve anlamlı olmalıdır.
* Gereksiz modal ve fazla adımlı akışlardan kaçınılmalıdır.

\---

# 19\. UYGULAMA AKIŞI

Genel mantık:

Alışkanlıklarım
│
├── Sabit Alışkanlıklar
│   └── Her güne otomatik eklenir
│
├── Sabit Olmayan Alışkanlıklar
│   └── İstenen güne manuel eklenir
│
└── Alışkanlık Ekle
├── Hazır Kütüphaneden Seç
└── Kendi Alışkanlığını Oluştur

Günlük kullanım:

Bugün
│
├── Sabit alışkanlıkları göster
├── Bugüne manuel eklenenleri göster
├── Checkbox ile tamamla
├── Günlük ilerlemeyi güncelle
├── + Bugüne Alışkanlık Ekle
└── Günümü Değerlendir
└── Tarihe bağlı not kaydet

Veriler:

Günlük kayıtlar
│
├── Takvim
│   └── Geçmiş günleri görüntüle
│
└── İstatistik
├── Günlük
├── Haftalık
├── Aylık
└── Alışkanlık bazlı

\---

# 20\. GELİŞTİRME ÖNCELİĞİ

Uygulamayı şu sırayla geliştir:

## Faz 1 — Temel altyapı

* Uygulama navigasyonu
* Veri modeli
* Kalıcı veri saklama
* Bugün ekranı

## Faz 2 — Alışkanlık sistemi

* Sabit alışkanlıklar
* Sabit olmayan alışkanlıklar
* Alışkanlık ekleme
* Hazır kütüphane
* Kendi alışkanlığını oluşturma
* Düzenleme / pasif / arşivleme

## Faz 3 — Günlük takip

* Checkbox tamamlama
* Günlük ilerleme
* Günlük kayıt sistemi
* Bugüne manuel alışkanlık ekleme

## Faz 4 — Takvim

* Aylık görünüm
* Gün seçimi
* Gün detayları
* Günlük değerlendirme notuna erişim

## Faz 5 — Günlük değerlendirme

* Not oluşturma
* Not düzenleme
* Tarihe göre saklama

## Faz 6 — İstatistik

* Günlük oran
* Haftalık oran
* Aylık oran
* Alışkanlık bazlı performans

## Faz 7 — Profil ve ayarlar

* Profil ekranı
* Tema
* Bildirimler için altyapı
* Veri dışa aktarma / yedekleme için uygun yapı

\---

# 21\. SON GELİŞTİRME TALİMATI

Bu uygulamayı üretirken yukarıdaki ürün gereksinimlerine ve tasarım sistemine sadık kal.

Özellikle:

* Minimalist kal
* Fazla özellik ekleme
* Kullanıcı akışını karmaşıklaştırma
* Her ekranı mobil öncelikli tasarla
* Tüm metinleri Türkçe kullan
* Tarih formatlarını Türkçe göster
* Türkçe karakterleri doğru destekle
* Inter font kullan
* Belirlenen renk sistemini kullan
* 5 sekmeli alt navigasyonu kullan
* Uygulama ilk açıldığında Bugün ekranını göster
* Sabit ve Sabit olmayan alışkanlık mantığını veri modelinde doğru uygula
* Günlük kayıtları ve geçmiş verileri kalıcı olarak sakla
* Günlük değerlendirme notlarını tarihe bağla
* İstatistikleri gerçek kaydedilmiş verilerden hesapla

Önce sağlam, temiz ve çalışan temel ürünü oluştur. Gereksiz özellikler ekleme. Kod mimarisini gelecekte genişletmeye uygun tut.

