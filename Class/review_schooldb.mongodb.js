//choice db
use("schooldb");
// Câu 1: Liệt kê SV + danh sách tên khóa học
db.students.aggregate([
    {$lookup: {
      from: "courses",
      localField: "enrolledCourses",
      foreignField: "_id",
      as: "courseDocs"
    }},
    {$project: {
      _id:0,
      StudentID:"$_id",
      StudentName:"$name",
      Class:"$class",
      CourseName:{
        $map:{
            input:"$courseDocs",
            as:"c",
            in:"$$c.name"
        }
      }  
    }}
]);

// Câu 2: Tổng số lessons mỗi giáo viên
db.teachers.aggregate([
    {$lookup: {
      from: "courses",
      localField: "_id",
      foreignField: "teacherId",
      as: "courses"
    }},
    {$project: {
      _id:0,
      TeacherID:"$_id",
      TeacherName:"$name",
      TotalLessons:{
        $sum:{
            $map:{
                input:"$courses",
                as:"c",
                in:{$size:"$$c.lessons"}
            }
        }
      }
    }}
]);