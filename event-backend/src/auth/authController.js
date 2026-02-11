const bcrypt     = require("bcryptjs");
const jwt        = require("jsonwebtoken");
const pool       = require("../../db");


const JWT_SECRET="supersecretkey";


exports.login=async(req,res)=>{
    const {username,password}=req.body;

    const result=await pool.query("SELECT * FROM users WHERE username=$1",[username]);
    const user=result.rows[0];

    if(!user){
        return res.status(401).json({error:"Invalid credentials"})
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.status(401).json({error:"Invalid credentials"})
    }

    const token = jwt.sign({id:user.id,username:user.username},JWT_SECRET,{expiresIn:"1h"});
    return res.json({token});
}

exports.signup=async(req,res)=>{
    try{
        const {username,password}=req.body;

        const result=await pool.query("SELECT id FROM users WHERE username=$1",[username]);
        const user=result.rows[0];

        if(result.rows.length>0){
            return res.status(409).json({error:"Invalid credentials"})
        }

        const hash = await bcrypt.hash(password,10);

        const insert =await pool.query("INSERT INTO users (username,password) VALUES($1,$2) RETURNING id, username",[username,hash]);
        return res.status(201).json({ user: insert.rows[0] });

    }
    catch (err) {
        console.error("signup error:", err); // <= affiche l'erreur exacte
        // optionnel: gérer le cas unique violation
        if (err.code === "23505") {
            return res.status(409).json({ error: "Username already exists" });
        }
        return res.status(500).json({ error: err.message });
    }

}

exports.me = async(req,res)=>{
    return res.json({
        user: {
            id: req.user.id,
            username: req.user.username,
        },
    });
};
