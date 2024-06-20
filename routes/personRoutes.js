const express = require('express');
const router = express.Router();
const Person = require('./../models/Person');
const { jwtAuthmiddleware, generateToken } = require('./../jwt');

router.post('/signup', async (req,res)=>{
    try{
       const data=req.body   //Assuming the request body contains the person data

       //Create a new Person document using the Mongoose model
       const newPerson = new Person(data);

       //Save the new person to the database
       const response = await newPerson.save();
       console.log('data saved');

       const payload = {
        id: response.id,
        username: response.username
       }
       console.log(JSON.stringify(payload));
       const token = generateToken(payload);
       console.log("Token is:", token);

       res.status(200).json({response: response , token: token});
       }
       catch(err){
               console.log(err);
               res.status(500).json({error:'Internal Server Error'});
       }
})

//Lgin Route
router.post('/login',async(req,res)=>{
    try {
        //Extract username and password from request body
        const {username,password} =req.body;

        //Find the user by username...
        const user = await Person.findOne({username: username});

        //If User does exist or password does not match, return error
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error:'Invalid UserName or Password'});
        }

        //Generate Token....
        const payload = {
            id : user.id,
            username: user.username
        }
        const token = generateToken(payload);

        //Return Token as response
        res.json({token})
    } catch (err) {
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
});

//Profile route...
router.get('/profile',jwtAuthmiddleware,async(req,res)=>{
    try{
        const userData = req.user;
        console.log("User Data:",userData);

        const userId = userData.id;
        const user = await Person.findById(userId);
        res.status(200).json({user});
    }catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
})
//GET Method to get the person..........
router.get('/',jwtAuthmiddleware,async(req,res)=>{
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

module.exports = router;