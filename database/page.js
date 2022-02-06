var mysql = require('mysql');


const express = require('express');
var app = express();
const bodyparser = require('body-parser');

const cors=require("cors")
app.use(bodyparser.json());
// app.use(function(req,res,next){
//     res.header("Access-Control-Allow-Origin","*");
//     res.header("Access-Control-Allow-Methods",'GET,PUT,POST,DELETE');
//     res.header("Access-Control-Allow-Headers",'Content-Type');
//     next();
// })
app.use(
    cors({
        origin:"*",
        methods:"PUT,POST,GET,DELETE"
    })
)
var con = mysql.createConnection({
    host: "localhost",
    port:"3306",
    user: "root",
    password: "Me1Ak@sh1234",
    database:"library",
    multipleStatements: true
  });

con.connect((err)=>{
    if(!err){
        console.log("Done0");
    }
    else{
        console.log(err);
    }
})
app.listen(3000, () => console.log('Express server is runnig at port no : 3000'));
con.query("Show tables",(err,result)=>{
    console.log(result);
})

app.get('/api/books', (req, res) => {
    con.query('SELECT * FROM books', (err, rows, fields) => {
        if (!err)
            // res.send(rows,200);
            res.status(200).send(rows);
        else
            console.log(err);
    })
});
app.put('/api/books/:id',(req,res)=>{
    console.log("Put");
    console.log(req.body);
    let details=req.body.book;
    console.log(details.BookName,details.AuthorName,details.BookAvailable,details.bookid_);
    con.query('UPDATE books SET BookName = ?,AuthorName = ?,BookAvailable = ? WHERE bookid_ = ?',[details.BookName,details.AuthorName,parseInt(details.BookAvailable),req.params.id],(err,rows,fields)=>{
        if(!err){
            console.log(rows);
            res.sendStatus(200);
        }
        else{
            res.sendStatus(404);
        }
    })
})
app.get("/api/admins/:id",(req,res)=>{
    con.query('SELECT * FROM admin_credits where AdminName=?',[req.params.id],(err,rows,fields)=>{
        if (!err)
            res.send(rows,200);
        else
            console.log(err);
    })
})
app.get("/api/userpages/:id",(req,res)=>{
        con.query('SELECT * FROM user_books WHERE userId=?',[req.params.id],(err,rows,fields)=>{
            let arr=Object.keys(rows);
            if(arr.length==0){
                res.sendStatus(200);
                }
            else if (!err){
                console.log(rows);
                if(arr.length==0){
                    res.sendStatus(200);
                    return;
                }
                let dates=[];
                let duedate=[]
                let dues=[]
                let date=new Date();
                let str='('+rows[0].bookid;
                dates.push(rows[0].buydate.toString().split(" ").slice(1,4).toString())
                duedate.push(rows[0].duedate.toString().split(" ").slice(1,4).toString())
                if(rows[0].duedate<date){
                    dues.push(1);
                }
                else{
                    dues.push(0);
                }
                for(let i=1;i<arr.length;i++){
                    str+=","+rows[i].bookid;
                    dates.push(rows[i].buydate.toString().split(" ").slice(1,4).toString())
                    duedate.push(rows[i].duedate.toString().split(" ").slice(1,4).toString())
                    if(rows[i].duedate<date){
                        dues.push(1);
                    }
                    else{
                        dues.push(0);
                    }


                }
                str +=")";
                con.query('SELECT * FROM books where bookid_ in'+str,(err,row,fields)=>{
                    if (!err)
                    {
                        let bookid=[];
                        let bookname=[];
                        
                        console.log(Object.keys(row));
                        for(let i=0;i<Object.keys(row).length;i++){
                            bookid.push(row[i].bookid_)
                            bookname.push(row[i].BookName)
                            
                        }
                        let obj={}
                        obj["id"]=1
                        obj["bookid"]=bookid
                        obj["bookname"]=bookname
                        obj["rentdate"]=dates
                        obj["duedate"]=duedate
                        obj["due"]=dues
    
    
    
                            
                        res.send(obj,200);}
                  
                    else{
                        res.status(404);
                    }
            })
        }
            
            else
            res.status(404)
                
        })

    
   
})
app.get("/api/users/:id",(req,res)=>{
    con.query('SELECT * FROM user_credits where userId=?',[req.params.id],(err,rows,fields)=>{
        if (!err){;
        res.send(rows,200);}
       
        else
        res.sendStatus(404);
    })

})
app.get('/api/books/:id',(req,res)=>{
    con.query('SELECT * FROM books where bookid_= ?',[req.params.id],(err,rows,fields)=>{
        if(!err){
            res.send(rows,200);
        }
        else{
            res.sendStatus(404);
        }
    })
})
app.post("/apipost/user/book",(req,res)=>{
    let details=req.body;
    con.query("select BookAvailable from books where bookid_ =?",[details.bookid],(err,rows,fields)=>{
        let bookava=rows[0].BookAvailable
        if(bookava>0){
            con.query("INSERT INTO user_books(userId,bookid,buydate,duedate) values(?,?,?,?)",[details.userId,details.bookid,details.buydate,details.duedate],(err,rows,fields)=>{
                if (!err){
                    console.log("user book posted");
                
                        con.query("UPDATE books SET BookAvailable =? WHERE bookid_ = ?",[bookava-1,details.bookid],(err,rows,fields)=>{
                            if(!err){
                                console.log("Updated");
                            }
                        });
                // console.log(rows[(rows.length)-1].bookid_)
            }
               
                else
                    console.log(err);
            })
        }
      
    })
   
})

app.post("/api/books",(req,res)=>{
    let details=req.body;
    details=details.book;
    con.query("INSERT INTO books(BookName,AuthorName,BookAvailable) values(?,?,?)",[details.BookName,details.AuthorName,details.BookAvailable],(err,rows,fields)=>{
        if (!err){ console.log("admin port");
        res.send("Done");}
       
        else
            console.log(err);
    })
})

app.post("/apipost/admin/user",(req,res)=>{
    let details=req.body;

    con.query("INSERT INTO user_details(UserName,sch_clg_id,address_id) values(?,?,?)",[details.UserName,details.sch_clg_id,details.address_id],(err,rows,fields)=>{
        if (!err){
            con.query("SELECT userId FROM user_details ORDER BY userId DESC LIMIT 1",(err,rows,fields)=>{
                console.log(rows[0].userId);
                con.query("INSERT INTO user_credits(userId,userPass) values(?,?)",[rows[0].userId,details.password],(err,rows,fields)=>{
                    console.log("inserted");
                }
                    )
            })
            console.log(rows);
             console.log("admin port");
        res.send("Done");}
       
        else
            console.log(err);
    })
})


app.post("/apipost/user/delete",(req,res)=>{
    let details=req.body;
    con.query("DELETE FROM user_books WHERE userId = ? AND bookid=?",[details.userId,details.bookid],(err,rows,fields)=>{
        if (!err){ 
            con.query("select BookAvailable from books where bookid_ =?",[details.bookid],(err,rows,fields)=>{
                let bookava=rows[0].BookAvailable;
                con.query("UPDATE books SET BookAvailable =? WHERE bookid_ = ?",[bookava+1,details.bookid],(err,rows,fields)=>{
                    console.log("Updated")
                })
            })
        res.send("Done");}
       
        else
        res.sendStatus(404);
    })
})

app.delete("/api/books/:id",(req,res)=>{
    console.log(req.params.id);
    con.query("DELETE FROM books where bookid_ = ?",[req.params.id],(err,rows,fields)=>{
        if(!err){
            console.log("Deleted");
            res.sendStatus(202);
        }
        else{
            res.sendStatus(404);
            console.log("error");
        }
    })
})


