export default async function handler(req, res) {
  // PayUni 回來的參數你之後再驗 Hash、解密
  console.log("=== PayUni Return ===");
  console.log(req.method, req.body || req.query);

  // 先導回成功頁
  res.writeHead(302, { Location: "/checkout/success" });
  res.end();
}
