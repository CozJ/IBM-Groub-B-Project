# Online Virtual Environment Project

## Description

This project is a virtual environment which was built to allow for virtual meetings to take place in a 3D environment and be accessible straight from any browser. It was built using A-Frame, which is a framework used to create and structure 3D environments. Along with this, Vue was used in order to help structure the project better and optimise it as much as possible for web deployment. Finally, Deepstream was used in order to provide the various connections required within the netowrk including hosting the users and allowing for screensharing.

## Project setup and run
Node.js is required for this project to allow for installation of the required packages straight from the terminal. You can find it and install it from here:
``
https://nodejs.org/en/
``
This project will also require Visual Studio Code to run, as you will need to access its terminal for the next steps. You can find that here:
``
https://code.visualstudio.com/
``
After installing Visual Studio Code, open the project in from it and open the terminal. 

After this, proceed to run the following lines in your terminal within Visual Studio Code. 
The first one will install npm and along with it all the packages which you will need to run the project. 
````
run npm install
````
The next line will package the application and run it on your local machine. 
````
run npm run serve
````
Once the application has been packaged, you will find at the bottom of the terminal the link you require to access it from any web browser. 

## NPM Commands

### Compiles and hot-reloads for development
```
npm run serve
```
### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
