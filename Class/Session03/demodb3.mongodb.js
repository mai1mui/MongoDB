use("demodb3")
db.createCollection("products")

use("demodb3")
db.products.insertMany(
    [
  { "product": "Book", "category": "Stationery",
     "price": 10, "quantity": 5 },
  { "product": "Pen", "category": "Stationery",
     "price": 3, "quantity": 20 },
  { "product": "Bag", "category": "Accessories",
     "price": 25, "quantity": 3 },
  { "product": "Pencil", "category": "Stationery",
     "price": 2, "quantity": 15 },
  { "product": "Watch", "category": "Accessories",
     "price": 50, "quantity": 2 }
]
)

//1.match==find: lọc tài liệu theo 1 dk nào đó
use("demodb3")
db.products.aggregate([
    {$match: {
      category:"Stationery"
    }}
])

//2.group: nhóm tài liệu, thường dùng cho thống kê
//tính tổng doanh thu theo từng loại sp
use("demodb3")
db.products.aggregate([
    {$group: {
      _id: "$category",
      totalSale: {
        $sum:{$multiply:["$price","$quantity"]}
      }
    }}
])

//3.$project: chọn và chỉ định trường cần hiển thị
use("demodb3")
db.products.aggregate([
    {$project: {
      _id:0,
      product:1,
      total:{$multiply:["$price","$quantity"]}
    }}
])

//4.$sort: sắp xếp tăng/giảm dần
use("demodb3")
db.products.aggregate([
    {$sort: {
      price:-1
    }}
])

//5.limit : giới hạn sô lưuọng tài liệu đầu
use("demodb3")
db.products.aggregate([
  { $limit: 3 }
])

//6.$skip: bỏ qua 1 số lưuọng tài liệu đầu
//bỏ qua 2 sản phẩm đầu tiên
use("demodb3")
db.products.aggregate([
    {$skip: 2}
])

//7.addFields: thêm trường
use("demodb3")
db.products.aggregate([
    {$addFields: {
      total:{
        $multiply:["$price","$quantity"]
      }
    }}
])

//8.merge
use("demodb3")
db.products.aggregate([
    {
        $group: {
          _id: "category",
          totalSale: {
            $sum:{$multiply:["$price","$quantity"]}
          }
        }
    },
    {
        $merge: "summary"
    }
])
db.summary.find()

use("demodb3")
db.products.aggregate([
    {$project: {
      product:1,
      total:{$multiply:["$price","$quantity"]}

    }},
    {$out:"saleReport"}
])
use("demodb3")
db.saleReport.find()

//2. $match-> $project -> $sort -> $limit
//2.1.lấy sp rẻ nhất thuộc nhóm Stationary
use("demodb3")
db.products.aggregate([
  { $match: { category: "Stationery" } },  // lọc nhóm Stationery
  { $sort: { price: 1 } },                 // sắp xếp tăng dần theo price
  { $limit: 1 }                            // chỉ lấy 1 sản phẩm đầu rẻ nhất
])

//2.2.tính trung bình giá mỗi nhóm sp và sắp xếp tăng dần
use("demodb3")
db.products.aggregate([
  {
    //nhóm theo category
    $group: {
      _id: "$category",
      avgPrice: { $avg: "$price" }     // tính trung bình giá từng nhóm
    }
  },
  { $sort: { avgPrice: 1 } }            // sắp xếp tăng dần theo giá TB
])

//2.3.tính tổng sp , sắp xếp theo tổng doanh thu giảm dần
use("demodb3")
db.products.aggregate([
  {
    $group: {
      _id: "$category",
      totalSale: { $sum: { $multiply: ["$price", "$quantity"] } }, // doanh thu: $mul lấy price * quantity, sau đó tính sum tất cả sp trong nhóm
      totalQty: { $sum: "$quantity" }                              // tổng số lượng
    }
  },
  { $sort: { totalSale: -1 } } // sắp xếp giảm dần theo doanh thu
])

//2.4.bỏ quua sp cao nhất, lấy 2 sp tiếp theo, lấy 1 số field cụ thể (product,total)
use("demodb3")
db.products.aggregate([
  { $sort: { price: -1 } },              // sắp xếp giảm dần theo giá
  { $skip: 1 },                          // bỏ qua sản phẩm cao nhất
  { $limit: 2 },                         // lấy 2 sản phẩm tiếp theo
  {
    $project: {
      _id: 0,
      product: 1,
      total: { $multiply: ["$price", "$quantity"] } // chỉ hiển thị product + total
    }
  }
])
/*2.3 + 2.4: Hãy tính tổng doanh thu của từng nhóm sản phẩm, sắp xếp theo tổng doanh thu giảm dần.
Sau đó, bỏ qua nhóm doanh thu cao nhất và chỉ lấy 2 nhóm tiếp theo,
đồng thời chỉ hiển thị các trường _id (tên nhóm) và totalSale.*/
use("demodb3")
db.products.aggregate([
  {
    //Tính tổng doanh thu (price × quantity) cho từng nhóm category
    $group: {
      _id: "$category",
      totalSale: { $sum: { $multiply: ["$price", "$quantity"] } }
    }
  },
  { $sort: { totalSale: -1 } },  // sắp xếp giảm dần theo tổng doanh thu
  { $skip: 1 },                  // bỏ qua nhóm doanh thu cao nhất
  { $limit: 2 },                 // lấy 2 nhóm tiếp theo
  {
    $project: {
      _id: 1,        // hiển thị tên nhóm
      totalSale: 1   // hiển thị tổng doanh thu
    }
  }
])
//2.5.nhiều stage
//a.lọc acessories
//b.tính tổng
//c.thêm trường discountTotal: 205
//d.chỉ giữ lại sp total>10
//e.sắp xếp giảm dần theo discountTotal
db.products.aggregate([
  // a. Lọc nhóm Accessories
  { $match: { category: "Accessories" } },

  // b. Tính tổng (thêm trường total)
  {
    $addFields: {
      total: { $multiply: ["$price", "$quantity"] }
    }
  },

  // c. Thêm trường discountTotal = 205
  {
    $addFields: {
      discountTotal: 205
    }
  },

  // d. Giữ lại sản phẩm có total > 10
  {
    $match: { total: { $gt: 10 } }
  },

  // e. Sắp xếp giảm dần theo discountTotal
  {
    $sort: { discountTotal: -1 }
  }
])
