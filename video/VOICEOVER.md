# Ashetag vertical ad — voiceover script

**Video:** `out/ashetag-ad-vertical.mp4` · 30s · 9:16
**Length:** 71 words, about 26 seconds spoken, so the visuals have room to breathe.
**Pace:** about 2.6 words per second. Pause slightly at each line break.

## Voice direction

- **Tone:** warm, confident, quietly excited, like a founder telling a friend about something that works. Not a hard-sell announcer.
- **Voice:** a natural adult voice, male or female, in clear international or Malaysian English.
- **Energy curve:** starts punchy, softens and gets curious through the product shots, then lifts again for the call to action.
- **Music:** duck the music about 8 dB under the voice. Let it swell alone during 23.0–23.3s and in the last half-second.
- **Pronunciation of "Ashetag":** ✅ **ASH-tag** (two syllables, like "ash" + "tag"; the "e" is silent). Say the same in "ashetag.com".

## Script

| In | Out | Shot on screen | Voiceover | Direction |
|---|---|---|---|---|
| 0.3 | 2.4 | Cold open: "BUSYWORK? PUT IT ON AUTOPILOT." | **Busywork?** … Put it on autopilot. | Short pause after "Busywork?" Land "autopilot" as the words slam in. |
| 3.4 | 7.8 | Phones orbit, showing the website | Ashetag builds the AI agents, automations and websites that run your operations. | Smooth and assured. Lean slightly on "run". |
| 8.5 | 12.4 | Live automations list fills up | Workflows that never sleep. Leads routed. Invoices synced. Reports done. | Crisp, rhythmic beats, one per row dropping in. |
| 13.4 | 17.7 | Chat agent books an appointment | Agents that answer, qualify and book your customers, in seconds, twenty-four seven. | Friendly. Smile on "book". |
| 18.5 | 22.6 | Results cards fly in and count up | Real results: hours back every week, and more revenue from the same team. | Proud but understated. Let the numbers on screen do the shouting. |
| 23.3 | 25.6 | Tool floor: OpenAI, Claude, n8n… | Built on the AI tools you already trust. | Reassuring and calm. |
| 27.0 | 29.6 | End card: email typed, "Audit booked" | Book your free AI audit… at **ashetag.com**. | Lift the energy. Say the web address slowly and clearly. Finish before the logo settles. |

## Clean read (for the voice artist)

> Busywork? … Put it on autopilot.
>
> Ashetag builds the AI agents, automations and websites that run your operations.
>
> Workflows that never sleep. Leads routed. Invoices synced. Reports done.
>
> Agents that answer, qualify and book your customers, in seconds, twenty-four seven.
>
> Real results: hours back every week, and more revenue from the same team.
>
> Built on the AI tools you already trust.
>
> Book your free AI audit… at ashetag.com.

## Alternative lines (same length, swap in if preferred)

| Shot | Alternative |
|---|---|
| Cold open | "Drowning in busywork? … Hand it to AI." |
| Results | "Clients get hours back every week, without hiring another person." |
| End card | "Get your free AI audit today… at ashetag.com." |

## AI voice version (Kokoro, generated locally)

`out/ashetag-ad-vertical-vo-female.mp4` uses the Kokoro voice **af_heart** (Apache-2.0, fine for commercial use).
Lines start slightly earlier than the table above and may carry up to about 0.3 s into the next shot (a J-cut), but they never overlap:

| Line | Start | End | Speed |
|---|---|---|---|
| 1 | 0.30 | 2.32 | 1.00× |
| 2 | 3.20 | 8.23 | 1.09× |
| 3 | 8.45 | 13.06 | 1.06× |
| 4 | 13.30 | 18.15 | 1.08× |
| 5 | 18.35 | 22.84 | 1.00× |
| 6 | 23.25 | 25.53 | 1.00× |
| 7 | 26.95 | 29.81 | 1.08× |

To regenerate it, or try another voice (it refuses to build if a voice can't fit without rushing):

```powershell
cd "video/tts"; python -P voiceover.py af_heart female
```

## Recording checklist

- Record at 48 kHz / 24-bit WAV. Leave 1 second of room tone before and after.
- Deliver each line as a separate take as well as one full read, so lines can be nudged to the timecodes above.
- Final mix target is about −14 LUFS for Instagram, TikTok and YouTube Shorts.
- Confirmed: the web address is **ashetag.com**, said "ASH-tag dot com".
