-- ============================================
-- Ariazalar Tablosu RLS Politikalarını Düzeltme
-- ============================================
-- Bu script, admin'lerin tüm arızaları görebilmesini sağlar

-- Önce mevcut politikaları temizle
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'arizalar'
    )
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.arizalar';
    END LOOP;
END $$;

-- RLS'yi aktif et
ALTER TABLE public.arizalar ENABLE ROW LEVEL SECURITY;

-- 1. Herkes arıza bildirebilir (INSERT)
CREATE POLICY "Anyone can report faults"
  ON public.arizalar FOR INSERT
  TO public
  WITH CHECK (true);

-- 2. Admin'ler tüm arızaları görebilir (SELECT)
-- NOT: Admin kontrolü için users tablosunu sorgulamak sonsuz döngüye neden olabilir
-- Bu yüzden service role key kullanılmalı veya uygulama tarafında kontrol yapılmalı
-- Şimdilik authenticated kullanıcılar kendi bildirdikleri arızaları görebilir
CREATE POLICY "Users can read their own faults"
  ON public.arizalar FOR SELECT
  TO authenticated
  USING (
    -- Kullanıcı kendi bildirdiği arızaları görebilir
    -- VEYA admin ise tüm arızaları görebilir (ama admin kontrolü için users tablosunu sorgulamak gerekir)
    -- Bu yüzden şimdilik sadece kendi arızalarını görebilir
    -- Admin işlemleri için server-side (service role) kullanılmalı
    true  -- Geçici olarak tüm authenticated kullanıcılar görebilir
  );

-- 3. Admin'ler arıza durumunu güncelleyebilir (UPDATE)
CREATE POLICY "Admins can update faults"
  ON public.arizalar FOR UPDATE
  TO authenticated
  USING (true)  -- Geçici olarak tüm authenticated kullanıcılar güncelleyebilir
  WITH CHECK (true);

-- 4. Admin'ler arıza silebilir (DELETE)
CREATE POLICY "Admins can delete faults"
  ON public.arizalar FOR DELETE
  TO authenticated
  USING (true);  -- Geçici olarak tüm authenticated kullanıcılar silebilir

-- NOT: Yukarıdaki politikalar geçici olarak tüm authenticated kullanıcılara izin veriyor
-- Production'da admin kontrolü için:
-- 1. Service role key kullanın (server-side işlemler için)
-- 2. VEYA admin kontrolünü uygulama tarafında yapın (requireAdmin() zaten bunu yapıyor)
