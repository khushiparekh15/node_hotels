const express = require('express');
const router = express.Router();
const Person = require('./../models/Person');

router.post('/', async (req,res)=>{
    try{
       const data=req.body   //Assuming the request body contains the person data

       //Create a new Person document using the Mongoose model
       const newPerson = new Person(data);

       //Save the new person to the database
       const response = await newPerson.save();
       console.log('data saved');
       res.status(200).json(response);
       }
       catch(err){
               console.log(err);
               res.status(500).json({error:'Internal Server Error'});
       }
})

//GET Method to get the person..........
router.get('/',async(req,res)=>{
    try{
       const data = await Person.find();
       console.log('data fetched');
       res.status(200).json(data);
    }catch(err){
            console.log(err);
            res.status(500).json({error:'Internal Server Error'});
    }
})


//Person WorkType Perameter....
router.get('/:workType',async (req,res)=>{
    try{
     const workType = req.params.workType;
     if (workType=='chef' || workType == 'manager' || workType == 'waiter' ){
             const response = await Person.find({work: workType});
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
        const personId = req.params.id;  //Extract the id from thhe URL parameter
        const updatePersonData = req.body;   //Updates data for the person
        
        const response = await Person.findByIdAndUpdate(personId,updatePersonData,{
            new: true,  //Return the updated document
            runValidators: true,  //Run Mongoose validation
        })

        if(!response){
            return res.status(404).json({error: 'Person not found'});
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
        const personId = req.params.id;
        const response = await Person.findByIdAndDelete(personId);

        if(!response){
            return res.status(404).json({error: 'Person not found'});
        }
            console.log('data delete');
             res.status(500).json({message: 'Person Deleted Successfully'});
    } catch (err) {
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
})

//commit
module.exports = router;