import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("database.db");

// Khởi tạo bảng dữ liệu
db.exec(`
  CREATE TABLE IF NOT EXISTS menu (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price INTEGER,
    desc TEXT,
    image TEXT,
    category TEXT
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT,
    rating INTEGER,
    comment TEXT,
    date TEXT,
    avatar TEXT
  );
`);

// Chèn dữ liệu mẫu nếu bảng trống
const menuCount = db.prepare("SELECT count(*) as count FROM menu").get() as any;
if (menuCount.count === 0) {
  const insertMenu = db.prepare("INSERT INTO menu (name, price, desc, image, category) VALUES (?, ?, ?, ?, ?)");
  insertMenu.run("Bánh tráng kẹp", 15000, "Giòn tan, đậm đà vị bò khô và trứng.", "https://picsum.photos/seed/banh-trang/400/300", "Bánh tráng");
  insertMenu.run("Chân gà sả tắc", 35000, "Chua cay mặn ngọt, giòn sần sật.", "https://picsum.photos/seed/chan-ga/400/300", "Đồ chiên");
  insertMenu.run("Ốc hút nước dừa", 45000, "Vị béo ngậy của cốt dừa hòa quyện vị cay.", "https://picsum.photos/seed/oc-hut/400/300", "Đồ chiên");
}

const reviewCount = db.prepare("SELECT count(*) as count FROM reviews").get() as any;
if (reviewCount.count === 0) {
  const insertReview = db.prepare("INSERT INTO reviews (user, rating, comment, date, avatar) VALUES (?, ?, ?, ?, ?)");
  insertReview.run("Nguyễn Văn An", 5, "Bánh tráng kẹp ở đây là đỉnh nhất Đà Nẵng luôn!", "2 ngày trước", "https://picsum.photos/seed/user1/100/100");
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get("/api/menu", (req, res) => {
    const items = db.prepare("SELECT * FROM menu ORDER BY id DESC").all();
    res.json(items);
  });

  app.post("/api/menu", (req, res) => {
    const { name, price, desc, image, category } = req.body;
    const info = db.prepare("INSERT INTO menu (name, price, desc, image, category) VALUES (?, ?, ?, ?, ?)").run(name, price, desc, image, category);
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/menu/:id", (req, res) => {
    const { name } = req.body;
    db.prepare("UPDATE menu SET name = ? WHERE id = ?").run(newName, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/menu/:id", (req, res) => {
    db.prepare("DELETE FROM menu WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/reviews", (req, res) => {
    const reviews = db.prepare("SELECT * FROM reviews ORDER BY id DESC").all();
    res.json(reviews);
  });

  // Vite middleware cho development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist/index.html"));
    });
  }

  app.listen(3000, "0.0.0.0", () => {
    console.log("Server is running on http://0.0.0.0:3000");
  });
}

startServer();
