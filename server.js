const express = require('express')
//require是CMD规范，类似es6的import
const app = express()
app.use(express.json())
//解析json格式数据
app.use(require('cors')())
//cors方法解决跨域
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/shoppingList',
{ useNewUrlParser: true  ,useUnifiedTopology:true} )
const ShoppingList = mongoose.model('ShoppingList',new mongoose.Schema({title:String}))

//执行express返回结果
//启动服务，监听一个端口3000的端口
app.get('/', function (req, res) {
    res.send([{
            name: '朝夕',
            provience: '广东'
        },
        {
            name: '小明',
            provience: '台湾'
        }
    ])
})
//查看列表接口
app.get('/shoppingList',async function (req, res) {
    const data = await ShoppingList.find()
    res.send( data)
})

//查看详情接口
app.get('/shoppingList/:id',async function (req, res) {
    //# :表示后面可以是任意字符
    const data = await ShoppingList.findById(req.params.id)
        //findById这里的id就是我们从url里获取的，req表示客户端请求的参数
        //req.params表示客户端传递过来的所有参数
    res.send( data)
    //res表示服务端相响应的数据
})

//添加数据到列表接口
//我们刚刚使用代码的insertMany方法插入数据，现在使用post来完成
app.post('/shoppingList',async function (req, res) {
    const data = req.body
    const shopping =await ShoppingList.create(data)
    //获取到客户端发送的值之后，存入ShoppingList集合，记得使用await
    res.send( shopping)
})

//修改详情接口
app.put('/shoppingList/:id',async function (req, res) {
    //put表示覆盖，patch表示部分修改
    const data = await ShoppingList.findById(req.params.id)
    data.title = req.body.title
    //根据客户端传入的值修改
    await data.save() //保存修改
    res.send( data)
})
//删除一个数据
app.delete('/shoppingList/:id',async function (req, res) {
    //put表示覆盖，patch表示部分修改
    const data = await ShoppingList.deleteOne({id:req.body.id})
   
    //根据客户端传入的值修改
    // await data.save() //保存修改
    res.send( data)
})
// ShoppingList.insertMany([{title:'电脑1'},{title:'电脑2'},{title:'电脑3'}])
//插入多条数据

// app.get('/shoppingList', function (req, res) {
//     res.send([{
//             id: '1',
//             provience: 'Gift A'
//         },
//         {
//             id: '2',
//             provience: 'Gift B'
//         },
//         {
//             id: '3',
//             provience: 'Gift C'
//         }
//     ])
// })
app.get('/home', function (req, res) {
    res.send('this is my home')
})

app.use('/static', express.static('public'))

app.listen(3000, () => {
    console.log('App 正在监听3000的端口')
})