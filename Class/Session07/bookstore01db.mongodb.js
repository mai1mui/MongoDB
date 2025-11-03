/*quản lý cơ sở dữ liệu bookstoreDB gồm hai collection:
authors: thông tin tác giả
books: thông tin sách, mỗi sách có trường authorId liên kết đến _id của authors.
Cấu trúc dữ liệu mẫu
authors

{ _id, name, country }

books
{ title, authorId, price, sold }*/

use("bookstore01Db")
db.createCollection("authors")
db.createCollection("books")

use("bookstore01Db")
db.authors.insertMany([
  { _id: 1, name: "Nguyen Nhat Anh", country: "Vietnam" },
  { _id: 2, name: "Haruki Murakami", country: "Japan" },
  { _id: 3, name: "J.K. Rowling", country: "UK" }
])
use("bookstore01Db")
db.books.insertMany([
  { title: "Cho tôi xin một vé đi tuổi thơ", authorId: 1, price: 8.5, sold: 20000 },
  { title: "Mắt biếc", authorId: 1, price: 7.2, sold: 18000 },
  { title: "Kafka on the Shore", authorId: 2, price: 12, sold: 25000 },
  { title: "Norwegian Wood", authorId: 2, price: 10, sold: 30000 },
  { title: "Harry Potter 1", authorId: 3, price: 15, sold: 50000 },
  { title: "Harry Potter 2", authorId: 3, price: 17, sold: 48000 }
])

use("bookstore01Db")
db.books.find()
/*Câu 1 — Phân quyền
Tạo hai người dùng:
readUser: chỉ có quyền đọc dữ liệu trong bookstoreDB*/
use("bookstore01Db")
db.createUser(
  {
    user: "readUser",
    pwd: "read123",
    roles: [{ role: "read", db: "bookstore01Db" }]
  }
)
/*writeUser: có quyền đọc và ghi dữ liệu trong bookstoreDB*/
use("bookstore01Db")
db.createUser(
  {
    user: "writeUser",
    pwd: "write123",
    roles: [{ role: "readWrite", db: "bookstore01db" }]
  }
)
/*Câu 2 — Transaction + Rollback : 
mongod --port 27018 --dbpath ""D:\APTECH\13MongoDB\Class\Session07"" --replSet rs0 --bind_ip localhost
Tạo một transaction gồm 2 thao tác:
Thêm 1 quyển sách mới vào books
Cập nhật tổng số sách của tác giả tương ứng trong authors
Nếu 1 thao tác thất bại → rollback toàn bộ transaction.*/
use("bookstore01Db")
//2.1.start session
session = db.getMongo().startSession();
//2.2.choice database
bsdb = session.getDatabase("bookstore01Db");
//2.3.start transaction
session.startTransaction();
try {
  //2.3.1.thêm 1 quyển sách mới vào books
  bsdb.books.insertOne({
    title: "Harry Potter 3",
    authorId: 3,
    price: 18,
    sold: 37000
  })
  //2.3.2.cập nhật tổng số sách của tác giả tương ứng trong authors
  const up=bsdb.authors.updateOne(
    {_id:3},
    {$inc:{bookCount:1}}
  );
  if(up.matchedCount!==1)
    throw new Error("Author not found -> rollback");
  //2.3.3.gửi thông báo
  bsdb.Notification.insertOne({
    message: "New book added",
    read: false
  })
  //2.3.4.commit transaction xác nhận thay đổi
  session.commitTransaction();
  print("Transaction commit successfully")
} catch (error) {
  //2.3.5.rollback nếu lỗi
  session.abortTransaction();
  print("Transaction rollback: " + error)
} finally {
  //2.3.6.kết thúc session
  session.endSession();
}
//Câu 3 — Aggregation 1 (Sử dụng $lookup): Hiển thị danh sách sách kèm tên tác giả tương ứng.
use("bookstore01Db")
db.books.aggregate([
  {
    $lookup: {
      from: "authors",
      localField: "authorId",
      foreignField: "_id",
      as: "author"
    }
  },
  { $unwind: "$author" },
  {
    $project: {
      _id: 0,
      title: 1,
      price: 1,
      sold: 1,
      authorName: "$author.name",
      authorCountry: "$author.country"
    }
  }
])
//Câu 4 — Aggregation 2: Tính tổng doanh thu (price × sold) của từng tác giả.
use("bookstore01Db")
db.books.aggregate([
  //tính tổng doanh thu theo từng tác giả
  {
    $group: {
      _id: "$authorId",
      totalRevenue: {
        $sum: { $multiply: ["$price", "$sold"] }
      },
      totalBooks: { $sum: 1 }
    }
  },
  //join để lấy tên tác giả
  {
    $lookup: {
      from: "authors",
      localField: "_id",
      foreignField: "_id",
      as: "author"
    }
  },
  { $unwind: "$author" },
  {
    $project: {
      _id: 1,
      authorId: "$_id",
      authorName: "$author.name",
      totalBooks: 1,
      totalRevenue: 1
    }
  }
])
//Câu 5 — Aggregation 3: Liệt kê các quyển sách có số lượng bán > 25.000 và kèm theo tên tác giả.
use("bookstore01Db")
db.books.aggregate([
  {
    $match: {
      sold: { $gt: 25000 }
    }
  },
  {
    $lookup: {
      from: "authors",
      localField: "authorId",
      foreignField: "_id",
      as: "author"
    }
  },
  { $unwind: "$author" },
  {
    $project: {
      _id: 0,
      title: 1,
      sold: 1,
      authorName: "$author.name"
    }
  }
])
/*Câu 6 — Index
Tạo index đơn trên trường authorId.
Tạo compound index trên (price, sold).
Kiểm tra hiệu quả truy vấn bằng explain().*/
use("bookstore01Db")
// tạo Index đơn trên authorId
db.books.createIndex({ authorId: 1 })
// Compound index (price, sold)
db.books.createIndex({ price: 1, sold: -1 })
//Kiểm tra hiệu quả bằng explain("executionStats")
//Truy vấn dùng index authorId:
db.books.find({ authorId: 2 }).explain("executionStats")
//Truy vấn lợi thế compound index: lọc theo price và sort theo sold cùng chiều như index (prefix rule)
db.books.find({ price: { $gte: 10 } })
  .sort({ sold: -1 })
  .explain("executionStats")


//Câu 7 — Aggregation nâng cao: 
//Tính giá trung bình của sách từng tác giả, và chỉ hiển thị các tác giả có giá trung bình > 10.
use("bookstore01Db")
db.books.aggregate([
  //tính giá trung bình sách của từng tác giả
  {$group: {
    _id: "$authorId",
    avgPrice: {
      $avg:"$price"
    },
    countBooks:{$sum:1}
  }},
  //join để lấy thông tin tác giả
  {$lookup: {
    from: "authors",
    localField: "_id",
    foreignField: "_id",
    as: "author"
  }},
  {$unwind: "$author"},
  {$project: {
    _id:0,
    authorId:"$_id",
    authorName:"$author.name",
    avgPrice:{$round:["$avgPrice",2]},
    countBooks:1
  }},
  
  //sắp xếp lấy giá trung bình >10
  {$match: {
    avgPrice:{$gt:10},
  }},
  {$sort: {
    avgPrice:-1
  }}
])
//gợi ý: nên $match avgPrice>10 lên trước, để khỏi phải join các mục avgPrice<10
use("bookstore01db")
db.books.aggregate([
  { $group: {
      _id: "$authorId",
      avgPrice: { $avg: "$price" },
      countBooks: { $sum: 1 }
  }},
  { $match: { avgPrice: { $gt: 10 } } },  // lọc sớm
  { $lookup: {
      from: "authors",
      localField: "_id",
      foreignField: "_id",
      as: "author"
  }},
  { $unwind: "$author" },
  { $project: {
      _id: 0,
      authorId: "$_id",
      authorName: "$author.name",
      avgPrice: { $round: ["$avgPrice", 2] },
      countBooks: 1
  }},
  { $sort: { avgPrice: -1 } }
])

