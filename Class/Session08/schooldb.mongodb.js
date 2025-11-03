// PHẦN 1. KHỞI TẠO DỮ LIỆU
use("schooldb");
// db.students.insertMany([
//   {
//     _id: 1,
//     name: "Alice",
//     class: "A1",
//     enrolledCourses: [101, 102], // id của courses
//     hobbies: ["reading", "gaming"]
//   },
//   {
//     _id: 2,
//     name: "Bob",
//     class: "A1",
//     enrolledCourses: [102, 103],
//     hobbies: ["football", "music"]
//   },
//   {
//     _id: 3,
//     name: "Charlie",
//     class: "A2",
//     enrolledCourses: [101],
//     hobbies: ["coding", "chess"]
//   }
// ]);

// db.courses.insertMany([
//   {
//     _id: 101,
//     name: "Database Systems",
//     teacherId: 501,
//     lessons: ["Intro to DB", "Normalization", "MongoDB Basics"]
//   },
//   {
//     _id: 102,
//     name: "Web Development",
//     teacherId: 502,
//     lessons: ["HTML", "CSS", "JavaScript"]
//   },
//   {
//     _id: 103,
//     name: "Data Structures",
//     teacherId: 501,
//     lessons: ["Array", "Linked List", "Tree"]
//   }
// ]);

// db.teachers.insertMany([
//   {
//     _id: 501,
//     name: "Mr. John",
//     department: "Computer Science",
//     skills: ["Database", "C++", "MongoDB"]
//   },
//   {
//     _id: 502,
//     name: "Ms. Emily",
//     department: "Software Engineering",
//     skills: ["Frontend", "React", "NodeJS"]
//   }
// ]);


// PHẦN 2. AGGREGATION
// ===================

// Câu 1: Liệt kê SV + danh sách tên khóa học
use("schooldb")
db.students.aggregate([
  {
    $lookup: {
      from: "courses",
      localField: "enrolledCourses",
      foreignField: "_id",
      as: "courseDocs"
    }
  },
  {
    $project: {
      _id: 0,
      StudentId: "$_id",
      StudentName: "$name",
      Class: "$class",
      CourseNames: {
        $map: {
          input: "$courseDocs",
          as: "c",
          in: "$$c.name"
        }
      }
    }
  }
]);

// Câu 2: Tổng số lessons mỗi giáo viên
use("schooldb")
db.courses.aggregate([
  {
    $project: {
      teacherId: 1,
      lessonsCount: { $size: "$lessons" }
    }
  },
  {
    $group: {
      _id: "$teacherId",
      totalLessons: { $sum: "$lessonsCount" }
    }
  },
  {
    $lookup: {
      from: "teachers",
      localField: "_id",
      foreignField: "_id",
      as: "teacher"
    }
  },
  { $unwind: "$teacher" },
  {
    $project: {
      _id: 0,
      teacherId: "$_id",
      teacherName: "$teacher.name",
      totalLessons: 1
    }
  }
]);

// (cách 2: bắt đầu từ Teachers)
use("schooldb")
db.teachers.aggregate([
  {
    $lookup: {
      from: "courses",
      localField: "_id",
      foreignField: "teacherId",
      as: "courses"
    }
  },
  {
    $project: {
      _id: 0,
      teacherId: "$_id",
      teacherName: "$name",
      totalLessons: {
        $sum: {
          $map: {
            input: "$courses",
            as: "c",
            in: { $size: "$$c.lessons" }
          }
        }
      }
    }
  }
]);

// PHẦN 3. VIEW
// ==============

// Câu 4: View student_course_summary
use("schooldb")
db.createView(
  "student_course_summary",
  "students",
  [
    {
      $lookup: {
        from: "courses",
        localField: "enrolledCourses",
        foreignField: "_id",
        as: "courseDocs"
      }
    },
    {
      $project: {
        _id: 0,
        studentId: "$_id",
        name: 1,
        class: 1,
        courseNames: {
          $map: {
            input: "$courseDocs",
            as: "c",
            in: "$$c.name"
          }
        }
      }
    }
  ]
);
// Kiểm tra
db.student_course_summary.find();

// Câu 5: View teacher_lesson_count
use("schooldb")

db.createView(
  "teacher_lesson_count",
  "courses",
  [
    {
      $project: {
        teacherId: 1,
        lessonsCount: { $size: "$lessons" }
      }
    },
    {
      $group: {
        _id: "$teacherId",
        totalLessons: { $sum: "$lessonsCount" }
      }
    },
    {
      $lookup: {
        from: "teachers",
        localField: "_id",
        foreignField: "_id",
        as: "teacher"
      }
    },
    { $unwind: "$teacher" },
    {
      $project: {
        _id: 0,
        teacherId: "$teacher._id",
        teacherName: "$teacher.name",
        totalLessons: 1
      }
    }
  ]
);
// Kiểm tra
db.teacher_lesson_count.find();

// PHẦN 4. TRANSACTION
// ====================

// Câu 6: Thêm SV mới + tăng studentCount của lớp tương ứng (A1)
const NEW_STUDENT = {
  _id: 4,
  name: "CharSon", class: "A1",
  enrolledCourses: [102],
  hobbies: ["fishing", "chess"]
};
//6.1.start session
session = db.getMongo().startSession();
//6.2.choice database
sdb = session.getDatabase("schooldb");
//6.3.start transaction
session.startTransaction();
try {
  //6.3.1.Thêm SV mới + tăng studentCount của lớp tương ứng
  sdb.students.insertOne(NEW_STUDENT);

  const up = sdb.classes.updateOne(
    { class: NEW_STUDENT.class },
    { $inc: { studentCount: 1 } },
    { upsert: true }
  );
  if (!((up.matchedCount === 1) || (up.upsertedCount === 1))) {
    throw new Error("Update Classes failed");
  }
  //6.3.2.commit transaction xác nhận thay đổi
  session.commitTransaction();
  print("Transaction committed");
} catch (e) {
  //6.3.3.rollback nếu lỗi
  print("Error -> rollback:", e);
  session.abortTransaction();
} finally {
  //6.3.4.kết thúc session
  session.endSession();
}


// Câu 7: Đăng ký khóa học (addToSet + tăng enrolledCount). Rollback nếu trùng/không tồn tại.
const studentId = 2;  // Bob
const courseId = 101;

//7.1.start session
session = db.getMongo().startSession();
//7.2.choice database
sdb = session.getDatabase("schooldb");
//7.3.start transaction
session.startTransaction();
try {
  //7.3.1.Đăng ký khóa học (addToSet + tăng enrolledCount)
  const res1 = sdb.students.updateOne(
    { _id: studentId, enrolledCourses: { $ne: courseId } }, // chỉ khi chưa có
    { $addToSet: { enrolledCourses: courseId } }
  );
  if (res1.matchedCount !== 1 || res1.modifiedCount !== 1) {
    throw new Error("Student not found or already enrolled");
  }

  //7.3.2.tăng enrolledCount
  const res2 = sdb.courses.updateOne(
    { _id: courseId },
    { $inc: { enrolledCount: 1 } }
  );
  if (res2.matchedCount !== 1) {
    throw new Error("courses not found");
  }

  //7.3.3.commit transaction xác nhận thay đổi
  session.commitTransaction();
  print("Transaction committed");
} catch (e) {
  //7.3.4.rollback nếu lỗi
  print("Error -> rollback:", e);
  session.abortTransaction();
} finally {
  //7.3.5.kết thúc session
  session.endSession();
}