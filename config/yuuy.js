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

// make auth
  program
  .command('make:auth')
  .description('Create a Default Api Auth')
  .action(() => {
     // model
     const modelTemplate = `const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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

const User = mongoose.model('User', userSchema);

module.exports = User;
`;
     const modelDir = path.join(__dirname, '../models');
     const modelPath = path.join(modelDir, `User.js`);
     
     if (!fs.existsSync(modelDir)) {
       fs.mkdirSync(modelDir);
     }
     if(!fs.existsSync(modelPath)){
      fs.writeFileSync(modelPath, modelTemplate.trim());
      console.log(`Model Auth created successfully at ${modelPath}`);
     }else{
      console.log(`Auth already created at ${modelPath}`);
     }
     // model

     // middleware
     const middlewareTemplate = `const jwt = require('jsonwebtoken');
const config = require('../config/config');

const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');

    console.log('Authorization Header:', authHeader); // Log the full authorization header

    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(" ")[1]
    console.log('Extracted Token:', token); // Log the extracted token

    if (!token) {
        return res.status(401).json({ message: 'Authorization token format is Bearer <token>' });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        console.log('Decoded Token:', decoded); // Log the decoded token
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Token Verification Error:', err.message); // Log the error message
        res.status(401).json({ message: 'Token is not valid', error: err });
    }
};

module.exports = auth;
`;
          const middlewareDir = path.join(__dirname, '../middlewares');
          const middlewarePath = path.join(middlewareDir, `AuthMiddleware.js`);
          
          if (!fs.existsSync(middlewareDir)) {
            fs.mkdirSync(middlewareDir);
          }
          if(!fs.existsSync(middlewarePath)){
           fs.writeFileSync(middlewarePath, middlewareTemplate.trim());
           console.log(`Middleware Auth created successfully at ${middlewarePath}`);
          }else{
           console.log(`Auth already created at ${middlewarePath}`);
          }
       // middleware

     // controller
     const controllerTemplate = `const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const config = require('../config/config');

const signup = async (req, res) => {
    await check('email', 'Please include a valid email').isEmail().run(req);
    await check('password', 'Password must be 6 or more characters').isLength({ min: 6 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const login = async (req, res) => {
    await check('email', 'Please include a valid email').isEmail().run(req);
    await check('password', 'Password is required').exists().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = {
    signup,
    login
};
`;
const controllerDir = path.join(__dirname, '../controllers');
const controllerPath = path.join(controllerDir, `AuthController.js`);

if (!fs.existsSync(controllerDir)) {
  fs.mkdirSync(controllerDir);
}

if(!fs.existsSync(controllerPath)){
 fs.writeFileSync(controllerPath, controllerTemplate.trim());
 console.log(`Controller Auth created successfully at ${controllerPath}`);
}else{
 console.log(`Auth already created at ${controllerPath}`);
}
      // controller

     // route
const routeTemplate = `const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Signup a new user
router.post('/signup', AuthController.signup);

// Login a user
router.post('/login', AuthController.login);

module.exports = router;`;
    const routeDir = path.join(__dirname, '../routes');
    const routePath = path.join(routeDir, `AuthRoute.js`);
    
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir);
    }
    if(!fs.existsSync(routePath)){
     fs.writeFileSync(routePath, routeTemplate.trim());
     console.log(`Route Auth created successfully at ${routePath}`);
    }else{
     console.log(`Auth already created at ${routePath}`);
    }
// route

    
  });

program.parse(process.argv);