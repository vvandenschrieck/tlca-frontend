# tlca-frontend

Frontend of the TLCA platform

## Quick install

Start by installing required dependencies:

- [Node.js](https://nodejs.org) (10+)
- [Yarn Classic](https://classic.yarnpkg.com)

Then, clone the Git repository, and launch the installation:

    > git clone https://github.com/TLCA-project/tlca-frontend.git
    > cd tlca-frontend
    > yarn install

Once successfully installed, you can run a local dev server:

    > yarn dev

And the resulting website should be available locally on [http://localhost:3000](http://localhost:3000).

## Install in Docker Development Environment

If you prefer, you can use a Docker Development Environment instead of installing the code on your machine.  With VSCode support for remote containers, you can use the IDE on your local machine to edit source files inside the container.  

First, install or upgrade Docker on your host, to have the latest Dev Env features.  
  
Two possibilities exists  : 
    - you can host the files on your local filesystem and use containers to run the application, such that any change is refleted on your local machine. 
    - or you can keep the code entirely in a container, edit the files with VSCode, check the result on your local browser and use Git to commit/push your code.  The code doesn't need to exist on your host filesystem, and you don't need to install the dependencies on your machine.  

The container image can be modified in the `.docker/config.json` file. 


### Using a Local Folder  

Start a Docker Development Environment from your Docker Dashboad.  Select "New Dev Environment", and choose source "Local Directory".  Select the tlca-frontend directory on your filesystem, and finish the interactive wizard. To open the code in VSCode, select "Open in VSCode" button next to the container.  

Once in VSCode, you can edit the source files, but also run the development server.  Open a terminal on the container, and run : 

    > yarn install
    > yarn dev

Once the server is started, you'll be able to access the backend via localhost:3000.

### Using a remote repository

Use the same procedure as above, but choose source "Existing Git Repo" and provide the URL of the repository (you can specify a specific branch preceeded by a `@` character at the end of the git URL).  As above, run : 

    > yarn install
    > yarn dev

and open localhost:3000 in your browser. 