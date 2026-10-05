# Görsel Kripto ve hashspan

Kripto cüzdanları, imzalar, custody, konsensüs ve on-chain gözlemlenebilirlik: az yazı, çok çizim. Türkçe ve ücretsiz.

**Site:** https://selimaytac.github.io/hashspan-learning-tr/

Her konu kısa sayfalara bölünmüştür: her sayfada bir fikir, bir çizim ve altında birkaç madde. 58 konu, 370 sayfa.

## Kripto akademisi

Anahtardan konsensüse: cüzdanlar, imzalar, kurumsal custody, PoS ve L2, çizimlerle.

### A · Temeller

- [K1 · Anahtar, adres, imza](https://selimaytac.github.io/hashspan-learning-tr/kripto/k1-anahtar-adres-imza/): Private key, seed phrase, public key, Ethereum adresi ve imza nedir? Anvil test hesabının gerçek değerleriyle adım adım, çizimlerle.
- [K2 · Hesap modelleri](https://selimaytac.github.io/hashspan-learning-tr/kripto/k2-hesap-modelleri/): Bitcoin UTXO, Ethereum account ve Solana account modelleri: bakiye nerede durur, nonce ne işe yarar, token bakiyesi neden kontrattadır?

### B · Wallet tipleri

- [K3 · Wallet haritası](https://selimaytac.github.io/hashspan-learning-tr/kripto/k3-wallet-haritasi/): Wallet türlerinin haritası: custodial ve non-custodial, hot, warm ve cold; hardware wallet, borsa, multisig, MPC ve smart account nerede durur?
- [K4 · Hardware wallet ve cold storage](https://selimaytac.github.io/hashspan-learning-tr/kripto/k4-hardware-cold/): Hardware wallet ve cold storage: imza cihazın içinde atılır, kör imza riski, air-gapped imzalama, seed yedeği, passphrase ve kurumsal HSM.
- [K5 · Multisig, MPC, Shamir](https://selimaytac.github.io/hashspan-learning-tr/kripto/k5-multisig-mpc-shamir/): Tek anahtarın riskini azaltan üç yol: multisig, MPC ve Shamir. Kural nerede durur, imza nasıl oluşur, hangisi kimin işine yarar?
- [K6 · Smart account](https://selimaytac.github.io/hashspan-learning-tr/kripto/k6-smart-account/): Smart account: hesabı kodun yönettiği cüzdanlar. ERC-4337, paymaster, batch, EIP-7702, passkey, session key ve social recovery.
- [K7 · Embedded wallet](https://selimaytac.github.io/hashspan-learning-tr/kripto/k7-embedded-wallet/): Embedded wallet: seed görmeden e-posta ya da Google ile açılan cüzdanlar. TEE, MPC ve Shamir tasarımları, sağlayıcılar ve politika.

### C · Auth ve yetki

- [K8 · İmza ile giriş](https://selimaytac.github.io/hashspan-learning-tr/kripto/k8-imza-ile-giris/): Sign-In with Ethereum (EIP-4361): şifre yerine imza ile giriş. Domain ve nonce, EIP-191 ve EIP-712, ERC-1271 ve cüzdan bağlantısı.
- [K9 · Onaylar ve imza tuzakları](https://selimaytac.github.io/hashspan-learning-tr/kripto/k9-onaylar-tuzaklar/): Paranın çoğu anahtarla değil imzayla çalınır: approve, sınırsız onay, permit, Permit2, sahte giriş, address poisoning ve savunma.
- [K10 · Agent'lara yetki vermek](https://selimaytac.github.io/hashspan-learning-tr/kripto/k10-agent-yetkisi/): AI agent'lara cüzdan yetkisi vermek: ham anahtardan session key ve politikaya, prompt injection, x402 ödemeleri, insan onayı ve gözlem.

### D · Kurumlar

- [K11 · Kurumsal custody](https://selimaytac.github.io/hashspan-learning-tr/kripto/k11-kurumsal-custody/): Kurumsal custody nasıl işler: hot, warm ve cold katmanları, çekim yolu, politika motoru, MPC imza, omnibus hesap ve proof of reserves.
- [K12 · Operasyon, denetim, uyum](https://selimaytac.github.io/hashspan-learning-tr/kripto/k12-operasyon-uyum/): Custody operasyonu ve uyum: key ceremony, görev ayrılığı, mutabakat, felaket tatbikatı, SOC 2, FIPS, KYC/KYT, Travel Rule ve lisanslar.
- [K13 · Büyük vakalar](https://selimaytac.github.io/hashspan-learning-tr/kripto/k13-buyuk-vakalar/): Kriptonun büyük vakaları: Mt. Gox, FTX, Ronin, Bybit ve Wintermute. Ne oldu, nasıl oldu ve hangi dersler çıktı?

### E · Konsensüs ve PoS

- [K14 · Konsensüs neden var?](https://selimaytac.github.io/hashspan-learning-tr/kripto/k14-konsensus-neden/): Konsensüs neden gerekir: double spend, Sybil saldırısı, PoW ve PoS, olasılıksal, ekonomik ve anında finality, kaç onay beklenir.
- [K15 · Proof of Stake türleri](https://selimaytac.github.io/hashspan-learning-tr/kripto/k15-pos-turleri/): Proof of Stake aileleri: zincir tabanlı, BFT, Ethereum'un hibrit Gasper'ı, DPoS, NPoS ve LPoS, Solana ve Avalanche. Nasıl karşılaştırılır?
- [K16 · Ethereum PoS'un içi](https://selimaytac.github.io/hashspan-learning-tr/kripto/k16-ethereum-pos/): Ethereum PoS'un içi: slot ve epoch, proposer ve komite, checkpoint ve finality, LMD-GHOST, validator olmak, ödül, ceza, slashing ve çıkış.
- [K17 · Staking ekonomisi](https://selimaytac.github.io/hashspan-learning-tr/kripto/k17-staking-ekonomisi/): Staking ekonomisi: solo, servis, liquid staking ve restaking; getirinin kaynakları, ücretlerin yakımı, MEV-Boost, sandwich ve riskler.

### F · Büyük resim

- [K18 · L2'ler ve köprüler](https://selimaytac.github.io/hashspan-learning-tr/kripto/k18-l2-kopruler/): L2'ler ve köprüler: rollup, sequencer, L2 finality ve ücreti, optimistic ve ZK rollup, köprü güven modeli, Wormhole ve Nomad vakaları.

## hashspan

AI agent'ların zincire gönderdiği işlemleri OpenTelemetry ile izlemek: hashspan nasıl çalışır?

### Faz 1 · Temeller

- [1 · Büyük resim](https://selimaytac.github.io/hashspan-learning-tr/hashspan/1-buyuk-resim/): hashspan'in agent trace'i ile zincir arasındaki boşluğu nasıl kapattığı: adapter, core ve OpenTelemetry SDK katmanlarının yeri.
- [2 · Bir transaction'ın hayatı](https://selimaytac.github.io/hashspan-learning-tr/hashspan/2-transaction-hayati/): Bir transaction'ın oluşturulmasından receipt'ine kadarki adımları, send ve confirm span'lerinin sınırları, dört olası sonuç ve fee hesabı.
- [3 · Trace ağacı ve context](https://selimaytac.github.io/hashspan-learning-tr/hashspan/3-trace-ve-context/): OpenTelemetry'de trace ağacı, context ve span link kavramları; confirm span'inin neden send'in çocuğu olmadığı ve span'lerin backend'e yolu.
- [4 · Altın kurallar](https://selimaytac.github.io/hashspan-learning-tr/hashspan/4-altin-kurallar/): hashspan'in iki temel kuralı: kullanıcının çağrısını asla bozmamak ve dışarı çıkan veriyi adres modu, hata modu ve redact hook ile sınırlamak.
- [5 · Her transaction için tek confirm span'i](https://selimaytac.github.io/hashspan-learning-tr/hashspan/5-tek-confirm/): Aynı transaction'ı birden çok yer beklediğinde neden tek bir confirm span'i oluştuğu: ConfirmRegistry, handle'lar ve background confirmation.
- [6 · Repo haritası ve araçlar](https://selimaytac.github.io/hashspan-learning-tr/hashspan/6-repo-ve-araclar/): hashspan reposunun paket katmanları (core, viem, cdp, x402) ve bir değişikliğin unit testten npm yayınına kadar izlediği yol.

### Faz 2 · viem adapter'ı

- [7 · client.extend() ve send span'inin context olması](https://selimaytac.github.io/hashspan-learning-tr/hashspan/7-viem-extend/): viem client.extend() ile withHashspan()'in action'ları nasıl sardığı, neden en son uygulandığı ve send span'inin context olması (ADR 0015).
- [8 · Telemetri çağrı yolunun dışında](https://selimaytac.github.io/hashspan-learning-tr/hashspan/8-cagri-yolu-disinda/): Telemetrinin çağrı yolunun dışında kalması: chain id'nin paralel çözülmesi, track() ve flush() ile süren işler, background confirmation limiti.
- [9 · Zor sonuçlar](https://selimaytac.github.io/hashspan-learning-tr/hashspan/9-zor-sonuclar/): Zor sonuçlar: revert nedeninin replay ile bulunması, replacement, Base flashblocks preconfirmation ve timeout'un nasıl kaydedildiği.
- [10 · JSON-RPC span'leri](https://selimaytac.github.io/hashspan-learning-tr/hashspan/10-json-rpc-spanleri/): traceTransport() ile her JSON-RPC isteğinin bir CLIENT span'i olması: yazılan attribute'lar, gizlenen değerler ve span'in ağaçtaki yeri.

### Faz 3 · x402

- [11 · x402 ve HTTP 402 akışı](https://selimaytac.github.io/hashspan-learning-tr/hashspan/11-x402-akisi/): x402 ile HTTP 402 akışı: agent'ın bir API'yi istek başına imzayla ödemesi, facilitator'ın settlement'ı ve hashspan'in payment span'i.
- [12 · İmza ile ödeme](https://selimaytac.github.io/hashspan-learning-tr/hashspan/12-imza-ile-odeme/): x402 ödemelerinin neden transaction değil imza olduğu: EIP-3009 ve Permit2 arasındaki farklar, exact ve upto şemaları.
- [13 · hashspan ödeyen tarafta](https://selimaytac.github.io/hashspan-learning-tr/hashspan/13-x402-odeyen-taraf/): @hashspan/x402'nin ödeyen tarafta hook'larla payment span'i kurması, reader ile confirm span'i ve blockchain.payment.verified doğrulaması.
- [14 · Alan taraf ve güvenilmeyen girdi](https://selimaytac.github.io/hashspan-learning-tr/hashspan/14-x402-alan-taraf/): x402 resource server tarafı için önerilen withHashspanServer tasarımı (ADR 0023) ve uzaktan gelen güvenilmeyen girdinin kuralları (ADR 0025).

### Faz 4 · OTLP

- [15 · OTLP protokolü](https://selimaytac.github.io/hashspan-learning-tr/hashspan/15-otlp-protokolu/): OTLP ile span'lerin uygulamadan backend'e yolu: SDK, processor, exporter, isteğe bağlı collector, HTTP ve gRPC portları, ortam değişkenleri.
- [16 · SDK kurulumu](https://selimaytac.github.io/hashspan-learning-tr/hashspan/16-sdk-kurulumu/): Örnek agent'ın telemetry.ts dosyasıyla OpenTelemetry SDK kurulumu: resource, processor, register, AI SDK span'leri, metrics ve kapanış sırası.
- [17 · Backend'ler](https://selimaytac.github.io/hashspan-learning-tr/hashspan/17-backendler/): Aynı hashspan span'lerinin Jaeger, Grafana Tempo, Langfuse ve Honeycomb'da görünümü, kurulum değişkenleri ve her backend'in farkları.
- [18 · Semconv ve gizlilik](https://selimaytac.github.io/hashspan-learning-tr/hashspan/18-semconv-gizlilik/): hashspan semantic conventions: send, confirm ve payment span'lerinin attribute'ları, sonuçlar, adres modu, hata gizliliği, sınırlar ve ad değişim kuralı.
- [19 · Metrics ve Grafana](https://selimaytac.github.io/hashspan-learning-tr/hashspan/19-metrics-grafana/): hashspan'in üç histogram metriği, düşük kardinaliteli attribute'lar, sonuç değerleri, Prometheus'a aktarım, Grafana dashboard'u ve bucket'lar.
- [20 · Sorun giderme](https://selimaytac.github.io/hashspan-learning-tr/hashspan/20-sorun-giderme/): Backend'de görülen belirtiden yola çıkarak hashspan sorunlarını çözmek: span yok, ayrı trace, link yok, confirm yok, fee ya da revert reason eksik.

### Faz 5 · Diğer yollar

- [21 · CDP ve smart account'lar](https://selimaytac.github.io/hashspan-learning-tr/hashspan/21-cdp-smart-account/): Coinbase CDP adapter'ı, reader ile confirm, ağ adlarının chain id'ye çevrilmesi, ERC-4337 user operation'ları ve EIP-5792 call batch'leri.
- [22 · Entegrasyon haritası](https://selimaytac.github.io/hashspan-learning-tr/hashspan/22-entegrasyon-haritasi/): Agent kütüphaneleri, framework'ler ve cüzdan servisleriyle hashspan: AgentKit, GOAT, Mastra, OpenInference, Turnkey, Privy, Circle ve CI testleri.

### Faz 6 · Repoda çalışmak

- [23 · Test stratejisi](https://selimaytac.github.io/hashspan-learning-tr/hashspan/23-test-stratejisi/): hashspan'in test katmanları: unit testler, Anvil testleri, kötü girdi tabloları, doküman testleri, paket smoke testleri ve haftalık sürüm kontrolleri.
- [24 · Sürüm, API sınırı ve güvenlik](https://selimaytac.github.io/hashspan-learning-tr/hashspan/24-surum-api-guvenlik/): hashspan'in sürüm süreci: changeset'ler, katman katman npm yayını, token'sız OIDC, rc pre mode, public API sınırı ve CI'daki güvenlik hattı.
- [25 · Issue'dan PR'a ve yerel lab](https://selimaytac.github.io/hashspan-learning-tr/hashspan/25-issue-pr-lab/): hashspan'e katkının yolu: öncelik etiketleri, testle başlayan değişiklik, PR başlığı, changeset, make komutlarıyla yerel lab ve demo trace.

### Faz 7 · Ne yapabiliyor?

- [26 · Yetenek haritası](https://selimaytac.github.io/hashspan-learning-tr/hashspan/26-yetenek-haritasi/): hashspan'in her gönderim yolunda ne kaydettiği: viem transaction'ları, sync çağrılar, user operation, call batch, CDP, x402 ve JSON-RPC span'leri.
- [27 · Ortamlar ve sınırlar](https://selimaytac.github.io/hashspan-learning-tr/hashspan/27-ortamlar-sinirlar/): hashspan hangi Node.js, Bun ve Deno sürümlerinde, hangi zincirlerde çalışır; bellek, zaman ve uzunluk sınırları neler, neyi asla yapmaz?
- [28 · Güvenlik modeli](https://selimaytac.github.io/hashspan-learning-tr/hashspan/28-guvenlik-modeli/): hashspan'in güvenlik modeli: neye güvenir, dışarıdan gelen girdiyi nasıl doğrular, neler kapsamda sayılır ve bir açık nasıl bildirilir?

### Faz 8 · Neden böyle?

- [29 · ADR haritası](https://selimaytac.github.io/hashspan-learning-tr/hashspan/29-adr-haritasi/): hashspan'in 27 mimari karar kaydı (ADR) altı temada: temel mimari, gizlilik, doğru sonuç, çağrıyı bozmamak, yeni yollar, gözlem çıktısı.
- [30 · Neden X değil de Y?](https://selimaytac.github.io/hashspan-learning-tr/hashspan/30-neden-x-degil-y/): hashspan tasarımında reddedilen sekiz alternatif ve gerekçeleri: tek uzun span, kendi servisi, varsayılan hashed adres, chain id cache'i ve dahası.
- [31 · Sürüm yolculuğu](https://selimaytac.github.io/hashspan-learning-tr/hashspan/31-surum-yolculugu/): hashspan'in 0.1'den 0.12'ye sürüm yolculuğu: viem, CDP, x402, metrikler, smart account ve 1.0 çıkış kriterleri; 1.0 henüz kararlı değil.

### Faz 9 · Entegrasyonlar

- [32 · Coinbase AgentKit](https://selimaytac.github.io/hashspan-learning-tr/hashspan/32-agentkit/): Coinbase AgentKit wallet provider'larıyla gönderilen işlemleri hashspan ile izlemek: viem ve CDP provider kurulumu, diğer provider'lar, dikkat noktaları.
- [33 · AI SDK ve Mastra](https://selimaytac.github.io/hashspan-learning-tr/hashspan/33-ai-sdk-mastra/): Vercel AI SDK ve Mastra agent'larında hashspan: tool span'i aktifken işlemler doğru yere düşer; kurulum, demo trace'i ve OtelBridge.
- [34 · OpenInference](https://selimaytac.github.io/hashspan-learning-tr/hashspan/34-openinference/): OpenInference ile izlenen LangChain JS ve OpenAI Agents SDK agent'larında hashspan span'leri neden yanlış yere düşer ve nasıl düzeltilir?
- [35 · GOAT, wallet servisleri, ElizaOS](https://selimaytac.github.io/hashspan-learning-tr/hashspan/35-goat-wallet-eliza/): GOAT SDK, Turnkey, Privy, Circle, Fireblocks gibi wallet servisleri ve ElizaOS ile gönderilen işlemleri hashspan ile izlemek mümkün mü?
- [36 · Hangi kurulum?](https://selimaytac.github.io/hashspan-learning-tr/hashspan/36-hangi-kurulum/): Hangi hashspan kurulumu gerekli? İşlemi kimin gönderdiğine, framework'e, sürecin ömrüne ve backend'e göre adım adım karar ağacı.

### Faz 10 · Güncelleme

- [37 · 0.11.0: ne değişti?](https://selimaytac.github.io/hashspan-learning-tr/hashspan/37-surum-0-11/): hashspan 0.11.0'da ne değişti: blockchain.system.name, Prometheus'ta seri kopması, fee.payer, kötü girdiye dayanıklılık ve API raporları.
- [38 · 1.0 neyi donduruyor?](https://selimaytac.github.io/hashspan-learning-tr/hashspan/38-adr-0027/): hashspan 1.0 neyi donduruyor (ADR 0027): public TypeScript API, söz verilen davranış ve ortamlar donar; semconv adları kurallarla değişir.
- [39 · 0.12.0: ne değişti?](https://selimaytac.github.io/hashspan-learning-tr/hashspan/39-surum-0-12/): hashspan 0.12.0'da ne değişti: reorg sonrası receipt'i tekrar okuma, sync gönderim, yeni sınırlar; ayrıca 1.0 rc'nin getirdikleri.
- [40 · Gözden kaçan detaylar](https://selimaytac.github.io/hashspan-learning-tr/hashspan/40-gozden-kacanlar/): hashspan'de kolay gözden kaçan detaylar: zincir ailelerine göre fee, chain'siz client, sampling'de send ve confirm, test edilen dokümanlar.

## Yapı

- `content/`: görseller (`img/`), sosyal önizlemeler (`og/`), konu ve sayfa verisi (`data.json`), sözlük (`sozluk.md`)
- `build.mjs`: siteyi `_site/` altına üretir (`node build.mjs`, bağımlılık yok); GitHub Actions her push'ta GitHub Pages'e yayınlar

## Lisans

İçerik (görseller ve metinler) [CC BY 4.0](LICENSE): kaynak göstererek kullanabilirsin. Kod [MIT](LICENSE-CODE).
