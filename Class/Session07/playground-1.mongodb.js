//mongodb://rootAdmin:root123@localhost:27017/admin
use("admin")
show("users")

use("shopDB")
db.orders.insertMany([
    {
        _id: 1,
        customer: "Alice",
        status: "completed",
        items: [
            { product: "Laptop", qty: 1, price: 1500 },
            { product: "Mouse", qty: 2, price: 25 }
        ],
        orderDate: ISODate("2025-10-01T10:00:00Z"),
        tags: ["electronics", "vip"]
    },
    {
        _id: 2,
        customer: "Bob",
        status: "pending",
        items: [
            { product: "Tablet", qty: 1, price: 600 },
            { product: "Keyboard", qty: 1, price: 100 }
        ],
        orderDate: ISODate("2025-10-05T15:00:00Z"),
        tags: ["office"]
    },
    {
        _id: 3,
        customer: "Charlie",
        status: "completed",
        items: [
            { product: "Phone", qty: 3, price: 800 },
            { product: "Case", qty: 3, price: 20 }
        ],
        orderDate: ISODate("2025-10-07T09:00:00Z"),
        tags: ["electronics"]
    }
])

use("shopDB")
db.orders.find()

//1 Tao user
//1.1 user co quyen read
use("shopDB")
db.createUser({
    user: "reader",
    pwd: "reader123",
    roles: [{ role: "read", db: "shopDB" }]
})

//1.2 user co quyen read write
use("shopDB")
db.createUser({
    user: "writer",
    pwd: "writer123",
    roles: [{ role: "readWrite", db: "shopDB" }]
})

use("shopDB")
show("users")

use("shopDB")
db.auth("reader", "reader123")

use("shopDB")
db.orders.find()

use("shopDB")
db.auth("writer", "writer123")
db.orders.insertOne({
    _id: 6,
    customer: "Patrik",
    status: "veryfied",
    items: [
        { product: "Laptop", qty: 1, price: 1500 },
        { product: "Mouse", qty: 2, price: 25 }
    ],
    orderDate: ISODate("2025-10-01T10:00:00Z"),
    tags: ["electronics", "vip"]
})
//Nếu muốn tạo thêm user
//thì phải login lại với admin
//sau đó use tới db muôn tạo
//rồi tạo user bình thường như bên dưới
use("admin")
db.auth("rootAdmin", "root123")
use("shopDB")
db.createUser({
    user: "ownerUser",
    pwd: "owner123",
    roles: [{ role: "dbOwner", db: "shopDB" }]
})
//tạo xong thì login với user vừa tạo
//để check quyền của user đó 
//như code bên dưới
//Nếu sử dụng vscode thì nhớ chạy 3 câu lệnh
//Thứ 1. là muốn thao tác trên db nào
//thứ 2 là user đang login
//thứ 3 là những câu lệnh muốn chạy
use("shopDB")
db.auth("ownerUser", "owner123")
show("users")
//3. Tao index- compound index
use("shopDB")
db.orders.createIndex({ status: 1, customer: 1 })
//4. Aggregation-Tính tổng doanh thu theo khách hàng
use("shopDB")
db.orders.aggregate([
    {
        $unwind: "$items"
    },
    {
        $group: {
            _id: "$customer",
            totalRevenue: {
                $sum: { $multiply: ["$items.qty", "$items.price"] }
            },
            orderCount: { $sum: 1 }
        }
    },
    {
        $sort: {
            totalRevenue: -1
        }
    }
])
