//1.create db new
use("electronicsdb")

//2.create collection new
db.createCollection("phone")
db.createCollection("computer")
db.createCollection("clock")
db.createCollection("accessory")

//3.insert many document

// ========== PHONE ==========
db.phone.insertMany([
    { name: "Iphone 15 pro", price: 15000, brand: "Iphone", quantity: 1000, discount: 5, available: true, rating: 4.8, releaseYear: 2023 },
    { name: "Galaxy S24 Ultra", price: 1200, brand: "Samsung", quantity: 300, discount: 10, available: true, rating: 4.7, releaseYear: 2024 },
    { name: "Xiaomi 14 Pro", price: 900, brand: "Xiaomi", quantity: 500, discount: 8, available: true, rating: 4.5, releaseYear: 2024 },
    { name: "Pixel 9 Pro", price: 1100, brand: "Google", quantity: 200, discount: 6, available: true, rating: 4.6, releaseYear: 2024 },
    { name: "OnePlus 12", price: 850, brand: "OnePlus", quantity: 350, discount: 7, available: true, rating: 4.4, releaseYear: 2024 },
    { name: "Oppo Find X7", price: 950, brand: "Oppo", quantity: 260, discount: 9, available: true, rating: 4.3, releaseYear: 2024 },
    { name: "Vivo X100 Pro", price: 1050, brand: "Vivo", quantity: 180, discount: 5, available: true, rating: 4.5, releaseYear: 2024 },
    { name: "ROG Phone 8", price: 1300, brand: "ASUS", quantity: 120, discount: 4, available: true, rating: 4.6, releaseYear: 2024 }
]);

// ========== COMPUTER ==========

db.computer.insertMany([
    { name: "MacBook Pro 14", price: 2200, brand: "Apple", quantity: 80, discount: 3, available: true, rating: 4.9, releaseYear: 2023 },
    { name: "ThinkPad X1 Carbon", price: 1800, brand: "Lenovo", quantity: 120, discount: 7, available: true, rating: 4.7, releaseYear: 2024 },
    { name: "Dell XPS 13", price: 1600, brand: "Dell", quantity: 150, discount: 6, available: true, rating: 4.6, releaseYear: 2024 },
    { name: "HP Omen 16", price: 1500, brand: "HP", quantity: 90, discount: 10, available: true, rating: 4.4, releaseYear: 2024 },
    { name: "Acer Nitro 5", price: 1100, brand: "Acer", quantity: 140, discount: 12, available: true, rating: 4.3, releaseYear: 2023 },
    { name: "ASUS ROG Zephyrus G", price: 2000, brand: "ASUS", quantity: 70, discount: 5, available: true, rating: 4.8, releaseYear: 2024 },
    { name: "MSI Modern 15", price: 900, brand: "MSI", quantity: 160, discount: 9, available: true, rating: 4.2, releaseYear: 2023 },
    { name: "Intel NUC 13 Pro", price: 800, brand: "Intel", quantity: 60, discount: 4, available: true, rating: 4.1, releaseYear: 2023 }
]);

// ========== CLOCK ==========
db.clock.insertMany([
    { name: "Apple Watch Series 9", price: 399, brand: "Apple", quantity: 500, discount: 5, available: true, rating: 4.7, releaseYear: 2023 },
    { name: "Galaxy Watch 7", price: 349, brand: "Samsung", quantity: 420, discount: 7, available: true, rating: 4.5, releaseYear: 2024 },
    { name: "Garmin Fenix 7", price: 699, brand: "Garmin", quantity: 110, discount: 6, available: true, rating: 4.8, releaseYear: 2022 },
    { name: "Casio G-Shock GA-2100", price: 129, brand: "Casio", quantity: 800, discount: 12, available: true, rating: 4.4, releaseYear: 2021 },
    { name: "Seiko 5 Sports", price: 250, brand: "Seiko", quantity: 300, discount: 8, available: true, rating: 4.6, releaseYear: 2020 },
    { name: "Tissot PRX", price: 375, brand: "Tissot", quantity: 200, discount: 5, available: true, rating: 4.6, releaseYear: 2021 },
    { name: "Amazfit GTR 4", price: 199, brand: "Amazfit", quantity: 450, discount: 10, available: true, rating: 4.3, releaseYear: 2022 },
    { name: "Huawei Watch GT 4", price: 299, brand: "Huawei", quantity: 260, discount: 9, available: true, rating: 4.2, releaseYear: 2023 }
]);

// ========== ACCESSORY ==========
db.accessory.insertMany([
    { name: "Anker 65W GaN Charger", price: 49, brand: "Anker", quantity: 700, discount: 10, available: true, rating: 4.6, releaseYear: 2023 },
    { name: "Baseus 20,000mAh Power Bank", price: 39, brand: "Baseus", quantity: 650, discount: 12, available: true, rating: 4.5, releaseYear: 2023 },
    { name: "Ugreen USB-C Hub 6-in-1", price: 45, brand: "Ugreen", quantity: 400, discount: 8, available: true, rating: 4.4, releaseYear: 2022 },
    { name: "Logitech MX Master 3S", price: 99, brand: "Logitech", quantity: 180, discount: 5, available: true, rating: 4.8, releaseYear: 2022 },
    { name: "Sony WH-CH520", price: 59, brand: "Sony", quantity: 220, discount: 7, available: true, rating: 4.3, releaseYear: 2023 },
    { name: "JBL Tune 230NC TWS", price: 79, brand: "JBL", quantity: 240, discount: 9, available: true, rating: 4.4, releaseYear: 2022 },
    { name: "Spigen MagSafe Case 15", price: 35, brand: "Spigen", quantity: 500, discount: 15, available: true, rating: 4.2, releaseYear: 2023 },
    { name: "Sandisk Ultra 128GB", price: 18, brand: "SanDisk", quantity: 900, discount: 11, available: true, rating: 4.6, releaseYear: 2021 }
]);

//4.find all document
use("electronicsdb")
db.phone.find()
use("electronicsdb")
db.computer.find()
db.clock.find()
db.accessory.find()

//5.query operator
//5.1.lấy phone có price <100, 100-1000, 1000-5000, >5000
use("electronicsdb")
db.phone.find({
    price: { $lt: 100 }
})

use("electronicsdb")
db.phone.find({
    price: { $gte: 100, $lt: 1000 }
})

use("electronicsdb")
db.phone.find({
    price: { $gte: 1000, $lt: 5000 }
})

use("electronicsdb")
db.phone.find({
    price: { $gte: 5000 }
})
//5.2.lấy computer có discount>10
use("electronicsdb")
db.computer.find({
    discount: { $gt: 10 }
})
//5.3 Top 5 điện thoại rẻ nhất (sort + limit)
use("electronicsdb")
//tìm và hiển thị chỉ lấy name, price
db.phone.find({}, {
    _id: 0, name: 1, price: 1
})
    //sắp xếp giá tăng dần
    .sort({ price: 1 })
    //giới hạn 5 dòng đâu tiên
    .limit(5)
//5.4 Máy tính quantity từ 100 đến 500 (kẹp khoảng)
use("electronicsdb")
db.computer.find({
    quantity: { $gte: 100, $lte: 500 }
})
    //sắp xếp số lượng giảm dần
    .sort({ quantity: -1 })
//5.5 Đồng hồ mới (releaseYear ≥ 2023) và rating ≥ 4.5
use("electronicsdb")
db.clock.find({
    releaseYear: { $gte: 2023 },
    rating: { $gte: 4.5 }
},
    {
        _id: 0, name: 1, releaseYear: 1, rating: 1
    })
//5.6 Gắn nhãn budget: true cho sản phẩm giá < 300 (updateMany + $set)
//5.7 Xoá máy tính quá rẻ (price < 1000)
//5.8 Tính giá mua 5 chiếc iPhone (price × 5) rồi hiển thị
//5.9 Tính giá sau giảm = price * (1 - discount/100) rồi lọc < 500
//5.10 Upsert: nếu chưa có “Nokia C32” thì thêm; nếu có thì cộng quantity +50
//6.logic operator
//6.1.lấy sp price >1000, thuộc nhóm computer
//6.2.lấy sp thuộc collection "phone", không phải Iphone
//6.3.lấy sp có price >1500, quantity >1000, discount>12
//6.4 Điện thoại (Apple hoặc Samsung) và giá 500–1500 ($or + kẹp khoảng)
//6.5 Phụ kiện không phải các hãng trong danh sách ($nin)
//6.6 Dùng $nor: điện thoại không phải Apple và cũng không phải Samsung//6.7 Lọc theo điều kiện tính toán: tổng giá trị tồn kho > 100,000 (price × quantity) — dùng $expr
//6.7 Lọc theo điều kiện tính toán: tổng giá trị tồn kho > 100,000 (price × quantity) — dùng $expr
//6.8 Cập nhật có điều kiện logic: gắn hotDeal: true nếu (brand ∈ {Samsung, Apple}) và discount ≥ 10
//6.9 Xoá (deleteMany) điện thoại hết hàng hoặc không còn bán (quantity = 0 hoặc available = false)
//6.10 Tổng giá trị hàng Samsung trong toàn cửa hàng (gộp 4 collection) = SUM(price × quantity)
//6.11 Pipeline update nâng cao: tính và lưu trường inventoryValue = price * quantity cho computer
//6.12 Distinct + điều kiện logic: liệt kê hãng điện thoại có available = true và rating ≥ 4.5
//
