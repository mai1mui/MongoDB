use("demodb2")
db.createCollection("products")

db.products.insertMany(
    [
        { name: "Laptop", price: 1500,brand: "Dell", stock: 30,
              tags: ["electronics", "computer"],discount: 10 },
        { name: "Phone", price: 800, brand: "Apple", stock: 50,
             tags: ["electronics", "mobile"], discount: 5 },
        { name: "TV", price: 1200, brand: "Sony", stock: 15,
             tags: ["electronics", "home"], discount: 15 },
        { name: "Shoes", price: 120, brand: "Nike", stock: 80,
             tags: ["fashion", "sport"], discount: 20 },
        { name: "Watch", price: 300, brand: "Casio", stock: 0,
             tags: ["fashion", "accessory","sport"], discount: 0 }
    ]
)

use("demodb2")
db.products.find()

//1.lấy các sp có price>1000
use("demodb2")
db.products.find({price:{$gt:1000}})
//2.lấy sp có price từ 500-1000
use("demodb2")
db.products.find({price:{$gte:500,$lte:1000}})
//3.lấy sp có discount=0
use("demodb2")
db.products.find({discount:{$eq:0}})
//4.lấy sp trong ds với brand là Apple và Dell
use("demodb2")
db.products.find({brand:{$in:["Apple","Dell"]}})
//5.lấy sp có discount =0,5,10
//6.tìm sp có tag fashion, mobile
use("demodb2")
db.products.find({tags:{$in:["fashion","mobile"]}})
//7.lấy sp không thuộc nhóm electronics
