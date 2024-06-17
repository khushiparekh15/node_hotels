const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

router.post('/', async (req,res)=>{
    try{
       const data=req.body  
       const newMenuItem = new MenuItem(data);
       const response = await newMenuItem.save();
       console.log('data saved');
       res.status(200).json(response);
       }
       catch(err){
               console.log(err);
               res.status(500).json({error:'Internal Server Error'});
       }
})

router.get('/',async(req,res)=>{
    try{
       const data = await MenuItem.find();
       console.log('data fetched');
       res.status(200).json(data);
    }catch(err){
            console.log(err);
            res.status(500).json({error:'Internal Server Error'});
    }
})

router.get('/:tasteType',async (req,res)=>{
        try{
         const tasteType = req.params.tasteType;
         if (tasteType =='sweet' || tasteType == 'spicy' || tasteType == 'sour' ){
                 const response = await MenuItem.find({taste: tasteType});
                 console.log('response fetched');
                 res.status(200).json(response);
         }else{
                 res.status(404).json({error:'Invalid work type'});
         }
        }catch(err){
         console.log(err);
         res.status(500).json({error:'Internal Server Error'});
        }
    })


    //Update Operation........
router.put('/:id',async(req,res)=>{
        try{
            const menuId = req.params.id;  //Extract the id from thhe URL parameter
            const updatemenuData = req.body;   //Updates data for the person
            
            const response = await MenuItem.findByIdAndUpdate(menuId,updatemenuData,{
                new: true,  //Return the updated document
                runValidators: true,  //Run Mongoose validation
            })
    
            if(!response){
                return res.status(404).json({error: 'Menu not found'});
            }
            console.log('data updated');
                 res.status(200).json(response);
        }catch{
            console.log(err);
            res.status(500).json({error:'Internal Server Error'});
        }
    })

    //Delete Operation.....
router.delete('/:id',async (req,res)=>{
        try {
            const menuId = req.params.id;
            const response = await MenuItem.findByIdAndDelete(menuId);
    
            if(!response){
                return res.status(404).json({error: 'MenuItem not found'});
            }
                console.log('data delete');
                 res.status(500).json({message: 'MenuItem Deleted Successfully'});
        } catch (err) {
            console.log(err);
            res.status(500).json({error:'Internal Server Error'});
        }
    })

module.exports = router;