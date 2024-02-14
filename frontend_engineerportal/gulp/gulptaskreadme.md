## FED Cartridge

Adding gulp tasks in your web Project:
##### Follow below steps:
1. import Web project (using context menus)
2. relaunch VS Code and select "Add Gulp task" from context menu. It will ask if gulp is already exist in imported project. 

2.1 If you Select YES it adds all custom gulp task and configuration file in gulp folder at the root of your project. You can open "gulp/gulpfile.js" and copy all code base including required dependencies code and place it in your main gulp task file, and then you can utilize any custom gulp task by updating it's config file.

2.2 If you Select No it adds all custom gulp task in gulp folder and it adds configuration file at the root of your project. you can utilize any custom gulp task by updating it's config file.

##### Prerequisites to use gulp tasks
Please install below required dependencies for gulp tasks
- gulp
- gulp-load-plugins
- gulp-saas
- gulp-html-replace
- run-sequence
- psi
- del
- bourbon
- node-neat
