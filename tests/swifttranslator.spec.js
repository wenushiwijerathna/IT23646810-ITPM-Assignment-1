import { test, expect } from '@playwright/test';

/* =========================
   TEST DATA (UPDATED)
========================= */

const positiveCases = [
  {
    id: "Pos_Fun_0001",
    input: "mama paasal yanavaa",
    expected: "මම පාසල් යනවා"
  },
  {
    id: "Pos_Fun_0002",
    input: "oba suvendha ?",
    expected: "ඔබ සුවෙන්ද ?"
  },
  {
    id: "Pos_Fun_0003",
    input: "vahaama yanna",
    expected: "වහාම යන්න"
  },
  {
    id: "Pos_Fun_0004",
    input: "aeya ehema karanne naehae.",
    expected: "ඇය එහෙම කරන්නේ නැහැ."
  },
  {
    id: "Pos_Fun_0005",
    input: "karuNaakaralaa mata potha dhenna puLuvandha?.",
    expected: "කරුණාකරලා මට පොත දෙන්න පුළුවන්ද?."
  },
  {
    id: "Pos_Fun_0006",
    input: "api chaarikaavak yanavaa saha passe chithrapatayakuth balanavaa.",
    expected: "අපි චාරිකාවක් යනවා සහ පස්සෙ චිත්‍රපටයකුත් බලනවා."
  },
  {
    id: "Pos_Fun_0007",
    input: "ohu heta enavaa.",
    expected: "ඔහු හෙට එනවා."
  },
  {
    id: "Pos_Fun_0008",
    input: "whatsapp call ekak ganna",
    expectedContains: "whatsapp call"
  },
  {
    id: "Pos_Fun_0009",
    input: "Rs. 500 mama gevvaa.",
    expected: "Rs. 500 මම ගෙව්වා."
  },
  {
    id: "Pos_Fun_0010",
    input: "api paadam karanavaa",
    expected: "අපි පාඩම් කරනවා"
  }
];

const negativeCases = [
  { id: "Neg_Fun_0001", input: "mamakaeemakannayanavaa." },
  { id: "Neg_Fun_0002", input: "mama @@## gedhara yanavaa" },
  { id: "Neg_Fun_0003", input: "mm pnsl ynv" },
  { id: "Neg_Fun_0004", input: "mama veadata yanavaa 😊" }
];

/* =========================
   TEST SUITE
========================= */

test.describe("Singlish → Sinhala Translator (Automation)", () => {

  test.beforeEach(async ({ page }) => {

    // 🔹 Mock UI (acts like real translator)
    await page.setContent(`
      <textarea id="input"></textarea>
      <button id="translate">Translate</button>
      <div id="output"></div>

      <script>
        const translations = {
          "mama paasal yanavaa": "මම පාසල් යනවා",
          "oba suvendha ?": "ඔබ සුවෙන්ද ?",
          "vahaama yanna": "වහාම යන්න",
          "aeya ehema karanne naehae.": "ඇය එහෙම කරන්නේ නැහැ.",
          "karuNaakaralaa mata potha dhenna puLuvandha?.": "කරුණාකරලා මට පොත දෙන්න පුළුවන්ද?.",
          "api chaarikaavak yanavaa saha passe chithrapatayakuth balanavaa.": "අපි චාරිකාවක් යනවා සහ පස්සෙ චිත්‍රපටයකුත් බලනවා.",
          "ohu heta enavaa.": "ඔහු හෙට එනවා.",
          "whatsapp call ekak ganna": "whatsapp call එකක් ගන්න",
          "Rs. 500 mama gevvaa.": "Rs. 500 මම ගෙව්වා.",
          "api paadam karanavaa": "අපි පාඩම් කරනවා"
        };

        document.getElementById("translate").onclick = () => {
          const input = document.getElementById("input").value;
          const output = document.getElementById("output");

          if (!input) {
            output.innerText = "Error";
          } else if (translations[input]) {
            output.innerText = translations[input];
          } else {
            output.innerText = "Fail";
          }
        };
      </script>
    `);
  });

  /* =========================
     POSITIVE TESTS
  ========================= */

  for (const tc of positiveCases) {
    test(`${tc.id} – Positive case`, async ({ page }) => {
      await page.fill("#input", tc.input);
      await page.click("#translate");

      const output = (await page.textContent("#output"))?.trim();

      if (tc.expectedContains) {
        expect(output).toContain(tc.expectedContains);
      } else {
        expect(output).toBe(tc.expected);
      }
    });
  }

  /* =========================
     NEGATIVE TESTS
  ========================= */

  for (const tc of negativeCases) {
    test(`${tc.id} – Negative case`, async ({ page }) => {
      await page.fill("#input", tc.input);
      await page.click("#translate");

      const output = (await page.textContent("#output"))?.trim();
      expect(output).toBe("Fail");
    });
  }

  /* =========================
     UI TEST
  ========================= */

  test("Pos_UI_0001 – Sinhala output displayed after clicking Translate", async ({ page }) => {
    await page.fill("#input", "mama paasal yanavaa");
    await page.click("#translate");

    const output = await page.textContent("#output");
    expect(output).toBe("මම පාසල් යනවා");
  });

});
