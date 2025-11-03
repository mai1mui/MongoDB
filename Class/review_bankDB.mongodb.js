use("bankDB")
db.User.find()

//I.transaction thành công
//1.start session
session = db.getMongo().startSession();
//2.choice database
bankDB = session.getDatabase("bankDB")
//3.start transaction
session.startTransaction()
try {
    //3.1.trừ tiền người chuyển
    bankDB.User.updateOne(
        { name: "Tuan", },
        { $inc: { balance: -1000 } }
    )
    //3.2.cộng tiền người nhận
    bankDB.User.updateOne(
        { name: "Patrik", },
        { $inc: { balance: 1000 } }
    )
    //3.3.gửi thông báo
    bankDB.Notification.insertOne({
        name: "Patrik",
        message: "Ban vua nhan duoc 1000 VND tu Tuan.",
        createAt: new Date(),
        read: false
    })
    //3.4.commit transaction xác nhận thay đổi
    session.commitTransaction()
    print("Transaction commit successfully.")
} catch (error) {
    //3.5.rollback nếu lỗi
    session.abortTransaction();
    print("Transaction rollback: " + error)
} finally {
    //kết thúc session
    session.endSession();
}

//II.transaction thất bại
use("bankDB")
//1.start session
session = db.getMongo().startSession();
//2.choice database
bankDB = session.getDatabase("bankDB")
//3.start transaction
session.startTransaction()
try {
    //3.1.find người gửi
    sender = bankDB.User.findOne({ name: "Tuan" });
    if (!sender) {
        throw new Error("Not found!")
    }
    if (sender.balance < 5000) {
        throw new Error("So du khong du!")
    }
    //3.2.trừ tiền người gửi
    bankDB.User.updateOne(
        { name: "Tuan", },
        { $inc: { balance: -5000 } }
    )
    //3.3.cộng tiền người nhận
    bankDB.User.updateOne(
        { name: "Matrik", },
        { $inc: { balance: 5000 } }
    )
    //3.4.gửi thông báo
    bankDB.Notification.insertOne(
        {
            name: "Matrik",
            message: "Ban vua nhan duoc 5000 VND tu Tuan.",
            createAt: new Date(),
            read: false
        }
    )
    receiver=bankDB.User.findOne({name:"Matrik"});
    if(!receiver){
        throw new Error("Chuyen nham nguoi roi. Tien se duoc hoan ve tai khoan!")
    }
    //3.5.commit transaction xác nhận thay đổi
    session.commitTransaction();
    print("Transaction commit successfully")
} catch (error) {
    //3.6.roll back nếu lỗi
    session.abortTransaction();
    print("Transaction rollback: "+error)
} finally {
    //kết thúc session
    session.endSession();
}

