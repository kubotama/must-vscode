import { toUrlRange } from "../select";

const text1 = `
具体的な例で説明します。

たとえば、https://xtech.nikkei.com/atcl/nxt/column/18/00849/00081/?n_cid=nbpnxt_mled_itmh という URL を選択して、
コマンドパレットからMust: Format Link from URLコマンドを実行すると、選択されている URL は以下の文字列に置き替えられます。
`;

const text2 =
  "https://xtech.nikkei.com/atcl/nxt/column/18/00849/00081/?n_cid=nbpnxt_mled_itmh";

const text3 = `
* https://code.visualstudio.com/api/working-with-extensions/bundling-extension
* https://code.visualstudio.com/api/working-with-extensions/publishing-extension on the VSCode extension marketplace.`;

describe("create select", () => {
  test.each([
    { text: text1, start: 0, end: 0, expected: undefined },
    { text: text1, start: 120, end: 140, expected: undefined },
    {
      text: text1,
      start: 20,
      end: 20,
      expected: {
        start: 20,
        end: 99,
        url: "https://xtech.nikkei.com/atcl/nxt/column/18/00849/00081/?n_cid=nbpnxt_mled_itmh",
      },
    },
    {
      text: text1,
      start: 99,
      end: 99,
      expected: {
        start: 20,
        end: 99,
        url: "https://xtech.nikkei.com/atcl/nxt/column/18/00849/00081/?n_cid=nbpnxt_mled_itmh",
      },
    },
    {
      text: text1,
      start: 20,
      end: 120,
      expected: {
        start: 20,
        end: 99,
        url: "https://xtech.nikkei.com/atcl/nxt/column/18/00849/00081/?n_cid=nbpnxt_mled_itmh",
      },
    },
    {
      text: text1,
      start: 10,
      end: 59,
      expected: {
        start: 20,
        end: 99,
        url: "https://xtech.nikkei.com/atcl/nxt/column/18/00849/00081/?n_cid=nbpnxt_mled_itmh",
      },
    },
    {
      text: text1,
      start: 10,
      end: 120,
      expected: {
        start: 20,
        end: 99,
        url: "https://xtech.nikkei.com/atcl/nxt/column/18/00849/00081/?n_cid=nbpnxt_mled_itmh",
      },
    },
    {
      text: text1,
      start: 30,
      end: 40,
      expected: {
        start: 20,
        end: 99,
        url: "https://xtech.nikkei.com/atcl/nxt/column/18/00849/00081/?n_cid=nbpnxt_mled_itmh",
      },
    },
    {
      text: text2,
      start: 0,
      end: 0,
      expected: {
        start: 0,
        end: 79,
        url: "https://xtech.nikkei.com/atcl/nxt/column/18/00849/00081/?n_cid=nbpnxt_mled_itmh",
      },
    },
    {
      text: text2,
      start: 79,
      end: 79,
      expected: {
        start: 0,
        end: 79,
        url: "https://xtech.nikkei.com/atcl/nxt/column/18/00849/00081/?n_cid=nbpnxt_mled_itmh",
      },
    },
    {
      text: text3,
      start: 3,
      end: 3,
      expected: {
        start: 3,
        end: 79,
        url: "https://code.visualstudio.com/api/working-with-extensions/bundling-extension",
      },
    },
    {
      text: text3,
      start: 90,
      end: 100,
      expected: {
        start: 82,
        end: 160,
        url: "https://code.visualstudio.com/api/working-with-extensions/publishing-extension",
      },
    },
    {
      text: text3,
      start: 40,
      end: 120,
      expected: {
        start: 3,
        end: 79,
        url: "https://code.visualstudio.com/api/working-with-extensions/bundling-extension",
      },
    },
  ])("on url: $start - $end $text", ({ text, start, end, expected }) => {
    const selected = toUrlRange(text, start, end);
    expect(selected).toEqual(expected);
  });
});
