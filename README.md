# nexus360-prezentaciok
## Követés (PostHog, EU)
Minden prezentáció `<head>`-jében: `<script src="/assets/nx-track.js" defer></script>` – új prezentációnál ezt be kell tenni.
Süti nélkül fut. Események: `prezentacio_megnyitva`, `dia_megtekintve` (dia, fejezet, ido_mp), `matterport_megnyitva`, `kapcsolat_kattintas`, `prezentacio_bezarva`. A `prezentacio` / `marka` / `iparag` tulajdonság a címből jön (`/<iparag>/<marka>-<sorszam>/`). Belső megnyitás kizárása: `?nx_belso=1`.

## Mobilnézet (minden kiküldött anyagban kötelező)
A `<head>`-be a követőkód elé:
```
<link rel="stylesheet" href="/assets/nx-mobil.css">
<script src="/assets/nx-mobil.js"></script>
```
Telefonon (≤900 px, vagy álló tablet) a diás lapozás helyett folyamatosan görgethető oldal lesz, görgetésre induló animációkkal, felső haladásjelzővel; asztali gépen nem változik semmi. Kényszerítés próbához: `?nezet=mobil` / `?nezet=asztali`.
