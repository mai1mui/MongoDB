//==================================== - EXAM - MONGODB - ===============================
// use("hospital")
// db.createCollection("patients")
// db.createCollection("doctors")
// db.createCollection("appointments")
//=======================================================================================

//=======================================================================================
// db.patients.insertMany([
//   { patientID: 1, name: "Alice", age: 25, gender: "Female", conditions: "Diabetes" },
//   { patientID: 2, name: "Bob", age: 40, gender: "Male", conditions: "Hypertension" },
//   { patientID: 3, name: "Carol", age: 32, gender: "Female", conditions: "Asthma" },
//   { patientID: 4, name: "David", age: 55, gender: "Male", conditions: "Coronary Artery Disease" },
//   { patientID: 5, name: "Emma", age: 28, gender: "Female", conditions: "Migraine" }
// ]);

// db.doctors.insertMany([
//   { doctorID: 1, name: "Dr. Smith",   specialty: "Cardiology" },
//   { doctorID: 2, name: "Dr. Lee",     specialty: "Endocrinology" },
//   { doctorID: 3, name: "Dr. Nguyen",  specialty: "Pulmonology" },
//   { doctorID: 4, name: "Dr. Patel",   specialty: "Neurology" },
//   { doctorID: 5, name: "Dr. Johnson", specialty: "Internal Medicine" }
// ]);

// db.appointments.insertMany([
//   { appointmentID: 1, patientID: 1, doctorID: 2, date: "2024-07-01", status: "Completed" },
//   { appointmentID: 2, patientID: 2, doctorID: 1, date: "2024-07-05", status: "Scheduled" },
//   { appointmentID: 3, patientID: 3, doctorID: 3, date: "2024-07-10", status: "Cancelled" },
//   { appointmentID: 4, patientID: 4, doctorID: 1, date: "2024-07-12", status: "Completed" },
//   { appointmentID: 5, patientID: 5, doctorID: 4, date: "2024-07-15", status: "Scheduled" }
// ]);
//=======================================================================================

//=======================================================================================
//r2. truy van all benh nhan co appointments voi Dr.Smith
use("hospital")
db.appointments.aggregate([
  {
    $lookup: {
      from: "doctors",
      localField: "doctorID",
      foreignField: "doctorID",
      as: "doctor"
    }
  },
  { $match: { "doctor.name": "Dr. Smith" } },
  {
    $lookup: {
      from: "patients",
      localField: "patientID",
      foreignField: "patientID",
      as: "patient"
    }
  },
  {
    $project: {
      _id: 0,
      DoctorName: "$doctor.name",
      PatientName: "$patient.name",
      Age: "$patient.age",
      Gender: "$patient.gender"
    }
  }
]);
//=======================================================================================

//=======================================================================================
//r3.liet ke all bac si co hon 1 lich hen
use("hospital")
db.appointments.aggregate([
  {
    $group: {
      _id: "$doctorID",
      totalAppointments: { $sum: 1 }
    }
  },
  { $match: { totalAppointments: { $gt: 1 } } },
  {
    $lookup: {
      from: "doctors",
      localField: "_id",
      foreignField: "doctorID",
      as: "doctor"
    }
  },
  {
    $project: {
      _id: 0,
      DoctorID: "$doctor.doctorID",
      DoctorName: "$doctor.name",
      Specialty: "$doctor.specialty",
      TotalAppointments: "$totalAppointments"
    }
  }
]);
//==================================================

//==================================================
//r4.cap nhat appointmentID: 3, status: "Completed"
use("hospital")
db.appointments.updateOne(
  { appointmentID: 3 },
  { $set: { status: "Completed" } }
);
db.appointments.findOne({ appointmentID: 3 })
//==================================================

//==================================================
//r5.xoa all appointment co status Cancelled
use("hospital")
db.appointments.deleteMany({ status: "Cancelled" });
db.appointments.find()
//==================================================

//=============================================================
//r6.them field moi "notes" cho appointment, gia tri rong
use("hospital")
db.appointments.updateMany(
  {},
  { $set: { notes: "" } }
)
use("hospital")
db.appointments.find();
//==============================================================

//=================================================
// //r7.tao compound index : name, specially
use("hospital")
db.doctors.createIndex({ name: 1, specialty: 1 });
//=================================================

//=======================================================================================
//r8. tinh tong appointment cua moi bac si
use("hospital")
db.appointments.aggregate([
  {
    $group: {
      _id: "$doctorID",
      totalAppointments: { $sum: 1 }
    }
  },
  {
    $lookup: {
      from: "doctors",
      localField: "_id",
      foreignField: "doctorID",
      as: "doctor"
    }
  },
  {
    $project: {
      _id: 0,
      doctorID: "$doctor.doctorID",
      name: "$doctor.name",
      specialty: "$doctor.specialty",
      totalAppointments: "$totalAppointments"
    }
  }
]);
//=======================================================================================

//=======================================================================================
//r9.Tạo view activeAppointments (lọc các lịch hẹn có status: "Scheduled"):
use("hospital");
// (Tùy chọn) Nếu đã tạo trước đó, drop để tạo lại
// db.activeAppointments.drop();
db.createView(
  "activeAppointments",     // tên view
  "appointments",           // nguồn dữ liệu
  [{ $match: { status: "Scheduled" } }] // pipeline lọc
);

// Kiểm tra
db.activeAppointments.find().pretty();
//View là read-only; muốn thêm/sửa/xóa phải thao tác trên collection gốc appointments
//=======================================================================================

//=======================================================================================
//r10. Transaction: insert 1 benh nhan moi + update appointmentID:1 → "Cancelled"
//bật replica set
use("hospital")
session = db.getMongo().startSession();
hospital = session.getDatabase("hospital");

try {
  session.startTransaction();

  hospital.patients.insertOne({
    patientID: 6,
    name: "Frank",
    age: 30,
    gender: "Male",
    conditions: ["None"]
  });

  hospital.appointments.updateOne(
    { appointmentID: 1 },
    { $set: { status: "Cancelled" } }
  );

  session.commitTransaction();
  print("Transaction OK: ");
} catch (e) {
  session.abortTransaction();
  print("Transaction rollback: " + e);
} finally { session.endSession(); }
//=======================================================================================