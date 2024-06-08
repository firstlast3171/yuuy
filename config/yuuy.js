const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const program = new Command();

// make model
program
  .command('make:model <name>')
  .description('Create a new model')
  .action((name) => {
    const modelTemplate = `
    const mongoose = require('mongoose');

const ${name}Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const ${name} = mongoose.model('${name}', ${name}Schema);

module.exports = ${name};

    `;
    const modelDir = path.join(__dirname, '../models');
    const modelPath = path.join(modelDir, `${name}.js`);
    
    if (!fs.existsSync(modelDir)) {
      fs.mkdirSync(modelDir);
    }
    if(!fs.existsSync(modelPath)){
     fs.writeFileSync(modelPath, modelTemplate.trim());
     console.log(`Model ${name} created successfully at ${modelPath}`);
    }else{
     console.log(`${name} already created at ${modelPath}`);
    }

    
  });


//   make controller
program
  .command('make:controller <name>')
  .description('Create a new controller')
  .action((name) => {
     const modelDir = path.join(__dirname, '../models');
     const modelPath = path.join(modelDir, `${name}.js`); 
     let testStant = '';
     if(!fs.existsSync(modelPath)){
         testStant = ''
         }else{
          testStant = `const ${name} = require('../models/${name}');`
         }
    const controllerTemplate = `

         ${testStant}


// Get all
const getAll${name}s = async (req, res) => {
    try {
  
     //    res.status(200).json();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single by id
const get${name}ById = async (req, res) => {
    try {
      
     //    res.status(200).json();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create
const create${name} = async (req, res) => {
    try {
       
     //    res.status(201).json();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update by ID
const update${name} = async (req, res) => {
    try {
      
     //    res.status(200).json(${name});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete by ID
const delete${name} = async (req, res) => {
    try {
      
     //    res.status(200).json({ message: '${name} deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    create${name},
    getAll${name},
    get${name}ById,
    update${name},
    delete${name}
};

    `;
    const controllerDir = path.join(__dirname, '../controllers');
    const controllerPath = path.join(controllerDir, `${name}Controller.js`);
    
    if (!fs.existsSync(controllerDir)) {
      fs.mkdirSync(controllerDir);
    }

    if(!fs.existsSync(controllerPath)){
     fs.writeFileSync(controllerPath, controllerTemplate.trim());
     console.log(`Controller ${name} created successfully at ${controllerPath}`);
    }else{
     console.log(`${name} already created at ${controllerPath}`);
    }
   
  
  });

//  make Route
  program
  .command('make:route <name>')
  .description('Create a new route')
  .action((name) => {
     const controllerDir = path.join(__dirname, '../controllers');
    const controllerPath = path.join(controllerDir, `${name}Controller.js`);
     let testStant = '';
     if(!fs.existsSync(controllerPath)){
         testStant = `const express = require('express');
const router = express.Router();


// Get all 
router.get('/',function(req,res){
res.send('Hello From /')
});

// Get single by ID
router.get('/:id', function(req,res){
res.send('Get From /:id')
});

// Create 
router.post('/', function(req,res){
res.send('Create From /')
});

// Update  by ID
router.put('/:id',function(req,res){
res.send('Update From /:id')
});

// Delete by ID
router.delete('/:id', function(req,res){
res.send('Delete With /:id')
});

module.exports = router;`
         }else{
          testStant = `const express = require('express');
const router = express.Router();
const ${name}Controller = require('../controllers/${name}Controller');



// Get all 
router.get('/', ${name}Controller.getAll${name});

// Get single by ID
router.get('/:id', ${name}Controller.get${name}ById);

// Create 
router.post('/', ${name}Controller.create${name});

// Update  by ID
router.put('/:id', ${name}Controller.update${name});

// Delete by ID
router.delete('/:id', ${name}Controller.delete${name});

module.exports = router;`
         }
    const routeTemplate = `${testStant}`;
    const routeDir = path.join(__dirname, '../routes');
    const routePath = path.join(routeDir, `${name}Route.js`);
    
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir);
    }
    if(!fs.existsSync(routePath)){
     fs.writeFileSync(routePath, routeTemplate.trim());
     console.log(`Route ${name} created successfully at ${routePath}`);
    }else{
     console.log(`${name} already created at ${routePath}`);
    }

    
  });

program.parse(process.argv);