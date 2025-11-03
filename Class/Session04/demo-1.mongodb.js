
//B1: Tao truoc user co quyen cao nhat la rootAdmin
db.createUser({
    user:"rootAdmin",
    pwd:"root123",
    roles:[{role:"root",db:"admin"}]
})
//B2. Vao file cogf, enable authentication len
//C:\Program Files\MongoDB\Server\8.2\bin
//security:
//  authorization: enabled
//show users
db.getUsers()
//tao user co quyen read
use("admin")
db.createUser({
  user:"readUser",
  pwd:"read123",
  roles:[
    {role:"read",db:"schoolDB"}
  ]
})
//login voi readUser
db.auth("readUser","read123")
//Lưu ý: Phai login lại admin
//vi admin mới có quyền tạo user
//nhớ là vừa login xong, phai qua database khác
//rồi mới tạo user nhé
//tao user co quyen readWrite
//
db.createUser({
  user:"writeUser",
  pwd:"write123",
  roles:[
    {role:"readWrite",db:"schoolDB"}
  ]
})
//*****write user co quyen CRUD collection
//**Co The **/
//CRUD
//drop collection
//tao index
//**khong the**
//khong the dropDatabase
//khong the xem user khac
//khong the tao user khac
//tao ownerUser
db.createUser({
  user:"ownerUser",
  pwd:"owner123",
  roles:[
    {role:"dbOwner",db:"schoolDB"}
  ]
})
//runCommand
//insert
db.runCommand({
  insert:"students",
  documents:[{name:"Quang Le"},{name:"Dung Le"}]
})
//find
var result= db.runCommand({find:"students"})
result.cursor.firstBatch
//update
db.runCommand({update:"students",updates:[
  {
    q:{name:"Xuyen le"},
    u:{$set:{name:"Le Xuyen"}}
  }
]})