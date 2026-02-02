# SQL Scripts Klasörü

Bu klasör Supabase veritabanı setup ve yönetim scriptlerini içerir.

## Scriptler

### Setup Scripts
- `fix-all-rls-policies.sql` - RLS politikalarını düzeltme (ÖNERİLEN)
- `fix-rls-policies.sql` - RLS politikaları (eski versiyon)

### User Management
- `check-and-set-admin.sql` - Kullanıcı rollerini kontrol etme ve admin yapma (ÖNERİLEN)
  - Tüm kullanıcıları ve rollerini listeler
  - Belirli bir kullanıcıyı admin yapmak için SQL komutları içerir
  - Email veya User ID ile admin yapma seçenekleri

### Test Data
- `add-test-data.sql` - Test verileri ekleme

## Kullanım

1. Supabase Dashboard → SQL Editor'e gidin
2. İlgili script'i açın
3. İçeriği kopyalayıp SQL Editor'de çalıştırın

## Önemli Notlar

- Script'leri çalıştırmadan önce yedek alın
- Production'da dikkatli kullanın
- Test ortamında önce deneyin
