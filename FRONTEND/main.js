Moralis.initialize("bRNMZ4T0gK5bw6wIalzzZOu83md5eRQx35nRy3eq");

Moralis.serverURL = 'https://13yev3ofmjtr.usemoralis.com:2053/server'

init = async () => {
    hideElement(userInfo);
    window.web3 = await Moralis.Web3.enable();
    initUser();
}

initUser = async () =>{
    if(await Moralis.User.current()){
        hideElement(userConnectButton);
        showElement(userProfileButton);
    }else{
        showElement(userConnectButton);
        hideElement(userProfileButton);
    }
}

login = async () => {
    try{
        //Sign in to meta mask
        await Moralis.Web3.authenticate();
        //Now will show correct button
        initUser();
    }catch{
        alert(error)
    }
}

logout = async () =>{
    await Moralis.User.logOut();
    hideElement(userInfo);
    initUser();
}

openUserInfo = async () => {
    user = await Moralis.User.current();
    if(user){
        //User Email
        const email = user.get('email')
        if(email)
        {
            userEmailField.value = email;
        }
        else
        {
            userEmailField.value = "";
        }

        //User Name
        userUsernameField.value = user.get('username');

        //Avatar
        const userAvatar = user.get('avatar')
        if(userAvatar)
        {
            userAvatarImg.src = userAvatar.url();
        }
        else
        {
            hideElement(userAvatarImg);
        }

        showElement(userInfo);
    }else{
        login();
    }
}

//Store all user settings
saveUserInfo = async () =>
{
    user.set('email', userEmailField.value);
    user.set('username', userUsernameField.value);

    if (userAvatarFile.files.length > 0) 
    {      
        const avatar = new Moralis.File("avatar.jpeg", userAvatarFile.files[0]);
        user.set('avatar', avatar);
    }

    //Save and display
    await user.save();
    alert("User Info saved Successfully");
    openUserInfo();
}

hideElement = (element) => element.style.display = "none";
showElement = (element) => element.style.display = "block"


//Click to Login
const userConnectButton = document.getElementById("btnConnect");
userConnectButton.onclick = login;

//Show user info when profile button clicked
const userProfileButton = document.getElementById("btnUserInfo");
userProfileButton.onclick = openUserInfo;

//Close User Info
const userInfo = document.getElementById("userInfo");
const userUsernameField = document.getElementById("txtUsername");
const userEmailField = document.getElementById("txtEmail");
const userAvatarImg = document.getElementById("imgAvatar");
const userAvatarFile = document.getElementById("fileAvatar");

document.getElementById("btnCloseUserInfo").onclick = () => hideElement(userInfo);

//Log out
document.getElementById("btnLogout").onclick = logout;

document.getElementById("btnSaveUserInfo").onclick = saveUserInfo;


init();