use("bookstoredb")
db.createCollection("book")
use("bookstoredb")
db.createCollection("author")

//insert many document
use("bookstoredb")
db.book.insertMany([
    {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J. K. Rowling",
    category: "Fantasy",
    price: 12.99,
    discount: 10,
    tags: ["magic", "school", "YA"],
  },
  {
    title: "A Game of Thrones",
    author: "R. Martin",
    category: "Fantasy",
    price: 15.5,
    discount: 0,
    tags: ["epic", "politics", "dragons"],
  },
  {
    title: "Norwegian Wood",
    author: "Haruki Murakami", 
    category: "Literary",
    price: 11.2,
    discount: 5,
    tags: ["romance", "youth"],
  },
  {
    title: "Mắt Biếc",
    author: "Nguyễn Nhật Ánh",
    category: "Young Adult",
    price: 5.9,
    discount: 15,
    tags: ["emotional", "youth"],
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari", 
    category: "Non-fiction",
    price: 18.0,
    discount: 0,
    tags: ["history", "anthropology", "science"],
  }
])

use("bookstoredb")
db.author.insertMany([
    {
    name: "J. K. Rowling",
    country: "UK",
    birthYear: 1965,
    genres: ["Fantasy", "Young Adult"]
  },
  {
    name: "George R. R. Martin",
    country: "USA",
    birthYear: 1948,
    genres: ["Fantasy", "Epic"]
  },
  {
    name: "Haruki Murakami",
    country: "Japan",
    birthYear: 1949,
    genres: ["Literary", "Magical Realism"]
  },
  {
    name: "Nguyễn Nhật Ánh",
    country: "Vietnam",
    birthYear: 1955,
    genres: ["Young Adult", "Slice of Life"]
  },
  {
    name: "Yuval Noah Harari",
    country: "Israel",
    birthYear: 1976,
    genres: ["Non-fiction", "History"]
  }
])

//find all document
use("bookstoredb")
db.book.find()
use("bookstoredb")
db.author.find()

//1.match
//1.1lọc sách co price<12
//cách 1: sử dụng find như bình thường
use("bookstoredb")
db.book.find({
    price:{$lt:12}
})
//cách 2: sử dụng match
use("bookstoredb")
db.book.aggregate([
    {$match:{price:{$lt:12}}}
])
//1.2.lọc sách tag youth có discount>0
use("bookstoredb")
db.book.aggregate([
    {$match:{
        tags:"youth",
        discount:{$gt:0}
    }}
])
//1.3.lọc sách Fantasy có 10 <= price <=16 
use("bookstoredb")
db.book.aggregate([
    {$match:{
        category:"Fantasy",
        price:{$gte:10,$lte:16}
    }}
])
//1.4.lọc author đến từ châu Á (japan,vietnam)
use("bookstoredb")
db.author.aggregate([
    {$match: {
      country:{$in:["Japan","Vietnam"]}
    }}
])
//2.group
//2.1 
//3.project
//4.sort
//5.limit
//6.skip
//7.addFileds
//8.merge
//9.kết hợp: match -> project -> sort -> limit
//10.Kết hợp: filter -> operator -> update -> sort -> limit