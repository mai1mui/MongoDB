use("period1DB")
db.createCollection("students")
db.createCollection("teachers")
//Show collections
use("period1DB")
show("collections")
//Insert document (One)
use("period1DB")
db.students.insertOne(
    {
        name: "John",
        age: 21, city: "New York"
    })

use("period1DB")
db.teachers.insertOne(
    {
        name: "Mr. Smith",
        subject: "Mathematics",
        yearsOfExperience: 5
    })
//Insert document (Many)
use("period1DB")
db.students.insertMany([
    {
        name: "Alice",
        age: 22,
        city: "Los Angeles"
    },
    {
        name: "Bob",
        age: 23,
        city: "Chicago"
    }
])

use("period1DB")
db.teachers.insertMany([
    {
        name: "Ms. Johnson",
        subject: "English",
        yearsOfExperience: 3
    },
    {
        name: "Mr. Brown",
        subject: "History",
        yearsOfExperience: 4
    }
])
//Find document
use("period1DB")
db.students.find()
use("period1DB")
db.teachers.find()
//Update document(One)
use("period1DB")
db.students.updateOne(
    { name: "John" },
    {
        $set:
        {
            age: 22,
            city: "San Francisco"
        }
    })

use("period1DB")
db.teachers.updateOne(
    { name: "Mr. Smith" },
    {
        $set:
        {
            subject: "Physics",
            yearsOfExperience: 6,
            location: "San Francisco"
        }
    },
    {
        upsert: true
    }) //Nếu không tìm thấy thì sẽ tạo mới)
//Delete document(One)
use("period1DB")
db.students.deleteOne(
    {
        name: "Alice"
    })

use("period1DB")
db.teachers.deleteOne(
    {
        name: "Ms. Johnson"
    })
//Delete Many

use("period1DB")
db.students.deleteMany(
    {
        age: { $gt: 22 }
    }) //Xóa tất cả các document có age > 22

use("period1DB")
db.teachers.deleteMany(
    {
        yearsOfExperience: { $lt: 5 }
    }) //Xóa tất cả các document có yearsOfExperience < 5
//Update document(Many)
//drop collection
use("period1DB")
db.students.drop()
//Show databases
use("period1DB")
show("databases")
//Drop database
use("period1DB") // Trong JS phải có use() mới drop được
db.dropDatabase()