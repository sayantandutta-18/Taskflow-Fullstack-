import Task from "../models/Task.js";
//create Task

export const createTask =async (req,res) => {
    try{
        const{title, description,status,priority,dueDate} =req.body;

        const task = await Task.create({

            title,
            description,
            status,
            priority,
            dueDate,
            user:req.user.id,
        });

         res.status(201).json({
            message:"Task created Successfully",
            task,
         });
    } catch(error){
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get All Tasks

export const getTasks =async (req,res) => {
    try{
        const tasks=await Task.find({
            user:req.user.id,
        }).sort({createdAt: -1});

        res.status(200).json(tasks);
    }catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
};

//Update Task

export const updateTask = async (req,res)=> {
    try{
        const task = await Task.findOne({
            _id:req.params.id,
            user:req.user.id,
        });
        if(!task){
            return res.status(404).json({
                message:"Task not found",
            });
        }


        const updatedTask= await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new:true,
            }
        );

        res.status(200).json({
            message:"Task Updated Succesfully",
            task: updatedTask,
        });
    }catch(error) {
        res.status(500).json({
            message:error.message,
        });
    }
};

export const deleteTask=async (req,res) => {
    try{
        const task = await Task.findOne({
            _id:req.params.id,
            user:req.user.id,
        });

        if(!task){
            return res.status(404).json({
                message:"Task not found",
            }); 
        }

        await Task.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message:"Task deleted Successfully"
        });
    }catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
};