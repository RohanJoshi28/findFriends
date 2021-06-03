# FindFriends
#### Rohan Joshi

## Purpose
Welcome to the findFriends website repository. The purpose of the website is to help in connecting with more people. In this website, users can send and accept friend requests, search for friends, look at the phone numbers and biographies of website users, and see their current friends. New friends recommended on the main page will be friends of the current friends that a user has. A natural language processing system that compares the biographies of recommended friends with the user's biography sorts the recommended friends in order of who shares the most interests. Finally, there is a simple signup system that allows users to signup with their information and then login. 

## SETUP

The setup of this repository may be slightly confusing. To get the repository running on your computer, run "npm install" to download the necessary javascript packages, including spacy (the natural language processing library.) 

After installing spacy, you need to install the packages listed on spacy's requirements.txt file through pip, for example "pip install -r requirements.txt" If this is throwing an error in command prompt, you may need to install Visual Studio C Build Tools to complete the installation of the packages listed in requirements.txt. One caveat to the requirements.txt installation is that you must have hug==2.4.1 in the requirements.txt instead of what is currently there. Here is the spacy-js documentation, with more info on installation: 
https://github.com/ines/spacy-js

Once spacy and all the other javascript packages are installed, you can run the server. To run the server using nodemon, type "npm run serve" You also need to start the spacy API on a different terminal, by navigating to the spacy directory and typing "python api/server.py", as shown in the spacy-js github readme. After that, open up the localhost port in your web browser and you should see the website!