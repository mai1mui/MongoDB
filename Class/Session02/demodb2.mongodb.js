//chọn hoặc tạo DB: nếu chưa tồn tại , mongo sẽ tạo mới khi thêm dữ liệu đầu tiên
use("demodb2")

//tạo 1 collection(bảng dữ liệu) tên products

db.createCollection("products")

//thêm dữ liệu
use("demodb2")
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
/*
insertMany([...]): thêm nhiều document cùng lúc
mỗi {...} là 1 document tương tự record trong sql
Các field như name, price, brand, stock, tags, discount là các key-value pair.
*/

//truy vấn cơ bản
use("demodb2")
db.products.find()
/*find()-> lấy all document trong collection */

//1. Query operator
//1.1 Lấy các sp có price >1000$
use("demodb2")
db.products.find({price:{$gt:1000}})
/*
$gt (greater than): lớn hơn
syntax: {field:{$operator:value}}
 */

//1.2 Sp co price tu 500-1500
use("demodb2")
db.products.find({price:{$gte:500,$lte:1500}})
/*
$gte: lớn hơn or =
$lte: nhỏ hơn or =
Cả hai điều kiện gộp chung trên cùng một field→ MongoDB hiểu là AND giữa $gte và $lte.
 */

//1.3 Lay sp co discount =0
use("demodb2")
db.products.find({discount:{$eq:0}})
/*$eq: equal to → bằng */

//1.4 Lay san pham nam trong danh sach voi brand la Apple va Dell
use("demodb2")
db.products.find({brand:{$in:["Apple","Dell"]}})
/*$in: giá trị nằm trong danh sách */

//1.5 lay cac san pham giam gia thuoc cac gia tri 0, 5,10
use("demodb2")
db.products.find({discount:{$in:[0,5,10]}})

//1.5 Tim cac san pham ma co tag :fashion, mobile
use("demodb2")
db.products.find({tags:{$in:["mobile","fashion"]}})
/*
$in cũng hoạt động được với mảng
→ Nếu mảng tags có chứa bất kỳ phần tử nào trong danh sách → thỏa điều kiện.
*/

//2. Logic Operator
//2.1 Lay cac san pham <500 hoac thuoc nhom fashion
use("demodb2")
db.products.find({
     $or:[
          {price:{$lt:500}}
          ,{tags:"fashion"}
     ]})
/*
$or: mảng chứa nhiều điều kiện → chỉ cần 1 điều kiện đúng.
$lt: nhỏ hơn.
*/

//2.2 Lay cac sp co tag khong thuoc nhom electronics
use("demodb2")
// xay ra loi vì $not không thuôc top level 
db.products.find({
     $not:{tags:"electronics"}
})
/*
$not chỉ áp dụng cho 1 field cụ thể.
→ Chọn những document mà tags không chứa giá trị "electronics".
 */
//cach khác 1
//not chi kiem tra cho 1 field cụ thể
use("demodb2")
db.products.find({
     tags:{
          $not:{$eq:"electronics"}}
     })
//cach khac 2
//nor co the kiem tra cho nhieu field
use("demodb2")
db.products.find({
     $nor:[{tags:"electronics"}]
})
//2.3 lay cac sp vua stock > 0 va discount > 0
use("demodb2")
db.products.find({
     $and:[{stock:{$gt:0} },{discount:{$gt:0}}]
})
//3. Element Operator
//3.1 San pham co truong discount
use("demodb2")
db.products.find({discount:{$exists:true}})
//3.2 Price co phai la kieu number hay khong
use("demodb2")
db.products.find({price:{$type:"number"}})

//4 Array operator
//4.1. lay tat ca cac san pham co cả 2 tag cụ thể
use("demodb2")
db.products.find({tags:{$all:["fashion","sport"]}})
//4.2 Tim san pham chua tag sport
use("demodb2")
db.products.find({tags:{$elemMatch:{$eq:"sport"}}})
//5 project operator
use("demodb2")
db.products.find({},{name:1,price:1,_id:0})
//5 update operator
use("demodb2")
db.products.find()
//5.1 $inc tang stock cua Dell
use("demodb2")
db.products.updateOne({brand:"Dell"},{$inc:{stock:50}})
//5.2 push thêm tag vào document có name :watch
use("demodb2")
db.products.updateOne({name:"Watch"},{$push:{tags:"new"}})
//5.3 unset->Xoa field
use("demodb2")
db.products.updateOne({name:"Watch"},{$unset:{stock:""}})
//5.4 rename-> thay doi ten truong
use("demodb2")
db.products.updateOne({name:"Watch"},{$rename:{"brand":"thuonghieu"}})
//5.5 Xoa phan tu cuoi mang
use("demodb2")
db.products.updateOne({name:"Watch"},{$pop:{tags:1}})
//5.6 xoa phan tu bat ky
use("demodb2")
db.products.updateOne({name:"Watch"},{$pull:{tags:"accessory"}})

