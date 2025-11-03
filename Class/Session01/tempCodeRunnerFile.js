se("period1DB")
db.createCollection("students")
db.createCollection("teachers")
//Show collections
show("collections")
//Insert document
db.students.insertOne({ name: "John", age: 21, city: "New York" })
db.teachers.insertOne({ name: "Mr. Smith", subject: "Mathematics", yearsOfExperience: 5 })