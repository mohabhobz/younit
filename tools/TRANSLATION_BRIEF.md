# Arabic translation brief — Younit

Every content file under `src/content/en/` has an Arabic twin at the same path
under `src/content/ar/`. This is the brief every translation follows, so
thirteen sessions and twenty glossary terms read as one voice.

## The voice

The client's own Arabic, from the original site's `messages/ar.json`, sets it:
plain, unadorned, declarative. No marketing register, no exclamation, no
rhetorical flourish the English does not have. Where the English is blunt
("Not a sandbox. Not a toy."), the Arabic is blunt.

Address the reader as **أنت** implicitly — instructional, not formal-plural.
Prefer the verbal noun and the simple present. Keep sentences the length they
are in English; do not merge or split them.

## The frontmatter

Keep every key and its order. Change only:

- `locale: en` → `locale: ar`
- `title`, `description`, `term`, `shortDefinition` → translated
- everything else — `slug`, `session`, `duration`, dates, `authors`, `tags`,
  `prerequisites`, `status`, `relatedTerms`, `builders`, `university`,
  `repoUrl`, `liveUrl` — **unchanged**, byte for byte. The slug is the URL and
  the tags are keys.

`duration: "45 min"` becomes `duration: "٤٥ دقيقة"`.

## What is not translated

- Code blocks, and anything inside backticks.
- Tickers, API names, library names: `COMI`, `EGX`, `EFG`, `API`, `MCP`,
  `Python`, `pandas`, `GitHub`.
- Numbers stay in Western digits inside code, tables and figures. In running
  prose, Eastern Arabic digits (٠١٢٣) are used only where the English spells a
  number out.
- Proper names of people and institutions.

## The terms

| English | Arabic |
|---|---|
| capital markets | أسواق رأس المال |
| stock / share | سهم |
| stock market | سوق الأسهم |
| the market | السوق |
| exchange | البورصة |
| EGX | البورصة المصرية |
| trade (n) | صفقة |
| trading | التداول |
| trader | متداول |
| investor | مستثمر |
| order | أمر |
| limit order | أمر محدد السعر |
| market order | أمر بسعر السوق |
| bid / ask | عرض الشراء / عرض البيع |
| spread | الفارق السعري |
| liquidity | السيولة |
| volatility | التقلب |
| volume | حجم التداول |
| price discovery | اكتشاف السعر |
| order book | سجل الأوامر |
| portfolio | المحفظة |
| position | المركز |
| return | العائد |
| risk | المخاطر |
| index | المؤشر |
| ETF | صندوق المؤشرات المتداولة (ETF) |
| dividend | التوزيعات |
| earnings | الأرباح |
| valuation | التقييم |
| balance sheet | الميزانية العمومية |
| income statement | قائمة الدخل |
| cash flow | التدفق النقدي |
| market cap | القيمة السوقية |
| candlestick | الشمعة |
| chart | الرسم البياني |
| trend | الاتجاه |
| support / resistance | الدعم / المقاومة |
| moving average | المتوسط المتحرك |
| indicator | المؤشر الفني |
| technical analysis | التحليل الفني |
| fundamental analysis | التحليل الأساسي |
| algorithm | خوارزمية |
| algorithmic trading | التداول الخوارزمي |
| strategy | استراتيجية |
| signal | إشارة |
| backtest | الاختبار الرجعي |
| overfitting | الإفراط في المواءمة |
| slippage | الانزلاق السعري |
| commission | العمولة |
| drawdown | التراجع |
| execution | التنفيذ |
| broker | الوسيط |
| latency | زمن الاستجابة |
| machine learning | تعلّم الآلة |
| sentiment | المشاعر |
| dataset | مجموعة البيانات |
| notebook | دفتر (Notebook) |
| repository | مستودع |
| template | قالب |
| dashboard | لوحة متابعة |
| leaderboard | لوحة الصدارة |
| capstone | مشروع تخرج |
| session | جلسة |
| Foundation Series | سلسلة الأساسيات |
| Algo Track | مسار الخوارزميات |
| Deep Dives | تحليلات معمّقة |
| glossary | المسرد |
| builder | بنّاء |
| Innovation Hub | مركز الابتكار |

## Markdown

Keep the structure exactly: the same headings at the same levels, the same
lists, the same tables, the same `<Callout>` and `<Term>` components with the
same attributes, the same blockquotes, the same horizontal rules, the same
number of paragraphs. A translated file differs from its English twin only in
the language of its prose.
