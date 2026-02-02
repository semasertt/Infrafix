# Public Klasörü

Bu klasör Next.js'te statik dosyalar için kullanılır. Bu klasördeki dosyalar URL ile doğrudan erişilebilir.

## Kullanım

- `/image.jpg` → `public/image.jpg` dosyasına erişir
- `/documents/file.pdf` → `public/documents/file.pdf` dosyasına erişir

## Mevcut Yapı

```
public/
├── documents/          # PDF belgeler (opsiyonel)
└── icons/             # Public icon'lar (opsiyonel)
```

## Notlar

- Bu klasör şu an boş
- Görseller `assets/` klasöründe ve import ile kullanılıyor
- Gerekirse buraya statik dosyalar eklenebilir
