use("ShopDB");
// Tạo collection customers
db.customers.insertMany([
    {
        _id: 1, name: "Alice",
        email: "alice@example.com", city: "Hanoi"
    },
    {
        _id: 2, name: "Bob",
        email: "bob@example.com", city: "HCM"
    },
    {
        _id: 3, name: "Charlie",
        email: "charlie@example.com", city: "Danang"
    }
]);

// Tạo collection orders (liên kết với customerId)
db.orders.insertMany([
    {
        _id: 101, customerId: 1, total: 120,
        status: "shipped", date: ISODate("2025-10-20")
    },
    {
        _id: 102, customerId: 1, total: 80,
        status: "pending", date: ISODate("2025-10-21")
    },
    {
        _id: 103, customerId: 2, total: 200,
        status: "shipped", date: ISODate("2025-10-22")
    }
]);
//1.1 Ghep don hang voi thong tin khach hang tuong ung
//$lookup- JOIN 2 collection
use("ShopDB");
db.orders.aggregate([
    {
        $lookup: {
            from: "customers",
            localField: "customerId",
            foreignField: "_id",
            as: "customerInfo"
        }
    },
    {
        //bung mang , lấy phần tử bên trong
        $unwind: "$customerInfo"

    },
    {
        $project: {
            _id: 1,
            name: "$customerInfo.name",
            total: 1,
            status: 1,
            date: 1
        }
    }
])
//1.2 Tinh tong chi tieu cua moi khach hang
use("ShopDB")
db.orders.aggregate([
    {
        $group: {
            _id: "$customerId",
            totalSpent: {
                $sum: "$total"
            },
            //$sum:1 cộng dồn document
            orderCount: { $sum: 1 }
        }
    },
    {
        $lookup: {
            from: "customers",
            localField: "_id",
            foreignField: "_id",
            as: "customerInfo"
        }
    },
       {
        //bung mang , lấy phần tử bên trong
        $unwind: "$customerInfo"

    },
     {
        $project: {
            _id: 1,
            name: "$customerInfo.name",
            totalSpent: 1,
            orderCount: 1
        }
    }
])