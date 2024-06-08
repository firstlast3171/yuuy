#!/usr/bin/env node

const { Command } = require('commander');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const program = new Command();

// Utility function to create a directory if it doesn't exist
function createDirIfNotExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

// Command to create a new model
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

    createDirIfNotExists(modelDir);

    if (!fs.existsSync(modelPath)) {
      fs.writeFileSync(modelPath, modelTemplate.trim());
      console.log(`Model ${name} created successfully at ${modelPath}`);
    } else {
      console.log(`Model ${name} already exists at ${modelPath}`);
    }
  });

// Command to create a new controller
program
  .command('make:controller <name>')
  .description('Create a new controller')
  .action((name) => {
    const modelDir = path.join(__dirname, '../models');
    const modelPath = path.join(modelDir, `${name}.js`);
    let importStatement = '';

    if (fs.existsSync(modelPath)) {
      importStatement = `const ${name} = require('../models/${name}');\n`;
    }

    const controllerTemplate = `
${importStatement}

// Get all
const getAll${name}s = async (req, res) => {
  try {
    // res.status(200).json();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single ${name} by id
const get${name}ById = async (req, res) => {
  try {
    // res.status(200).json();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new ${name}
const create${name} = async (req, res) => {
  try {
    // res.status(201).json();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a ${name} by ID
const update${name} = async (req, res) => {
  try {
    // res.status(200).json();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a ${name} by ID
const delete${name} = async (req, res) => {
  try {
    // res.status(200).json({ message: '${name} deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  create${name},
  getAll${name}s,
  get${name}ById,
  update${name},
  delete${name}
};
    `;
    const controllerDir = path.join(__dirname, '../controllers');
    const controllerPath = path.join(controllerDir, `${name}Controller.js`);

    createDirIfNotExists(controllerDir);

    if (!fs.existsSync(controllerPath)) {
      fs.writeFileSync(controllerPath, controllerTemplate.trim());
      console.log(`Controller ${name} created successfully at ${controllerPath}`);
    } else {
      console.log(`Controller ${name} already exists at ${controllerPath}`);
    }
  });

// Command to create a new route
program
  .command('make:route <name>')
  .description('Create a new route')
  .action((name) => {
    const controllerDir = path.join(__dirname, '../controllers');
    const controllerPath = path.join(controllerDir, `${name}Controller.js`);
    let importStatement = '';

    if (fs.existsSync(controllerPath)) {
      importStatement = `const ${name}Controller = require('../controllers/${name}Controller');\n`;
    }

    const routeTemplate = `
const express = require('express');
const router = express.Router();
${importStatement}

// Get all ${name}s
router.get('/', ${name}Controller.getAll${name}s);

// Get single ${name} by ID
router.get('/:id', ${name}Controller.get${name}ById);

// Create a new ${name}
router.post('/', ${name}Controller.create${name});

// Update a ${name} by ID
router.put('/:id', ${name}Controller.update${name});

// Delete a ${name} by ID
router.delete('/:id', ${name}Controller.delete${name});

module.exports = router;
    `;
    const routeDir = path.join(__dirname, '../routes');
    const routePath = path.join(routeDir, `${name}Route.js`);

    createDirIfNotExists(routeDir);

    if (!fs.existsSync(routePath)) {
      fs.writeFileSync(routePath, routeTemplate.trim());
      console.log(`Route ${name} created successfully at ${routePath}`);
    } else {
      console.log(`Route ${name} already exists at ${routePath}`);
    }
  });

// Command to create default authentication setup
program
  .command('make:auth')
  .description('Create a default API authentication setup')
  .action(() => {
    // Model template
    const modelTemplate = `
const mongoose = require('mongoose');

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
    const modelPath = path.join(modelDir, 'User.js');

    createDirIfNotExists(modelDir);

    if (!fs.existsSync(modelPath)) {
      fs.writeFileSync(modelPath, modelTemplate.trim());
      console.log(`Auth model created successfully at ${modelPath}`);
    } else {
      console.log(`Auth model already exists at ${modelPath}`);
    }

    // Middleware template
    const middlewareTemplate = `
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token format is Bearer <token>' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
    `;
    const middlewareDir = path.join(__dirname, '../middlewares');
    const middlewarePath = path.join(middlewareDir, 'AuthMiddleware.js');

    createDirIfNotExists(middlewareDir);

    if (!fs.existsSync(middlewarePath)) {
      fs.writeFileSync(middlewarePath, middlewareTemplate.trim());
      console.log(`Auth middleware created successfully at ${middlewarePath}`);
    } else {
      console.log(`Auth middleware already exists at ${middlewarePath}`);
    }

    // Controller template
    const controllerTemplate = `
const jwt = require('jsonwebtoken');
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

    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({ token });
    });
  } catch (err) {
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

    const payload = { user: { id: user.id } };
    jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

module.exports = { signup, login };
    `;
    const controllerDir = path.join(__dirname, '../controllers');
    const controllerPath = path.join(controllerDir, 'AuthController.js');

    createDirIfNotExists(controllerDir);

    if (!fs.existsSync(controllerPath)) {
      fs.writeFileSync(controllerPath, controllerTemplate.trim());
      console.log(`Auth controller created successfully at ${controllerPath}`);
    } else {
      console.log(`Auth controller already exists at ${controllerPath}`);
    }

    // Route template
    const routeTemplate = `
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Signup a new user
router.post('/signup', AuthController.signup);

// Login a user
router.post('/login', AuthController.login);

module.exports = router;
    `;
    const routeDir = path.join(__dirname, '../routes');
    const routePath = path.join(routeDir, 'AuthRoute.js');

    createDirIfNotExists(routeDir);

    if (!fs.existsSync(routePath)) {
      fs.writeFileSync(routePath, routeTemplate.trim());
      console.log(`Auth route created successfully at ${routePath}`);
    } else {
      console.log(`Auth route already exists at ${routePath}`);
    }
  });

program
  .command('create-project <name>')
  .description('Create a new project')
  .action((name) => {
    console.log(`Creating project: ${name}`);
    createProjectStructure(name);
  });
  const runCommand = command => {
     try {
     execSync (`${command}`, {stdio: 'inherit'});
     } catch (e) {
     console.error (`Failed to execute ${command}`);
     return false;
     }
     return true;
     }

// Function to create project structure
function createProjectStructure(projectName) {
    
     const gitCheckoutCommand = `git clone --depth 1 https://github.com/firstlast3171/yuuy ${projectName}`;
     const installDepsCommand = `cd ${projectName} && npm install`;
     try {
          console.log('Repository cloning!');
          const checkedOut = runCommand(gitCheckoutCommand);
          if(!checkedOut) process.exit(code -1);
          console.log('Repository cloned successfully!');

        

          console.log(`Installing Dependencies for ${projectName}`);
          const installDep = runCommand(installDepsCommand);
          if(!installDep) process.exit(code -1);
          console.log('Installed Successfully');

          console.log('Congratulations! You are ready. Follow the following commands to start yuuy');
          console.log('');
          console.log('Here:');
          console.log('  $ yuuy make:model User');
          console.log('  $ yuuy make:controller UserController');
          console.log('  $ yuuy make:route User');
          console.log('  $ yuuy make:auth');
          console.log(`cd ${projectName} && npm run dev`);
        } catch (error) {
          console.error('Error cloning repository:', error);
        }

  // Optionally, create initial files or perform other setup tasks
}


// Display usage information if no command is provided
program.on('--help', () => {
     console.log('');
     console.log('Here:');
     console.log('  $ yuuy make:model User');
     console.log('  $ yuuy make:controller UserController');
     console.log('  $ yuuy make:route User');
     console.log('  $ yuuy make:auth');
   });
   
   // Display usage information if unknown command is provided
   program.on('command:*', () => {
     console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
     process.exit(1);
   });
   
   // Parse command-line arguments
   program.parse(process.argv);
   
   // Display usage information if no command is provided
   if (!process.argv.slice(2).length) {
     program.outputHelp();
   }


