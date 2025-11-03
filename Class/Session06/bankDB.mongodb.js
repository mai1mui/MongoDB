use("bankDB")
db.User.find();
use("bankDB")
db.User.updateOne({ name: "Tuan" }, { $set: { balance: 10000 } })
use("bankDB")
db.Notification.find();
//vi du transaction thanh cong
//1.Bat dau session
session = db.getMongo().startSession();
//2. Chon database
bankDB = session.getDatabase("bankDB")
//3. Bat Dau transaction
session.startTransaction()
try {
    //1. Tru tien ông chuyển tiền
    bankDB.User.updateOne(
        {
            name: "Tuan",

        },
        {
            $inc: { balance: -1000 }
        })
    //2. Cong tien ông nhận tiền
    bankDB.User.updateOne(
        {
            name: "Patrik",

        },
        {
            $inc: { balance: 1000 }
        })
    //3. Gui thong bao 
    bankDB.Notification.insertOne({
        user: "Patrik",
        message: "Ban vua nhan duoc 1000 VND tu Tuan",
        createAt: new Date(),
        read: false
    })
    //4. commit transaction xác nhận thay đổi
    session.commitTransaction();
    print("Transaction commit successfully")
} catch (error) {
    //rollback nếu lỗi
    session.abortTransaction();
    print("Transaction rollback: " + error)

} finally {
    session.endSession();
}
//**vi du that bai**
//1.Bat dau session
session = db.getMongo().startSession();
//2. Chon database
bankDB = session.getDatabase("bankDB")
//3. Bat Dau transaction
session.startTransaction()
try {
    //Tim nguoi gui sender
    sender = bankDB.User.findOne({ name: "Tuan" });
    if (!sender) {
        throw new Error("Khong tim thay nguoi gui")
    }
    if (sender.balance < 5000) {
        throw new Error("So du khong du")
    }
    //1. Tru tien ông chuyển tiền
    bankDB.User.updateOne(
        {
            name: "Tuan",

        },
        {
            $inc: { balance: -5000 }
        })
    receiver = bankDB.User.findOne({ name: "Matic" });
    if (!receiver) {
        throw new Error("Chuyen nhầm người rồi.Tiền đã được chuyển lại cho bạn")
    }
    //2. Cong tien ông nhận tiền
    bankDB.User.updateOne(
        {
            name: "Matic",

        },
        {
            $inc: { balance: 5000 }
        })
    //3. Gui thong bao 
    bankDB.Notification.insertOne({
        user: "Patrik",
        message: "Ban vua nhan duoc 5000 VND tu Tuan",
        createAt: new Date(),
        read: false
    })
    //4. commit transaction xác nhận thay đổi
    session.commitTransaction()
    print("Transaction commit successfully")
} catch (error) {
    //rollback nếu lỗi
    session.abortTransaction();
    print("Transaction rollback: " + error)

} finally {
    session.endSession();
}
