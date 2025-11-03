use("demodb04")
db.createCollection("products")

use("demodb04")
db.students.insertMany([
  { name: "John Doe", age: 20, courses: ["Math", "Physics", "Chemistry"] },
  { name: "Jane Smith", age: 22, courses: ["Biology", "Chemistry"] },
  { name: "Alice Johnson", age: 19, courses: ["Math", "Computer Science"] },
  { name: "Michael Brown", age: 23, courses: ["History", "Physics", "Math"] },
  { name: "Emily Davis", age: 21, courses: ["Math", "Biology", "Physics"] },
  { name: "Chris Wilson", age: 24, courses: ["Chemistry", "Biology"] },
  { name: "Sarah Lee", age: 18, courses: ["Computer Science", "Math", "Art"] },
  { name: "David Miller", age: 25, courses: ["Biology", "Math"] },
  { name: "Jessica Taylor", age: 20, courses: ["Math", "Physics", "Art"] },
  { name: "Daniel Anderson", age: 22, courses: ["Computer Science", "Math", "Physics"] }
])

/*
Câu 3: Sử dụng Aggregate Pipeline để Lọc và Sắp xếp
Sử dụng aggregate pipeline để tìm tất cả sinh viên thỏa mãn 
các điều kiện sau trong collection students:
Tuổi từ 18 đến 25.
Đăng ký ít nhất một khóa học trong danh sách: "Math", "Biology".
Kết quả phải sắp xếp theo tên sinh viên (tăng dần) và chỉ hiển thị các trường name và courses.

Câu 4: Sử dụng Aggregate Pipeline - Lọc và Nhóm (Nâng cao)
Sử dụng aggregate pipeline để thực hiện các thao tác sau:
Lọc các sinh viên đăng ký nhiều hơn 2 khóa học.
Tính tổng số sinh viên theo từng độ tuổi.
Sắp xếp kết quả theo tổng số sinh viên (giảm dần).

Câu 5: Sử dụng Aggregate Pipeline với $merge
Hãy viết một pipeline sử dụng $merge để nhóm các sinh viên theo số lượng khóa học họ tham gia và lưu kết quả
 vào một collection mới tên là student_course_counts.
 Mỗi tài liệu trong collection mới sẽ chứa tên sinh viên và số lượng khóa học họ đã đăng ký.
->find kết quả collection student_course_counts.
 */
/*🧩 Câu 3: Lọc và Sắp xếp
✅ Yêu cầu:
Tuổi từ 18 đến 25
Có ít nhất 1 khóa học thuộc "Math" hoặc "Biology"
Sắp xếp theo tên (tăng dần)
Chỉ hiển thị name và courses */
use("demodb04")

db.students.aggregate([
  {
    $match: {
      age: { $gte: 18, $lte: 25 },             // điều kiện tuổi
      courses: { $in: ["Math", "Biology"] }    // chứa ít nhất 1 trong 2 khóa
    }
  },
  {
    $project: { _id: 0, name: 1, courses: 1 }  // chỉ hiển thị name và courses
  },
  {
    $sort: { name: 1 }                         // sắp xếp theo tên (tăng dần)
  }
])
/*🧩 Câu 4: Lọc và Nhóm (Nâng cao)
✅ Yêu cầu:
Lọc sinh viên có nhiều hơn 2 khóa học
Nhóm theo độ tuổi (age)
Tính tổng số sinh viên mỗi độ tuổi
Sắp xếp giảm dần theo tổng số sinh viên*/
use("demodb04")
db.students.aggregate([
  {
    $match: {
      $expr: { $gt: [ { $size: "$courses" }, 2 ] } // số lượng khóa học > 2
    }
  },
  {
    $group: {
      _id: "$age",                      // nhóm theo độ tuổi
      totalStudents: { $sum: 1 }        // đếm số sinh viên mỗi nhóm
    }
  },
  {
    $sort: { totalStudents: -1 }        // sắp xếp giảm dần theo tổng SV
  }
])

/*🧩 Câu 5: Sử dụng $merge
✅ Yêu cầu:
Nhóm các sinh viên theo số lượng khóa học họ tham gia
Lưu vào collection mới tên là student_course_counts
Mỗi tài liệu gồm name và courseCount
Sau đó find kết quả trong collection mới */
use("demodb04")
db.students.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      courseCount: { $size: "$courses" }  // đếm số lượng khóa học
    }
  },
  {
    $merge: "student_course_counts"       // lưu sang collection mới
  }
])

// xem kết quả
db.student_course_counts.find()
