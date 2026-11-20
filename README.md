# nexus360-prezentaciok
## Követés (PostHog, EU)
Minden prezentáció `<head>`-jében: `<script src="/assets/nx-track.js" defer></script>` – új prezentációnál ezt be kell tenni.
Általános (gyökér-) linkeken alapból nincs követőkód. Kivétel: `onkormanyzat/altalanos-01` (Digitalizált önkormányzat) – Dénes kérésére (2026-11-20) mérjük; a pult `PQ_MERT_ALT` listája és a `prezentaciok/<id>.mert` jelölés engedi a statisztikába.
Süti nélkül fut. Események: `prezentacio_megnyitva`, `dia_megtekintve` (dia, fejezet, ido_mp), `matterport_megnyitva`, `kapcsolat_kattintas`, `prezentacio_bezarva`. A `prezentacio` / `marka` / `iparag` tulajdonság a címből jön (`/<iparag>/<marka>-<sorszam>/`). Belső megnyitás kizárása: `?nx_belso=1` – ez a böngészőt tartósan meg is jelöli (localStorage + süti, minden megnyitáskor megújul), onnantól a PostHog be sem töltődik rajta. Saját eszköz megjelölése / törlése: `/sajat-eszkoz/` oldal, vagy `?nx_belso=0` a jelölés törléséhez.

## Mobilnézet (minden kiküldött anyagban kötelező)
A `<head>`-be a követőkód elé:
```
<link rel="stylesheet" href="/assets/nx-mobil.css">
<script src="/assets/nx-mobil.js"></script>
```
Telefonon (≤900 px, vagy álló tablet) a diás lapozás helyett folyamatosan görgethető oldal lesz, görgetésre induló animációkkal, felső haladásjelzővel; asztali gépen nem változik semmi. Kényszerítés próbához: `?nezet=mobil` / `?nezet=asztali`.

## Sablonból épülő ügyféloldalak (2026-11-18)
A pult az ajánlásoknál magától hozza létre az ügyfél oldalát egy rövid csonkként:
`/<iparág>/<márka>-<sorszám>/index.html` → `<script src="/assets/nx-sablon.js" data-sablon="/sablonok/<iparág>/" data-marka="…">`.
A tartalom a `sablonok/<iparág>/index.html` fájlból jön (`{{MARKA}}` helyére a márkanév kerül), így egy sablonjavítás minden ilyen oldalon él.
Sablonok: szalloda, rendezvenyhelyszin, iroda. Új iparághoz új sablonmappa kell, és a pult NXAJ_SABLON térképébe is fel kell venni.
