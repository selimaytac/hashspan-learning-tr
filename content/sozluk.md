# Sözlük

Her terim tek cümle. Ayrıntı için diyagramlara bak.

## Blockchain

| Terim | Nedir? | hashspan'de neden var? |
|---|---|---|
| EVM | Ethereum ve uyumlu zincirlerin ortak çalışma ortamı. | hashspan şu an EVM zincirlerini izliyor (`blockchain.system.name=evm`). |
| Chain ID | Zincirin numarası (1 Ethereum, 8453 Base, 31337 Anvil). | Span adında ve tüm key'lerde hash ile birlikte kullanılıyor. |
| Transaction hash | Gönderilen transaction'ın kimliği. | Send'i confirm'e bağlayan anahtar (ADR 0001). |
| Receipt | Transaction mine olunca oluşan sonuç belgesi. | Status, gas ve fee buradan geliyor. |
| Nonce | Bir adresin kaçıncı transaction'ı olduğu. | Aynı nonce ile gönderilen yeni tx eskisinin yerine geçebiliyor. |
| Gas / effectiveGasPrice | Hesaplama birimi ve gas başına gerçekte ödenen ücret. | Fee hesabı: `gasUsed × effectiveGasPrice`. |
| L1 fee | OP-stack L2'lerin veriyi Ethereum'a yazma ücreti. | Base'de gerçek maliyeti eksiksiz göstermek için. |
| Wei | ETH'nin en küçük birimi (10⁻¹⁸ ETH). | Kodda `bigint`, span'de decimal string. |
| Revert | Contract'ın durup değişiklikleri geri alması. Fee yine ödenir. | Confirm span'i error olur. |
| Revert reason | Revert'ün nedeni. | Receipt'te yok, `eth_call` replay ile bulunuyor (ADR 0005). |
| Selector | Calldata'nın ilk 4 byte'ı, çağrılan fonksiyon. | Public, her zaman kaydediliyor. Argümanlar opt-in. |
| ABI | Contract'ın fonksiyon ve error tanımları. | Fonksiyon adı ve custom error'ları decode etmek için. |
| Replacement | Aynı nonce'lu başka bir tx'in mine olması. | Bekleyen hash `replaced` ile bitiyor (ADR 0008). |
| Preconfirmation | Block kesinleşmeden verilen geçici receipt. | Fee kesinleşmiş receipt'ten alınıyor (ADR 0024). |
| JSON-RPC / EIP-1193 | Node ile konuşma protokolü ve JS provider arayüzü. | Adapter'lar node'la bununla konuşuyor, testlerde mock'lanıyor. |
| `eth_call` | Tx'i zincire yazmadan simüle eden çağrı. | Revert nedenini bulmak için. |
| User operation (ERC-4337) | Smart account'ların gönderdiği işlem. | `userOpHash` ile ayrı izleniyor (ADR 0021). |
| Call batch (EIP-5792) | Cüzdana birden çok çağrıyı tek seferde göndermek. | Batch id ile izleniyor (ADR 0022). |
| x402 | HTTP 402 tabanlı ödeme protokolü. | Tx'i facilitator gönderdiği için `payment` span'i (ADR 0013). |
| EIP-3009 / Permit2 | İmzayla token transferine izin veren standartlar. | x402 ödemesinin gerçekten yapıldığını doğrulamak için (ADR 0017). |

## OpenTelemetry

| Terim | Nedir? | hashspan'de neden var? |
|---|---|---|
| Trace | Bir isteğin span ağacı. | Tx'leri agent'ın kendi trace'ine koymak projenin amacı. |
| Span | Tek bir işin zamanlı kaydı. | Her gönderim, bekleme ve ödeme bir span. |
| SpanKind.CLIENT | Uzak sisteme yapılan çağrı. | Send ve confirm node'a yapılan çağrılar. |
| Attribute | Span üzerindeki anahtar-değer. | Hash, fee, status bunlarla taşınıyor. |
| Status | `UNSET`, `OK`, `ERROR`. | Hata ve revert'te `ERROR`, başarıda `UNSET`. |
| Exception event | Span içindeki hata kaydı. | Gizlilik için elle oluşturuluyor (ADR 0006). |
| Context / `context.active()` | Aktif span bilgisini taşıyan nesne. | Parent'ı parametre almadan bulmak için. |
| Context manager | Context'i async çağrılar boyunca taşır (AsyncLocalStorage). | Kurulmazsa span'ler ağaca bağlanmaz. |
| Span link | Parent olmayan ilişki. | Confirm'i send'e bağlamak için (ADR 0002). |
| Baggage | Context'le taşınan veri. | Agent kimliği için, statik değer önce gelir (ADR 0011). |
| API ve SDK | API arayüz, SDK gerçek iş. SDK yoksa no-op. | hashspan sadece API'ye bağımlı. |
| Peer dependency | Uygulamadan beklenen bağımlılık. | API'nin tek kopyası olsun diye. |
| Tracer / TracerProvider | Span açan nesne ve fabrikası. | İlk span'de tembel alınıyor. |
| `diag` | OTel'in iç log kanalı. | Yutulan telemetri hatalarını loglamak için. |
| Exporter / OTLP | Span'leri backend'e gönderen parça ve protokolü. | Kullanıcının mevcut backend'ine göndermek için. |
| SpanProcessor | Span'leri exporter'a hemen ya da toplu iletir. | Testlerde `Simple`, span hemen görünsün diye. |
| InMemorySpanExporter | Span'leri bellekte tutar. | Testlerde span doğrulamak için. |
| Metrics / histogram | Sayısal ölçümler. | Süre ve fee dağılımları (ADR 0020). |
| Semantic conventions | Ortak isimlendirme standartları. | `blockchain.*` hashspan'in tanımı (ADR 0003). |
| Kardinalite | Bir alanın kaç farklı değer alabildiği. | Hash span adına konmuyor. |

## hashspan

| Terim | Nedir? | Neden var? |
|---|---|---|
| Core | Hash ve metadata'dan span üreten katman. | Ortak yaşam döngüsü mantığı tek yerde. |
| Adapter | Bir kütüphanenin gönderim yolunu izleyen ince katman. | Yeni yol = yeni adapter. |
| `createTxTracker()` | Core'un giriş noktası. | Tracker'ları sadece bu üretir (ADR 0014). |
| Handle | `end` / `fail` / `timeout` ile sonucu bildiren nesne. | Adapter span'le uğraşmasın diye. |
| `ReceiptLike` | Kütüphaneden bağımsız receipt. | Core viem'e bağımlı olmasın diye. |
| LinkStore | `(chainId, hash) → send span`. | Confirm'de link kurmak için. |
| ConfirmRegistry | `(chainId, hash) → confirm span`. | Tek confirm span'i için (ADR 0007). |
| Background confirmation | Kimse beklemese de receipt'i poll etmek. | Fire-and-forget agent'lar için (ADR 0018). |
| `track()` / `flush()` | Sonradan süren işleri kaydet ve bekle. | Kapanışta span kaybolmasın (ADR 0010). |
| Late send | Chain id bilinmiyorsa span'i sonra kaydetmek. | Çağrı gecikmesin (ADR 0009). |
| `safely` | Telemetri kodunu saran try/catch. | Hata kullanıcıya ulaşmasın. |
| Address mode | `raw` / `hashed` / `off`. | Adres kişisel veri olabilir (ADR 0004). |
| `errorMessages` | `off` / `sanitized` / `raw`. | Mesajlar hassas veri içerebilir (ADR 0006). |
| Redaction hook | Kullanıcının attribute'ları son kez düzenlemesi. | Bilinmeyen gizlilik ihtiyaçları için. |
| Payment span | x402 ödemesinin span'i. | Tx'i facilitator gönderiyor (ADR 0013, 0023). |
| `traceTransport()` | Her RPC isteği için span. | Node çağrılarını görmek için (ADR 0019). |
| `watch()` | Dışarıdan verilen hash'i confirm etmek. | CDP ve x402 bunu kullanıyor. |
| `reader` | Receipt okumak için read-only viem client. | REST tabanlı yollarda client yok. |

## Araçlar

| Terim | Nedir? | Neden var? |
|---|---|---|
| pnpm workspace | Tek repoda çok paket. | Paketler birlikte geliştirilsin. |
| corepack / `.nvmrc` | Araç sürümlerini sabitler. | Herkes Node 24 ile çalışsın. |
| TypeScript | Tipli JavaScript. | Tip güvenliği. |
| `isolatedDeclarations` | Export'larda açık dönüş tipi. | `.d.ts` hızlı ve öngörülebilir. |
| İki tsconfig | `src` Node tipsiz, testler Node tipli. | Kütüphane her ortamda çalışsın. |
| tsdown | Build aracı. | `dist/` çıktısı. |
| Biome | Lint ve format. | Tek hızlı araç. |
| Vitest | Test framework'ü. | Unit ve integration testleri. |
| Mock transport | Sahte EIP-1193 provider. | Unit testlerde RPC kontrolü. |
| Anvil / prool | Yerel EVM zinciri ve testten başlatıcısı. | Public ağ olmadan gerçek zincir. |
| Mock CDP API | CDP API'nin yerel taklidi. | Testler localhost'ta kalsın. |
| SDK drift testleri | Kopyalanan SDK kurallarını kontrol eder. | SDK değişince sessiz bozulma olmasın. |
| Jaeger | Trace backend'i (Docker). | Span'leri gözle görmek (`make lab-up`). |
| `make demo` | Örnek AI SDK agent'ı. | Uçtan uca örnek, CI'da test ediliyor. |
| ADR | Mimari karar kaydı. | Kararların nedeni tek yerde. |
| `docs/semconv.md` | Span ve attribute isimleri. | Public API, testle kontrol ediliyor. |
| Changesets | Sürüm notu ve versiyon aracı. | Her davranış değişikliği bununla yayınlanıyor. |
| publint / attw | Paket export kontrolü. | Paket her ortamda doğru import edilsin. |
| Trusted publishing | Token'sız, Actions'tan npm yayını. | Paketin bu repodan geldiği kanıtlansın. |
| gitleaks | Secret tarayıcı. | Key sızmasın. |
